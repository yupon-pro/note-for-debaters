package interfaces

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/yupon-pro/note-for-debater/domain"
	"github.com/yupon-pro/note-for-debater/usecase"
	"github.com/yupon-pro/note-for-debater/utils"
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
	group.GET("", c.ShowAll, jwtMiddleware)
	group.GET("/latest", c.ShowLatest, jwtMiddleware)
	group.POST("", c.Create, jwtMiddleware)
	group.PATCH("", c.Update, jwtMiddleware)
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

	return e.JSON(http.StatusOK, noteMapper(*note))
}

func (c *NoteController) ShowAll(e echo.Context) error {
	uInfo, err := UserInfoViaToken(e)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, err)
	}

	notes, err := c.noteUsecase.ReadAllNotes(uInfo.UserId)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, err)
	}

	return e.JSON(http.StatusOK, utils.Map(notes, noteMapper))
}

func (c *NoteController) ShowLatest(e echo.Context) error {
	uInfo, err := UserInfoViaToken(e)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, err)
	}
	note, err := c.noteUsecase.ReadLatestNote(uInfo.UserId)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, err)
	}

	return e.JSON(http.StatusOK, noteMapper(*note))
}

func (c *NoteController) Create(e echo.Context) error {
	req := usecase.CreateNoteInput{}
	if err := e.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	note, err := c.noteUsecase.CreateNote(req)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	return e.JSON(http.StatusCreated, noteMapper(*note))
}

func (c *NoteController) Update(e echo.Context) error {
	req := usecase.UpdateNoteInput{}
	if err := e.Bind(&req); err != nil {
		return err
	}

	note, err := c.noteUsecase.UpdateNote(req)
	if err != nil {
		return err
	}

	return e.JSON(http.StatusCreated, noteMapper(*note))
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

func noteMapper(note domain.Note) echo.Map {
	memos := make([]echo.Map, len(note.Memos))
	for i, memo := range note.Memos{
		memos[i] = memoMapper(memo)
	}

	return echo.Map{
		"noteId": note.NoteId,
		"userId": note.UserId,
		"user": echo.Map{
			"id": note.User.UserId,
			"name": note.User.Name,
			"email": note.User.Email,
		},
		"memos": memos,
		"title": note.Title,
		"script": note.Script,
		"table": note.Table,
		"updatedAt": note.UpdatedAt,
		"createdAt": note.CreatedAt,
	}
}

func memoMapper(memo domain.Memo) echo.Map{
	return echo.Map{
		"clientMemoId": memo.ClientMemoId,
		"serverMemoId": memo.ServerMemoId,
		"noteId": memo.NoteId,
		"userId": memo.UserId,
		"user": echo.Map{
			"id": memo.User.UserId,
			"name": memo.User.Name,
			"email": memo.User.Email,
		},
		"x":memo.X,
		"y":memo.Y,
		"width":memo.Width,
		"height":memo.Height,
		"content":memo.Content,
		"updatedAt": memo.UpdatedAt,
		"createdAt": memo.CreatedAt,
	}
}