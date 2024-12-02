package interfaces

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/yupon-pro/note-for-debater/domain"
	"github.com/yupon-pro/note-for-debater/usecase"
	"github.com/yupon-pro/note-for-debater/utils"
)


type UserController struct {
	userUsecase usecase.UserUsecase
}

func NewUserController(userUsecase usecase.UserUsecase) *UserController {
	return &UserController{
		userUsecase: userUsecase,
	}
}

func (c *UserController) Mount(group *echo.Group, jwtMiddleware echo.MiddlewareFunc) {
	group.POST("/signin", c.Signin) // checked, 2024/12/01 
	group.GET("/:email", c.Show) // checked, 2024/12/01 
	group.PATCH("", c.Update) // checked, 2024/12/01
	group.PATCH("/auth", c.AuthUpdate, jwtMiddleware) // checked, 2024/12/01
	group.DELETE("/auth", c.AuthDelete, jwtMiddleware) // checked, 2024/12/01
}

func (c *UserController) Signin(e echo.Context) error {
	req := struct{
		Email string `json:"email" form:"email"`
		Password string `json:"password" form:"password"`
	}{}

	if err := e.Bind(&req); err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	user, err := c.userUsecase.ReadAuthUser(req.Email)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	hashPwd := user.Password
	reqPwd := req.Password

	if err := utils.ComparePwd(hashPwd, reqPwd); err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}
	
	t, err := GetJWTToken(user.Email, user.UserId)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	return e.JSON(http.StatusOK, echo.Map{
		"accessToken": t,
		"user": map[string]string{
			"id": strconv.Itoa(user.UserId),
			"name": user.Name,
			"email": user.Email,
		},
	})
}

// For reset process
func (c *UserController) Show(e echo.Context) error {
	email := e.Param("email")
	res, err := c.userUsecase.ReadAPIUser(email)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}
	
	return e.JSON(http.StatusOK, userMapper(res))

}

func (c *UserController) Update(e echo.Context) error {
	req := &struct{
		UserId string `json:"id" form:"id"`
		Password string `json:"password" form:"password"`
	}{}

	if err := e.Bind(req); err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}
	
	userId, err := strconv.Atoi(req.UserId)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	hashPwd, err := utils.EncryptPwd(req.Password)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	res, err := c.userUsecase.UpdateUser(
		usecase.UpdateUserInput{
			UserId: userId,
			CreateUserInput: usecase.CreateUserInput{Password: hashPwd},
		},
	)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}

	return e.JSON(http.StatusOK, userMapper(res))

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

	hashPwd, err := utils.EncryptPwd(req.Password)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}
	req.Password = hashPwd
	
	res, err := c.userUsecase.UpdateUser(req)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}

	return e.JSON(http.StatusOK, userMapper(res))

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

func userMapper(user *domain.APIUser) echo.Map{
	return echo.Map{
		"id": user.UserId,
		"name": user.Name,
		"email": user.Email,
	}
}