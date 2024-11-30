package usecase

import (
	"github.com/yupon-pro/note-for-debater/domain"
)

type CreateMemoInput struct{
	ClientMemoId string `json:"clientMemoId" form:"clientMemoId"`
  UserId int `json:"userId" form:"userId"`
	NoteId int `json:"noteId" form:"noteId"`
	X string `json:"x" form:"x"`
	Y string `json:"y" form:"y"`
	Width string `json:"width" form:"width"`
	Height string `json:"height" form:"height"`
	Content string `json:"content" form:"content"`
}

type UpdateMemoInput struct{
	ServerMemoId int `json:"serverMemoId" form:"serverMemoId"`
	CreateMemoInput
}

type MemoUsecase interface{
	ReadAllMemos(noteId int) ([]domain.Memo, error)
	CreateMemo(input *CreateMemoInput) (*domain.Memo, error)
	UpdateMemo(input *UpdateMemoInput) (*domain.Memo, error)
	DeleteMemo(serverMemoId int) error	
}

type memoUsecase struct{
	memoRepository domain.MemoRepository
}

func NewMemoUsecase (memoRepository domain.MemoRepository) MemoUsecase{
	return &memoUsecase{ memoRepository: memoRepository }
}


func (m *memoUsecase) ReadAllMemos(noteId int) ([]domain.Memo, error){
	memos, err := m.memoRepository.ReadAll(noteId)
	if err != nil{
		return nil, err
	}
	return memos, nil
}

func (m *memoUsecase) CreateMemo(input *CreateMemoInput) (*domain.Memo, error) {
	memo := &domain.Memo{
		ClientMemoId: input.ClientMemoId,
		UserId: input.UserId,
		NoteId: input.NoteId,
		X: input.X,
		Y: input.Y,
		Width: input.Width,
		Height: input.Height,
		Content: input.Content,
	}
	
	resMemo, err := m.memoRepository.Create(memo)
	if err != nil{
		return nil, err
	}
	return resMemo, nil
}

func (m *memoUsecase) UpdateMemo(input *UpdateMemoInput) (*domain.Memo, error) {
	memo := &domain.Memo{
		ServerMemoId: input.ServerMemoId,
		X: input.X,
		Y: input.Y,
		Width: input.Width,
		Height: input.Height,
		Content: input.Content,
	}
	resMemo, err := m.memoRepository.Update(memo)
	if  err != nil{
		return nil, err
	}
	return resMemo, nil
}

func (m *memoUsecase) DeleteMemo(serverMemoId int) error {
	if err := m.memoRepository.Delete(serverMemoId); err != nil{
		return err
	}
	return nil	
}