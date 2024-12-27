package interfaces

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/yupon-pro/note-for-debater/domain"
	"github.com/yupon-pro/note-for-debater/usecase"
)

type ResetPwdResponse struct{
	Id string `json:"id"`
	Token string `json:"token"`
	Email string `json:"email"`
}

type ResetPwdController struct {
	resetPwdUsecase usecase.ResetPwdUsecase
}

func NewResetPwdController(resetPwdUsecase usecase.ResetPwdUsecase) *ResetPwdController {
	return &ResetPwdController{
		resetPwdUsecase: resetPwdUsecase,
	}
}

func (c *ResetPwdController) Mount(group *echo.Group) {
	group.POST("", c.Create) // checked, 2024/12/01
	group.GET("/:token", c.Show) // checked, 2024/12/01
	group.DELETE("/:token", c.Delete) // checked, 2024/12/01
}

// @Summary Save tentative token for resetting password.
// @Description This is called when you want to reset password.
// @Tags Reset
// @Accept json
// @Produce json
// @Param request body usecase.SaveResetPwdInput true "This request requires token that is issued to user."
// @Success 201 {object} ResetPwdResponse "Returns information for identification with token."
// @Failure 400 {object} error "server error"
// @Router /reset_pwd [post]
func (c *ResetPwdController) Create(e echo.Context) error {
	var req usecase.SaveResetPwdInput

	if err := e.Bind(&req); err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	res, err := c.resetPwdUsecase.SaveResetPwd(req)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}

	return e.JSON(http.StatusCreated, resetMapper(res))

}

// For reset process
// @Summary Show tentative token for resetting password.
// @Description This is called when you want to reset password.
// @Tags Reset
// @Accept json
// @Produce json
// @Param token query string true "This function shows information for identification and verify the token."
// @Success 200 {object} ResetPwdResponse "Returns information for identification with token."
// @Failure 400 {object} error "no token or server error"
// @Router /reset_pwd/{token} [get]
func (c *ResetPwdController) Show(e echo.Context) error {
	mailCode := e.Param("token")
	res, err := c.resetPwdUsecase.ReadResetPwd(mailCode)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}
	
	return e.JSON(http.StatusOK, resetMapper(res))

}

// @Summary Delete token information permanently.
// @Description This is called when you want to reset password.
// @Tags Reset
// @Accept json
// @Produce json
// @Param token query string true "This function delete information for identification."
// @Success 204 string string "Returns no content."
// @Failure 400 {object} error "server error."
// @Router /reset_pwd/{token} [delete]
func (c *ResetPwdController) Delete(e echo.Context) error {
	mailCode := e.Param("token")
	if err := c.resetPwdUsecase.DeleteResetPwd(mailCode); err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}
	
	return e.NoContent(http.StatusNoContent)
}

func resetMapper(user *domain.ResetPwd) ResetPwdResponse{
	return ResetPwdResponse{
		Id: strconv.Itoa(user.UserId),
		Token: user.Token,
		Email: user.Email,
	}
}