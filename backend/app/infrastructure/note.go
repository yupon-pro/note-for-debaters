package infrastructure

import (
	"fmt"

	"github.com/yupon-pro/note-for-debater/domain"
	"gorm.io/gorm/clause"
)

type NoteRepositoryInfrastructure struct {
	db  *MyDB
}

func NewNoteRepositoryInfrastructure(db *MyDB) domain.NoteRepository {
	return &NoteRepositoryInfrastructure{db}
}

func (rep *NoteRepositoryInfrastructure) Read(noteId int) (*domain.Note, error) {
	var note domain.Note
	if err := rep.db.Client.Where("note_id = ?", noteId).Preload("Users").First(&note).Error; err != nil {
		return nil, fmt.Errorf("failed to read note: %w", err)
	}
	return &note, nil
}

func (rep *NoteRepositoryInfrastructure) ReadAll(userId int) ([]domain.Note, error) {
	var notes []domain.Note
	if err := rep.db.Client.Where("user_id = ?", userId).Preload("Users").Find(&notes).Error; err != nil {
		return nil, fmt.Errorf("failed to read all notes: %w", err)
	}
	return notes, nil
}

func (rep *NoteRepositoryInfrastructure) ReadLatest(userId int) (*domain.Note, error) {
	var note *domain.Note
	if err := rep.db.Client.Where("user_id = ?", userId).Preload("Users").Last(&note).Error; err != nil {
		return nil, fmt.Errorf("failed to read all note: %w", err)
	}
	return note, nil
}


func (rep *NoteRepositoryInfrastructure) Create(note *domain.Note) (*domain.Note, error) {
	var resNote *domain.Note

	result := rep.db.Client.Model(resNote).Clauses(clause.Returning{}).Create(note).Scan(resNote)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to create note: %w", result.Error)
	}
	return resNote, nil
}

func (rep *NoteRepositoryInfrastructure) Update(note *domain.Note) (*domain.Note, error) {
	var resNote *domain.Note

	result := rep.db.Client.Model(resNote).Clauses(clause.Returning{}).Where("note_id = ?", note.NoteId).Updates(note).Scan(resNote)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to update note: %w", result.Error)
	}
	return resNote, nil
}

func (rep *NoteRepositoryInfrastructure) Delete(noteId int) error {
	result := rep.db.Client.Where("note_id = ?", noteId).Delete(&domain.Note{})
	if result.Error != nil {
		return fmt.Errorf("failed to delete note: %w", result.Error)
	}
	return nil
}
