package usecase

import (
	"fmt"
	"reflect"

	"github.com/yupon-pro/note-for-debater/domain"
)

type NoteUsecase interface{
	ReadNote(noteId int) (*domain.Note, error)
	ReadAllNotes(userId int) ([]domain.Note, error)
	ReadLatestNote(userId int) (*domain.Note, error)
	CreateNote(input *CreateNoteInput) error
	UpdateNote(input *UpdateNoteInput) error
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

func (n *noteUsecase) CreateNote(input *CreateNoteInput) error {
	note := &domain.Note{
		UserId: input.UserId,
		Title: input.Title,
		Script: input.Script,
		Table: input.Table,
	}
	if err := note.Validate(); err != nil{
		return err
	}
	if err := n.noteRepository.Create(note); err != nil{
		return err
	}
	return nil
}

func (n *noteUsecase) UpdateNote(input *UpdateNoteInput) error {
	note, err := n.noteRepository.Read(input.NoteId)
	if err != nil{
		return err
	}

	if err := updateNoteFields(note, input); err != nil{
		return err
	}
	if err := note.Validate(); err != nil{
		return err
	}
	if err := n.noteRepository.Update(note); err != nil{
		return err
	}
	return nil
}

func (n *noteUsecase) DeleteNote(noteId int) error {
	if err := n.noteRepository.Delete(noteId); err != nil{
		return err
	}
	return nil	
}


func updateNoteFields(note *domain.Note, input *UpdateNoteInput) error {
	// リフレクションを使用
	noteValue := reflect.ValueOf(note).Elem()
	inputValue := reflect.ValueOf(input).Elem()
	// Elem returns the value that the interface v contains or that the pointer v points to

	for i := 0; i < inputValue.NumField(); i++ {
		fieldName := inputValue.Type().Field(i).Name
		inputField := inputValue.Field(i)

		if inputField.Kind() == reflect.String && inputField.String() != "" {
			noteField := noteValue.FieldByName(fieldName)
			if !noteField.IsValid() || !noteField.CanSet() || noteField.Kind() != reflect.String {
				return fmt.Errorf("failed to update value")
			}else{
				noteField.SetString(inputField.String())
			}
		}
	}

	return nil
}