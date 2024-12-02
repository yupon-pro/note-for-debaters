package infrastructure

import (
	"fmt"

	"github.com/yupon-pro/note-for-debater/domain"
	"gorm.io/gorm/clause"
)

type MemoRepositoryInfrastructure struct {
	db  *MyDB
}

func NewMemoRepositoryInfrastructure(db *MyDB) domain.MemoRepository {
	return &MemoRepositoryInfrastructure{db}
}


func (rep *MemoRepositoryInfrastructure) CreateBatch(memos []domain.Memo) ([]domain.Memo, error) {
	resMemos := []domain.Memo{}
	err := rep.db.Client.Model(&domain.Memo{}).Clauses(clause.Returning{}).Create(memos).Scan(resMemos).Error
	if err != nil {
		return nil, fmt.Errorf("failed to create memo: %w", err)
	}
	return resMemos, nil
}

func (rep *MemoRepositoryInfrastructure) UpdateBatch(memos []domain.Memo) ([]domain.Memo, error) {
	resMemos := []domain.Memo{}
	err := rep.db.Client.
		Model(&domain.Memo{}).
		Clauses(
			clause.OnConflict{
				Columns: []clause.Column{{ Name: "server_memo_id" }},
				DoUpdates: clause.AssignmentColumns([]string{"content", "x", "y", "width", "height", "updated_at"}),
			},
			clause.Returning{},
		).
		Create(memos).
		Scan(resMemos).
		Error
	// [Notation]
	// Although clause onConflict can accept new data and insert it into table, 
	// this method doesn't assume to accept new data that don't have server memo id.
	// This method aims to implement bulk update, meaning updating multiple columns of each row to new data.

	if err != nil {
		return nil, fmt.Errorf("failed to update memo: %w", err)
	}
	return resMemos, nil
}

func (rep *MemoRepositoryInfrastructure) DeleteByMemoId(serverMemoId int) error {
	result := rep.db.Client.Where("server_memo_id = ?", serverMemoId).Delete(&domain.Memo{})
	if result.Error != nil {
		return fmt.Errorf("failed to delete memo: %w", result.Error)
	}
	return nil
}

func (rep *MemoRepositoryInfrastructure) DeleteByNoteId(noteId int) error {
	result := rep.db.Client.Where("note_id = ?", noteId).Delete(&domain.Memo{})
	if result.Error != nil {
		return fmt.Errorf("failed to delete memo: %w", result.Error)
	}
	return nil
}

func (rep *MemoRepositoryInfrastructure) DeleteByUserId(userId int) error {
	result := rep.db.Client.Where("user_id = ?", userId).Delete(&domain.Memo{})
	if result.Error != nil {
		return fmt.Errorf("failed to delete memo: %w", result.Error)
	}
	return nil
}

