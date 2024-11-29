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
	group.DELETE("/:token", c.Delete)
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

	return e.JSON(http.StatusCreated, echo.Map{
		"token": res.Token,
		"email": res.Email,
		"id": res.UserId,
	})

}

// For reset process
func (c *ResetPwdController) Show(e echo.Context) error {
	mailCode := e.Param("token")
	res, err := c.resetPwdUsecase.ReadResetPwd(mailCode)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}
	
	return e.JSON(http.StatusOK, echo.Map{
		"token": res.Token,
		"email": res.Email,
		"id": res.UserId,
	})

}

func (c *ResetPwdController) Delete(e echo.Context) error {
	mailCode := e.Param("token")
	if err := c.resetPwdUsecase.DeleteResetPwd(mailCode); err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}
	
	return e.String(http.StatusNoContent, "successfully eliminated.")

}