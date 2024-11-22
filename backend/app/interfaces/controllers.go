package interfaces

import (
	"github.com/labstack/echo/v4"
)

type Controllers struct {
	noteController *NoteController
}

func NewControllers(noteController *NoteController) *Controllers {
	return &Controllers{
		noteController: noteController,
	}
}

func (c *Controllers) Mount(group *echo.Group) {
	c.noteController.Mount(group)
}
