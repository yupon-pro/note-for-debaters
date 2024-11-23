package interfaces

import (
	"github.com/labstack/echo/v4"
)

type Controllers struct {
	noteController *NoteController
	userController *UserController
}

func NewControllers(
	noteController *NoteController,
	userController *UserController,
	) *Controllers {
	return &Controllers{
		noteController: noteController,
		userController: userController,
	}
}

func (c *Controllers) Mount(e *echo.Echo) {
	jwtMiddleware := ApplyJWTMiddleware()
	c.noteController.Mount(e.Group("/note"), jwtMiddleware)
	c.userController.Mount(e.Group("/user"), jwtMiddleware)
}
