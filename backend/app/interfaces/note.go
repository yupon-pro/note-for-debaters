package interfaces

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/yupon-pro/note-for-debater/usecase"
)

type NoteController struct {
	noteUsecase usecase.NoteUsecase
}

func NewNoteController(noteUsecase usecase.NoteUsecase) *NoteController {
	return &NoteController{
		noteUsecase: noteUsecase,
	}
}

func (c *NoteController) Mount(group *echo.Group, jwtMiddleware echo.MiddlewareFunc) {
	group.GET("/:id", c.Show, jwtMiddleware)
	group.GET("/", c.ShowAll, jwtMiddleware)
	group.GET("/latest", c.ShowLatest, jwtMiddleware)
	group.POST("/", c.Create, jwtMiddleware)
	group.PATCH("/:id", c.Update, jwtMiddleware)
	group.DELETE("/:id", c.Delete, jwtMiddleware)
}

func (c *NoteController) Show(e echo.Context) error {
	id, err := strconv.Atoi(e.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	note, err := c.noteUsecase.ReadNote(id)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, err)
	}

	return e.JSON(http.StatusOK, note)
}

func (c *NoteController) ShowAll(e echo.Context) error {
	id, err := strconv.Atoi(e.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	note, err := c.noteUsecase.ReadAllNotes(id)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, err)
	}

	return e.JSON(http.StatusOK, note)
}

func (c *NoteController) ShowLatest(e echo.Context) error {
	uToken, err := UserInfoViaToken(e)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, err)
	}
	note, err := c.noteUsecase.ReadLatestNote(uToken.UserId)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, err)
	}

	return e.JSON(http.StatusOK, note)
}

func (c *NoteController) Create(e echo.Context) error {
	req := &struct {
		UserId int
		Title string
		Script string
		Table string
	}{}
	if err := e.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	err := c.noteUsecase.CreateNote(
		&usecase.CreateNoteInput{
			UserId: req.UserId,
			Title: req.Title,
			Script: req.Script,
			Table: req.Table,
		},
	)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	return e.String(http.StatusCreated, "status ok")
}

func (c *NoteController) Update(e echo.Context) error {
	req := &struct {
		NoteId int
		UserId int
		Title string
		Script string
		Table string
	}{}
	if err := e.Bind(req); err != nil {
		return err
	}

	err := c.noteUsecase.UpdateNote(
		&usecase.UpdateNoteInput{
			NoteId: req.NoteId,
			CreateNoteInput: usecase.CreateNoteInput{
				UserId: req.UserId,
				Title: req.Title,
				Script: req.Script,
				Table: req.Table,
			},
		},
	)
	if err != nil {
		return err
	}

	return e.String(http.StatusOK, "status ok")
}

func (c *NoteController) Delete(e echo.Context) error {
	id, err := strconv.Atoi(e.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	if err := c.noteUsecase.DeleteNote(id); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	return e.String(http.StatusNoContent, "status ok")
}