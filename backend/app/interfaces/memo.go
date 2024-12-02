package interfaces

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/yupon-pro/note-for-debater/usecase"
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
	group.DELETE("/:id", c.Delete, jwtMiddleware)
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
