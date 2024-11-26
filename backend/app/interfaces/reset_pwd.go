package interfaces

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/yupon-pro/note-for-debater/usecase"
)


type ResetPwdController struct {
	resetPwdUsecase usecase.ResetPwdUsecase
}

func NewResetPwdController(resetPwdUsecase usecase.ResetPwdUsecase) *ResetPwdController {
	return &ResetPwdController{
		resetPwdUsecase: resetPwdUsecase,
	}
}

func (c *ResetPwdController) Mount(group *echo.Group) {
	group.POST("", c.Create)
	group.GET("/:token", c.Show)
}

func (c *ResetPwdController) Create(e echo.Context) error {
	var req usecase.SaveResetPwdInput

	if err := e.Bind(&req); err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	res, err := c.resetPwdUsecase.SaveResetPwd(&req)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}

	resetPwd := struct{
		token string
		email string
		id int
	}{
		token: res.Token,
		email: res.Email,
		id: res.UserId,
	}

	return e.JSON(http.StatusCreated, resetPwd)

}

// For reset process
func (c *ResetPwdController) Show(e echo.Context) error {
	mailCode := e.Param("token")
	res, err := c.resetPwdUsecase.ReadResetPwd(mailCode)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}

	resetPwd := struct{
		token string
		email string
		id int
	}{
		token: res.Token,
		email: res.Email,
		id: res.UserId,
	}
	
	return e.JSON(http.StatusOK, resetPwd)

}