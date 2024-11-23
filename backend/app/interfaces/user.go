package interfaces

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	jwt "github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"github.com/yupon-pro/note-for-debater/usecase"
	"github.com/yupon-pro/note-for-debater/utils"
	"golang.org/x/crypto/bcrypt"
)

type jwtCustomClaims struct {
	Email string `json:"email"`
	UserId int   `json:"userId"`
	jwt.RegisteredClaims
}

type UserController struct {
	userUsecase usecase.UserUsecase
}

func NewUserController(userUsecase usecase.UserUsecase) *UserController {
	return &UserController{
		userUsecase: userUsecase,
	}
}

func (c *UserController) Mount(group *echo.Group, jwtMiddleware echo.MiddlewareFunc) {
	group.POST("/signin", c.Signin)
}

func (c *UserController) Signin(e echo.Context) error {
	req := struct{
		Email string
		Password string
	}{}

	if err := e.Bind(req); err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	user, err := c.userUsecase.ReadUser(req.Email)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	hashPwd := user.Password
	reqPwd := req.Password
	if err := comparePwd(hashPwd, reqPwd); err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	claims := &jwtCustomClaims{
		user.Email,
		user.UserId,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	JWTSecret, err := utils.GetJWTSecret()
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	t, err := token.SignedString([]byte(JWTSecret))
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	return e.JSON(http.StatusOK, echo.Map{
		"accessToken": t,
		"user": echo.Map{
			"userId": strconv.Itoa(user.UserId),
			"name": user.Name,
			"email": user.Email,
			"createdAt": user.CreatedAt.String(),
			"updatedAt": user.UpdatedAt.String(),
		},
	})

}


func encryptPwd(password string) (string, error) {
	hashPwd, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashPwd), nil
}

func comparePwd(hashPwd, reqPwd string) error {
	if err := bcrypt.CompareHashAndPassword([]byte(hashPwd), []byte(reqPwd)); err != nil{
		return fmt.Errorf("The password doesn't match: %w", err)
	}
	return nil
}