package interfaces

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/yupon-pro/note-for-debater/domain"
	"github.com/yupon-pro/note-for-debater/usecase"
	"github.com/yupon-pro/note-for-debater/utils"
)

type MemoController struct {
	memoUsecase usecase.MemoUsecase
}

func NewMemoController(memoUsecase usecase.MemoUsecase) *MemoController {
	return &MemoController{
		memoUsecase: memoUsecase,
	}
}

func (c *MemoController) Mount(group *echo.Group, jwtMiddleware echo.MiddlewareFunc) {
	group.GET("/all/:id", c.ShowAll, jwtMiddleware)
	group.POST("", c.Create, jwtMiddleware)
	group.PATCH("", c.Update, jwtMiddleware)
	group.DELETE("/:id", c.Delete, jwtMiddleware)
}

func (c *MemoController) ShowAll(e echo.Context) error {
	noteId, err := strconv.Atoi(e.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	memos, err := c.memoUsecase.ReadAllMemos(noteId)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, err)
	}

	return e.JSON(http.StatusOK, utils.Map(memos, memoMapper))
}

func (c *MemoController) Create(e echo.Context) error {
	req := &usecase.CreateMemoInput{}
	if err := e.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	memo, err := c.memoUsecase.CreateMemo(req)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	return e.JSON(http.StatusCreated, memoMapper(*memo))
}

func (c *MemoController) Update(e echo.Context) error {
	req := &usecase.UpdateMemoInput{}
	if err := e.Bind(req); err != nil {
		return err
	}

	memo, err := c.memoUsecase.UpdateMemo(req)
	if err != nil {
		return err
	}

	return e.JSON(http.StatusCreated, memoMapper(*memo))
}

func (c *MemoController) Delete(e echo.Context) error {
	memoServerId, err := strconv.Atoi(e.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	if err := c.memoUsecase.DeleteMemo(memoServerId); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	return e.String(http.StatusNoContent, "status ok")
}

func memoMapper(memo domain.Memo) echo.Map {
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