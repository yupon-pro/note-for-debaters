package interfaces

import (
	// "fmt"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/yupon-pro/note-for-debater/usecase"
)

type SaveResponse struct{
	Name string `json:"name"`
	Email string `json:"email"`
}

type SignUpResponse struct{
	AccessToken string `json:"accessToken"`
	User UserResponse `json:"user"`	
}

type SignUpController struct {
	signUpUsecase usecase.SignUpUsecase
}

func NewSignUpController(signUpUsecase usecase.SignUpUsecase) *SignUpController {
	return &SignUpController{
		signUpUsecase: signUpUsecase,
	}
}

func (c *SignUpController) Mount(group *echo.Group) {
	group.POST("/tentative_user", c.Save) // checked, 2024/12/01
	group.POST("/user", c.SignUp) // checked, 2024/12/01
}

// Save handles saving a temporary user
// @Summary Create a temporary user
// @Description Save a new temporary user with the given details
// @Tags TentativeUser
// @Accept json
// @Produce json
// @Param request body usecase.SaveTmpUserInput true "Temporary User Information"
// @Success 201 {object} SaveResponse "Returns the saved user information"
// @Failure 400 {object} error "Invalid input"
// @Router /sign_up/tentative_user [post]
func (c *SignUpController) Save(e echo.Context) error {
	var req usecase.SaveTmpUserInput

	if err := e.Bind(&req); err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	res, err := c.signUpUsecase.SaveTmpUser(req)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}

	return e.JSON(http.StatusCreated, SaveResponse{
		Name: res.Name,
		Email: res.Email,
	})

}

// SignUp finalizes user registration
// @Summary Finalize user sign-up
// @Description Complete the user registration process with the provided mail code
// @Tags User
// @Produce json
// @Param mailCode body string true "Mail code for user verification"
// @Success 201 {object} SignUpResponse "Returns the access token and user information"
// @Failure 400 {object} error "Invalid mail code or server error"
// @Router /sign_up/user [post]
func (c *SignUpController) SignUp(e echo.Context) error {
	mailCode := e.FormValue("mailCode")

	user, err := c.signUpUsecase.SignUp(mailCode)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}
	
	t, err := GetJWTToken(user.Email, user.UserId)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	return e.JSON(http.StatusCreated, SignUpResponse{
		AccessToken: t,
		User: UserResponse{
			Id: strconv.Itoa(user.UserId),
			Name: user.Name,
			Email: user.Email,
		},
	})

}

// [Notation]
// Swagger comments described to handler function must be neighboring.
// No blank row must exist between comments and a function.