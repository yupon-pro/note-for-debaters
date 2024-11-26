package interfaces

import (
	"github.com/labstack/echo/v4"
)

type Controllers struct {
	noteController *NoteController
	userController *UserController
	tmpUserController *TmpUserController
	resetPwdController *ResetPwdController
}

func NewControllers(
	noteController *NoteController,
	userController *UserController,
	tmpUserController *TmpUserController,
	resetPwdController *ResetPwdController,
	) *Controllers {
	return &Controllers{
		noteController: noteController,
		userController: userController,
		tmpUserController: tmpUserController,
		resetPwdController: resetPwdController,
	}
}

func (c *Controllers) Mount(e *echo.Echo) {
	jwtMiddleware := ApplyJWTMiddleware()
	c.noteController.Mount(e.Group("/note"), jwtMiddleware)
	c.userController.Mount(e.Group("/user"), jwtMiddleware)
	c.tmpUserController.Mount(e.Group("/tentative_user"))
	c.resetPwdController.Mount(e.Group("/reset_pwd"))
}
