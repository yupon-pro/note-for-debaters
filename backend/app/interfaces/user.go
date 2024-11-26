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
	group.POST("/signup", c.SignUp)
	group.GET("/:email", c.Show)
	group.PATCH("", c.Update)
	group.PATCH("/auth", c.AuthUpdate, jwtMiddleware)
	group.DELETE("/auth", c.AuthDelete, jwtMiddleware)
}

func (c *UserController) Signin(e echo.Context) error {
	req := struct{
		Email string `json:"email"`
		Password string `json:"password"`
	}{}

	if err := e.Bind(req); err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	user, err := c.userUsecase.ReadAuthUser(req.Email)
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
			"id": strconv.Itoa(user.UserId),
			"name": user.Name,
			"email": user.Email,
		},
	})
}

func (c *UserController) SignUp(e echo.Context) error {
	var req usecase.CreateUserInput

	if err := e.Bind(&req); err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	encryptedPwd, err := encryptPwd(req.Password)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}
	req.Password = encryptedPwd

	res, err := c.userUsecase.CreateUser(&req)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}

	return e.JSON(http.StatusCreated, res)

}

// For reset process
func (c *UserController) Show(e echo.Context) error {
	email := e.Param("email")
	res, err := c.userUsecase.ReadAPIUser(email)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}
	
	return e.JSON(http.StatusOK, res.UserId)

}

func (c *UserController) Update(e echo.Context) error {
	req := &struct{
		UserId string `json:"userId"`
		Password string `json:"password"`
	}{}

	if err := e.Bind(req); err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}
	
	userId, err := strconv.Atoi(req.UserId)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}
	res, err := c.userUsecase.UpdateUser(&usecase.UpdateUserInput{
		UserId: userId,
		CreateUserInput: usecase.CreateUserInput{Password: req.Password},
	})
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}

	return e.JSON(http.StatusOK, res)

}

// For authorized user's actions
func (c *UserController) AuthUpdate(e echo.Context) error {
	uInfo, err := UserInfoViaToken(e)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, err)
	}
	var req usecase.UpdateUserInput

	if err := e.Bind(&req); err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	req.UserId = uInfo.UserId
	
	res, err := c.userUsecase.UpdateUser(&req)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}

	return e.JSON(http.StatusOK, res)

}

func (c *UserController) AuthDelete(e echo.Context) error {
	uInfo, err := UserInfoViaToken(e)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, err)
	}

	if err := c.userUsecase.DeleteUser(uInfo.UserId); err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}

	return e.String(http.StatusNoContent, "successfully deleted")
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
		return fmt.Errorf("the password doesn't match: %w", err)
	}
	return nil
}