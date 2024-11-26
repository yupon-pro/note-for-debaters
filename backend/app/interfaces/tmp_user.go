package interfaces

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/yupon-pro/note-for-debater/usecase"
)


type TmpUserController struct {
	tmpUserUsecase usecase.TmpUserUsecase
}

func NewTmpUserController(tmpUserUsecase usecase.TmpUserUsecase) *TmpUserController {
	return &TmpUserController{
		tmpUserUsecase: tmpUserUsecase,
	}
}

func (c *TmpUserController) Mount(group *echo.Group) {
	group.POST("", c.Save)
	group.GET("/:code", c.Show)
	group.DELETE("/:code", c.Delete)
}

func (c *TmpUserController) Save(e echo.Context) error {
	var req usecase.SaveTmpUserInput

	if err := e.Bind(&req); err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	res, err := c.tmpUserUsecase.SaveTmpUser(&req)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}

	signUpData := struct{
		name string
		email string
		password string
	}{
		name: res.Name,
		email: res.Email,
		password: res.Password,
	}

	return e.JSON(http.StatusCreated, signUpData)

}

// For reset process
func (c *TmpUserController) Show(e echo.Context) error {
	mailCode := e.Param("code")
	res, err := c.tmpUserUsecase.ReadTmpUser(mailCode)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}

	signUpData := struct{
		name string
		email string
		password string
	}{
		name: res.Name,
		email: res.Email,
		password: res.Password,
	}
	
	return e.JSON(http.StatusOK, signUpData)

}


func (c *TmpUserController) Delete(e echo.Context) error {
	mailCode := e.Param("code")
	if err := c.tmpUserUsecase.DeleteTmpUser(mailCode); err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}

	return e.String(http.StatusNoContent, "successfully deleted")
}