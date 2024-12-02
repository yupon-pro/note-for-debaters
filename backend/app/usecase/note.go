package usecase

import (
	"github.com/yupon-pro/note-for-debater/domain"
	"github.com/yupon-pro/note-for-debater/infrastructure"
)

type CreateNoteInput struct{
  UserId int	`json:"userId" form:"userId"`
	Title string `json:"title" form:"title"`
  Table string `json:"table" form:"table"`
  Script string `json:"script" form:"script"`
  Memos []CreateMemoInput
}

type UpdateNoteInput struct{
	NoteId int `json:"noteId" form:"noteId"`
	UserId int	`json:"userId" form:"userId"`
	Title string `json:"title" form:"title"`
  Table string `json:"table" form:"table"`
  Script string `json:"script" form:"script"`
  Memos []UpdateMemoInput
}

type NoteUsecase interface{
	ReadNote(noteId int) (*domain.Note, error)
	ReadAllNotes(userId int) ([]domain.Note, error)
	ReadLatestNote(userId int) (*domain.Note, error)
	CreateNote(input CreateNoteInput) (*domain.Note, error)
	UpdateNote(input UpdateNoteInput) (*domain.Note, error)
	DeleteNote(noteId int) error	
}


type noteUsecase struct{
	noteRepository domain.NoteRepository
  memoRepository domain.MemoRepository
  transaction infrastructure.Transaction
}

func NewNoteUsecase (
  noteRepository domain.NoteRepository,
  memoRepository domain.MemoRepository,
  transaction infrastructure.Transaction,
  ) NoteUsecase{
	return &noteUsecase{ 
    noteRepository: noteRepository, 
    memoRepository: memoRepository,
    transaction: transaction,
  }
}


func (n *noteUsecase) ReadNote(noteId int) (*domain.Note, error){
	note, err := n.noteRepository.Read(noteId)
	if err != nil{
		return nil, err
	}
	return note, nil

}

func (n *noteUsecase) ReadAllNotes(userId int) ([]domain.Note, error){
	notes, err := n.noteRepository.ReadAll(userId)
	if err != nil{
		return nil, err
	}
	return notes, nil
}

func (n *noteUsecase) ReadLatestNote(userId int) (*domain.Note, error){
	note, err := n.noteRepository.ReadLatest(userId)
	if err != nil{
		return nil, err
	}
	return note, nil
}

func (n *noteUsecase) CreateNote(input CreateNoteInput) (*domain.Note, error) {
  n.transaction.Begin()
	defer func() {
		if r := recover(); r != nil{
			n.transaction.Rollback()
		}
	}()
	note := domain.Note{
		UserId: input.UserId,
		Title: input.Title,
		Script: input.Script,
		Table: input.Table,
	}
	if err := note.Validate(); err != nil{
		return nil, err
	}
  
	resNote, err := n.noteRepository.Create(note)
	if err != nil{
    n.transaction.Rollback()
		return nil, err
	}
	// [Notion]
	// At beginning, there is no note id, so memos must be saved after the note is saved.

  memos := make([]domain.Memo, len(input.Memos))
  for i, input := range input.Memos{
    memo := domain.Memo{
      ClientMemoId: input.ClientMemoId,
      UserId: input.UserId,
      NoteId: resNote.NoteId,
      X: input.X,
      Y: input.Y,
      Width: input.Width,
      Height: input.Height,
      Content: input.Content,
    }
		if err := memo.Validate(); err != nil{
			return nil, err
		}
    memos[i] = memo
  }
	resMemos, err := n.memoRepository.CreateBatch(memos)
    if err != nil{
      n.transaction.Rollback()
      return nil, err
    }
  resNote.Memos = resMemos
  n.transaction.Commit()

	return resNote, nil
}


func (n *noteUsecase) UpdateNote(input UpdateNoteInput) (*domain.Note, error) {
	n.transaction.Begin()
	memos := make([]domain.Memo, len(input.Memos))
	for i, input := range input.Memos{
    memo := domain.Memo{
      ClientMemoId: input.ClientMemoId,
      UserId: input.UserId,
      NoteId: input.NoteId,
      X: input.X,
      Y: input.Y,
      Width: input.Width,
      Height: input.Height,
      Content: input.Content,
    }
		if err := memo.Validate(); err != nil{
			return nil, err
		}
    memos[i] = memo
  }

	note := domain.Note{
		UserId: input.UserId,
		Title: input.Title,
		Script: input.Script,
		Table: input.Table,
	}
	if err := note.Validate(); err != nil{
		return nil, err
	}

	resMemos, err := n.memoRepository.UpdateBatch(memos)
	if err != nil{
		n.transaction.Rollback()
		return nil, err
	} 
	resNote, err := n.noteRepository.Update(note)
	if  err != nil{
		n.transaction.Rollback()
		return nil, err
	}
	resNote.Memos = resMemos
	n.transaction.Commit()
	return resNote, nil
}


func (n *noteUsecase) DeleteNote(noteId int) error {
  n.transaction.Begin()
	defer func() {
		if r := recover(); r != nil{
			n.transaction.Rollback()
		}
	}()
	if err := n.noteRepository.DeleteByNoteId(noteId); err != nil{
    n.transaction.Rollback()
		return err
	}
  if err := n.memoRepository.DeleteByNoteId(noteId); err != nil{
    n.transaction.Rollback()
		return err
  }
  n.transaction.Commit()
	return nil	
}