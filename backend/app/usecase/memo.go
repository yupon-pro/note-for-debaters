package usecase

import (
	"github.com/yupon-pro/note-for-debater/domain"
)

type CreateMemoInput struct{
	ClientMemoId string `json:"clientMemoId" form:"clientMemoId"`
  UserId int `json:"userId" form:"userId"`
	X string `json:"x" form:"x"`
	Y string `json:"y" form:"y"`
	Width string `json:"width" form:"width"`
	Height string `json:"height" form:"height"`
	Content string `json:"content" form:"content"`
}

type UpdateMemoInput struct{
	ServerMemoId int `json:"serverMemoId" form:"serverMemoId"`
	NoteId int `json:"noteId" form:"noteId"`
	CreateMemoInput
}

type MemoUsecase interface{
	DeleteMemo(serverMemoId int) error	
}

type memoUsecase struct{
	memoRepository domain.MemoRepository
}

func NewMemoUsecase (memoRepository domain.MemoRepository) MemoUsecase{
	return &memoUsecase{ memoRepository: memoRepository }
}


func (m *memoUsecase) DeleteMemo(serverMemoId int) error {
	if err := m.memoRepository.DeleteByMemoId(serverMemoId); err != nil{
		return err
	}
	return nil	
}