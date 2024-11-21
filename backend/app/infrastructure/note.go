package infrastructure

import (
	"context"
	"fmt"

	"github.com/yupon-pro/note-for-debater/domain"
)

type NoteRepositoryInfrastructure struct {
	db  *MyDB
	ctx context.Context
}

func NewNoteRepositoryInfrastructure(db *MyDB, ctx context.Context) domain.NoteRepository {
	return &NoteRepositoryInfrastructure{db, ctx}
}

func (rep *NoteRepositoryInfrastructure) Read(noteId int) (*domain.Note, error) {
	var note domain.Note
	if err := rep.db.Client.Where("note_id = ?", noteId).Preload("User").First(&note).Error; err != nil {
		return nil, fmt.Errorf("failed to read note: %w", err)
	}
	return &note, nil
}

func (rep *NoteRepositoryInfrastructure) ReadAll(userId int) ([]domain.Note, error) {
	var notes []domain.Note
	if err := rep.db.Client.Where("user_id = ?", userId).Preload("User").Find(&notes).Error; err != nil {
		return nil, fmt.Errorf("failed to read all notes: %w", err)
	}
	return notes, nil
}

func (rep *NoteRepositoryInfrastructure) Create(note *domain.Note) error {
	if err := rep.db.Client.Create(note).Error; err != nil {
		return fmt.Errorf("failed to create note: %w", err)
	}
	return nil
}

func (rep *NoteRepositoryInfrastructure) Update(note *domain.Note) error {
	result := rep.db.Client.Model(&domain.Note{}).Where("note_id = ?", note.NoteId).Updates(note)
	if result.Error != nil {
		return fmt.Errorf("failed to update note: %w", result.Error)
	}
	return nil
}

func (rep *NoteRepositoryInfrastructure) Delete(noteId int) error {
	result := rep.db.Client.Where("note_id = ?", noteId).Delete(&domain.Note{})
	if result.Error != nil {
		return fmt.Errorf("failed to delete note: %w", result.Error)
	}
	return nil
}
