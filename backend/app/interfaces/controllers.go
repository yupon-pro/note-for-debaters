package interfaces

import (
	"github.com/labstack/echo/v4"
)

type Controllers struct {
	noteController *NoteController
	MemoController *MemoController
	userController *UserController
	SignUpController *SignUpController
	resetPwdController *ResetPwdController
}

func NewControllers(
	noteController *NoteController,
	MemoController *MemoController,
	userController *UserController,
	SignUpController *SignUpController,
	resetPwdController *ResetPwdController,
	) *Controllers {
	return &Controllers{
		noteController: noteController,
		MemoController: MemoController,
		userController: userController,
		SignUpController: SignUpController,
		resetPwdController: resetPwdController,
	}
}

func (c *Controllers) Mount(e *echo.Echo) {
	jwtMiddleware := ApplyJWTMiddleware()
	c.noteController.Mount(e.Group("/note"), jwtMiddleware)
	c.MemoController.Mount(e.Group("/memo"), jwtMiddleware)
	c.userController.Mount(e.Group("/user"), jwtMiddleware)
	c.SignUpController.Mount(e.Group("/sign_up"))
	c.resetPwdController.Mount(e.Group("/reset_pwd"))
}
