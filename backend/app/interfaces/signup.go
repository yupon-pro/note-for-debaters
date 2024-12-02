package interfaces

import (
	// "fmt"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/yupon-pro/note-for-debater/usecase"
)


type SignUpController struct {
	signUpService usecase.SignUpUsecase
}

func NewSignUpController(signUpService usecase.SignUpUsecase) *SignUpController {
	return &SignUpController{
		signUpService: signUpService,
	}
}

func (c *SignUpController) Mount(group *echo.Group) {
	group.POST("/tentative_user", c.Save) // checked, 2024/12/01
	group.POST("/user", c.SignUp) // checked, 2024/12/01
}

func (c *SignUpController) Save(e echo.Context) error {
	var req usecase.SaveTmpUserInput

	if err := e.Bind(&req); err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	res, err := c.signUpService.SaveTmpUser(req)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}

	return e.JSON(http.StatusCreated, echo.Map{
		"name": res.Name,
		"email": res.Email,
	})

}

func (c *SignUpController) SignUp(e echo.Context) error {
	mailCode := e.FormValue("mailCode")

	user, err := c.signUpService.SignUp(mailCode)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}
	
	t, err := GetJWTToken(user.Email, user.UserId)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	return e.JSON(http.StatusCreated, echo.Map{
		"accessToken": t,
		"user": map[string]string{
			"id": strconv.Itoa(user.UserId),
			"name": user.Name,
			"email": user.Email,
		},
	})

}