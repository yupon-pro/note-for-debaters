package interfaces

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/yupon-pro/note-for-debater/service"
)


type SignUpController struct {
	signUpUsecase service.SignUpUsecase
}

func NewSignUpController(signUpUsecase service.SignUpUsecase) *SignUpController {
	return &SignUpController{
		signUpUsecase: signUpUsecase,
	}
}

func (c *SignUpController) Mount(group *echo.Group) {
	group.POST("/register", c.Save)
	group.POST("/authenticate", c.SignUp)
}

func (c *SignUpController) Save(e echo.Context) error {
	var req service.SaveTmpUserInput

	if err := e.Bind(&req); err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	res, err := c.signUpUsecase.SaveTmpUser(&req)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}

	return e.JSON(http.StatusCreated, echo.Map{
		"name": res.Name,
		"email": res.Email,
	})

}

// For reset process
func (c *SignUpController) SignUp(e echo.Context) error {
	mailCode := e.FormValue("code")

	userInfo, err := c.signUpUsecase.ReadTmpUser(mailCode)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}

	if err := c.signUpUsecase.DeleteTmpUser(mailCode); err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}

	user, err := c.signUpUsecase.CreateUser(&service.CreateUserInput{
		Name: userInfo.Name,
		Email: userInfo.Email,
		Password: userInfo.Password,
	})
	if err != nil{
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