package infrastructure

import (
	"fmt"

	"github.com/yupon-pro/note-for-debater/domain"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type NoteRepositoryInfrastructure struct {
	db  *MyDB
}

func NewNoteRepositoryInfrastructure(db *MyDB) domain.NoteRepository {
	return &NoteRepositoryInfrastructure{db}
}

func (rep *NoteRepositoryInfrastructure) Read(noteId int) (*domain.Note, error) {
	note := &domain.Note{}
	if err := rep.db.Client.Where("note_id = ?", noteId).Preload("Users").Preload("Memos").First(note).Error; err != nil {
		return nil, fmt.Errorf("failed to read note: %w", err)
	}
	return note, nil
}

func (rep *NoteRepositoryInfrastructure) ReadAll(userId int) ([]domain.Note, error) {
	notes := []domain.Note{}
	if err := rep.db.Client.Where("user_id = ?", userId).Preload("Users").Preload("Memos").Find(&notes).Error; err != nil {
		return nil, fmt.Errorf("failed to read all notes: %w", err)
	}
	return notes, nil
}

func (rep *NoteRepositoryInfrastructure) ReadLatest(userId int) (*domain.Note, error) {
	note := &domain.Note{}
	if err := rep.db.Client.Where("user_id = ?", userId).Preload("Users").Preload("Memos").Last(&note).Error; err != nil {
		return nil, fmt.Errorf("failed to read all note: %w", err)
	}
	return note, nil
}


func (rep *NoteRepositoryInfrastructure) Create(note domain.Note) (*domain.Note, error) {
	// [Notation]
	// Once a note is created, the memo gets related to the note.
	// So, there is no need to return full note that contains memo lists.
	// Instead, the caller must map note with memos based on note id.
	resNote := &domain.Note{}
	err := rep.db.Client.Transaction(func(tx *gorm.DB) error {
		result := tx.Model(resNote).Clauses(clause.Returning{}).Create(note).Scan(resNote)
		if result.Error != nil {
			return fmt.Errorf("failed to create note: %w", result.Error)
		}

		if err := tx.Where("note_id = ?", resNote.NoteId).Preload("Users").First(resNote).Error; err != nil {
			return fmt.Errorf("failed to preload related data: %w", err)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return resNote, nil
}


func (rep *NoteRepositoryInfrastructure) Update(note domain.Note) (*domain.Note, error) {
	// [Notation]
	// Even though the note has relevant memos in their entity,
	// those memos may not be updated ones.
	// If the note contains full information, the caller must care about the order of calling update methods between note and memos.
	// For caller to expect post and update methods to perform similarly, this method doesn't contains memos.
	
	resNote := &domain.Note{}

	err := rep.db.Client.Transaction(func(tx *gorm.DB) error {
		result := tx.Where("note_id = ?", note.NoteId).Updates(note)
		if result.Error != nil {
			return fmt.Errorf("failed to update note: %w", result.Error)
		}

		if result.RowsAffected == 0{
			return fmt.Errorf("no record found with note_id = %d", note.NoteId)
		}

		if err := tx.Where("note_id = ?", note.NoteId).Preload("Users").First(resNote).Error; err != nil {
			return fmt.Errorf("failed to preload related data: %w", err)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return resNote, nil
}

func (rep *NoteRepositoryInfrastructure) DeleteByNoteId(noteId int) error {
	result := rep.db.Client.Where("note_id = ?", noteId).Delete(&domain.Note{})
	if result.Error != nil {
		return fmt.Errorf("failed to delete note: %w", result.Error)
	}
	return nil
}

func (rep *NoteRepositoryInfrastructure) DeleteByUserId(userId int) error {
	result := rep.db.Client.Where("user_id = ?", userId).Delete(&domain.Note{})
	if result.Error != nil {
		return fmt.Errorf("failed to delete note: %w", result.Error)
	}
	return nil
}
