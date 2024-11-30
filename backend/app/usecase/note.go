package usecase

import (
	"github.com/yupon-pro/note-for-debater/domain"
)

type NoteUsecase interface{
	ReadNote(noteId int) (*domain.Note, error)
	ReadAllNotes(userId int) ([]domain.Note, error)
	ReadLatestNote(userId int) (*domain.Note, error)
	CreateNote(input *CreateNoteInput) (*domain.Note, error)
	UpdateNote(input *UpdateNoteInput) (*domain.Note, error)
	DeleteNote(noteId int) error	
}

type CreateNoteInput struct{
  UserId int	`json:"userId" form:"userId"`
	Title string `json:"title" form:"title"`
  Table string `json:"table" form:"table"`
  Script string `json:"script" form:"script"`
}

type UpdateNoteInput struct{
	NoteId int `json:"noteId" form:"noteId"`
	CreateNoteInput
}

type noteUsecase struct{
	noteRepository domain.NoteRepository
}

func NewNoteUsecase (noteRepository domain.NoteRepository) NoteUsecase{
	return &noteUsecase{ noteRepository: noteRepository }
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

func (n *noteUsecase) CreateNote(input *CreateNoteInput) (*domain.Note, error) {
	note := &domain.Note{
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
		return nil, err
	}
	return resNote, nil
}

func (n *noteUsecase) UpdateNote(input *UpdateNoteInput) (*domain.Note, error) {
	note := &domain.Note{
		UserId: input.UserId,
		Title: input.Title,
		Script: input.Script,
		Table: input.Table,
	}
	resNote, err := n.noteRepository.Update(note)
	if  err != nil{
		return nil, err
	}
	return resNote, nil
}

func (n *noteUsecase) DeleteNote(noteId int) error {
	if err := n.noteRepository.Delete(noteId); err != nil{
		return err
	}
	return nil	
}