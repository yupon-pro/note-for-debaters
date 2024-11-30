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

func (rep *MemoRepositoryInfrastructure) ReadAll(noteId int) (memos []domain.Memo, err error) {
	if err = rep.db.Client.Where("note_id = ?", noteId).Preload("Users").Find(&memos).Error; err != nil {
		return nil, fmt.Errorf("failed to read all memos: %w", err)
	}
	return memos, nil
}


func (rep *MemoRepositoryInfrastructure) Create(memo *domain.Memo) (res *domain.Memo, err error) {
	err = rep.db.Client.Model(res).Clauses(clause.Returning{}).Create(memo).Scan(res).Error
	if err != nil {
		return nil, fmt.Errorf("failed to create memo: %w", err)
	}
	return res, nil
}

func (rep *MemoRepositoryInfrastructure) Update(memo *domain.Memo) (res *domain.Memo, err error) {
	err = rep.db.Client.Model(res).Clauses(clause.Returning{}).Where("server_memo_id = ?", memo.ServerMemoId).Updates(memo).Scan(res).Error
	if err != nil {
		return nil, fmt.Errorf("failed to update memo: %w", err)
	}
	return res, nil
}

func (rep *MemoRepositoryInfrastructure) Delete(serverMemoId int) error {
	result := rep.db.Client.Where("server_memo_id = ?", serverMemoId).Delete(&domain.Memo{})
	if result.Error != nil {
		return fmt.Errorf("failed to delete memo: %w", result.Error)
	}
	return nil
}
