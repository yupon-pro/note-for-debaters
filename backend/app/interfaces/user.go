package interfaces

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/yupon-pro/note-for-debater/domain"
	"github.com/yupon-pro/note-for-debater/usecase"
	"github.com/yupon-pro/note-for-debater/utils"
)

// [Notation]
// In echo framework, the struct can be encoded to json struct.
// Refer to https://echo.labstack.com/docs/response

type UserResponse struct {
	Id string `json:"id"`
	Name string `json:"name"`
	Email string `json:"email"`
}

type SignInResponse struct{
	AccessToken string `json:"accessToken"`
	User UserResponse `json:"user"`
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
	group.POST("/signin", c.Signin) // checked, 2024/12/01 
	group.GET("/:email", c.Show) // checked, 2024/12/01 
	group.PATCH("", c.Update) // checked, 2024/12/01
	group.PATCH("/auth", c.AuthUpdate, jwtMiddleware) // checked, 2024/12/01
	group.DELETE("/auth", c.AuthDelete, jwtMiddleware) // checked, 2024/12/01
}

// SignUp finalizes user registration
// @Summary user signin
// @Description This is a signin process eventually returning a jwt token.
// @Tags User
// @Accept json
// @Produce json
// @Param email body string true "Email that is used for identification"
// @Param password body string true "Password that is used for verification"
// @Success 200 {object} SignInResponse "Returns the access token and user information"
// @Failure 400 {object} error "Invalid mail code or server error"
// @Router /user/signin [post]
func (c *UserController) Signin(e echo.Context) error {
	fmt.Println("signin method has been called.")
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

	return e.JSON(http.StatusOK, SignInResponse{
		AccessToken: t,
		User: UserResponse{
			Id: strconv.Itoa(user.UserId),
			Name: user.Name,
			Email: user.Email,
		},
	})
}

// For reset process
// @Summary Display the user information by a provided email.
// @Description This is for returning a user information. This may also have function to verify the user.
// @Tags User
// @Accept json
// @Produce json
// @Param email query string true "Email that is used for identification"
// @Success 200 {object} UserResponse "Returns user information"
// @Failure 400 {object} error "Invalid mail code or server error"
// @Router /user/{email} [get]
func (c *UserController) Show(e echo.Context) error {
	email := e.Param("email")
	res, err := c.userUsecase.ReadAPIUser(email)
	if err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}
	
	return e.JSON(http.StatusOK, userMapper(res))

}

// @Summary Update without access token..
// @Description This is called when you want to update set password.
// @Tags User
// @Accept json
// @Produce json
// @Param id body string true "This corresponds with user table."
// @Param password body string true "New password."
// @Success 200 {object} UserResponse "Returns user information"
// @Failure 400 {object} error "Invalid mail code or server error"
// @Router /user [patch]
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
// @Summary Update the user information.
// @Description This function is called when a user wants to update an account information. Access token is necessary.
// @Tags User
// @Accept json
// @Produce json
// @Security APiKeyAuth
// @Params Authorization header string true "Authorization"
// @Param request body usecase.UpdateUserInput true "Email that is used for identification"
// @Success 200 {object} UserResponse "Returns user information"
// @Failure 400 {object} error "Invalid mail code or server error"
// @Router /user/auth [patch]
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

// @Summary Delete account.
// @Description This function is called when a user wants to eliminate an account. This function needs access token.
// @Tags User
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @param Authorization header string true "Authorization"
// @Success 204 string string "Returns no content because there is not user information anymore."
// @Failure 400 {object} error "Invalid mail code or server error"
// @Router /user [delete]
func (c *UserController) AuthDelete(e echo.Context) error {
	uInfo, err := UserInfoViaToken(e)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, err)
	}

	if err := c.userUsecase.DeleteUser(uInfo.UserId); err != nil{
		return echo.NewHTTPError(http.StatusBadRequest, err)	
	}

	return e.NoContent(http.StatusNoContent)
}

func userMapper(user *domain.APIUser) UserResponse{
	return UserResponse{
		Id: strconv.Itoa(user.UserId),
		Name: user.Name,
		Email : user.Email,
	}
}