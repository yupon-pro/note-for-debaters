package infrastructure

import (
	"fmt"
	"time"

	"github.com/yupon-pro/note-for-debater/domain"
	"github.com/yupon-pro/note-for-debater/utils"
	"gorm.io/gorm/clause"
)

type ResetPwdRepositoryInfrastructure struct {
	db  *MyDB
}

func NewResetPwdRepositoryInfrastructure(db *MyDB) domain.ResetPwdRepository {
	return &ResetPwdRepositoryInfrastructure{db}
}

func (rep *ResetPwdRepositoryInfrastructure) Read(token string) (*domain.ResetPwd, error) {
	resetPwd := &domain.ResetPwd{}
	if err := rep.db.Client.Where("token = ?", token).First(resetPwd).Error; err != nil {
		return nil, fmt.Errorf("failed to read user: %w", err)
	}
	
	duration := -1 * time.Hour
	if utils.IsExpired(resetPwd.UpdatedAt, duration) {
		return nil, fmt.Errorf("the code is expired")
	}

	return resetPwd, nil
}

func (rep *ResetPwdRepositoryInfrastructure) Save(info domain.ResetPwd) (*domain.ResetPwd, error) {
	resetPwd := &domain.ResetPwd{}

	result := rep.db.Client.
		Model(resetPwd).
		Clauses(
			clause.OnConflict{
				Columns: []clause.Column{{ Name: "email" }},
				DoUpdates: clause.AssignmentColumns([]string{"token", "updated_at"}),
			},
			clause.Returning{},
		).
		Create(&info).
		Scan(resetPwd)

	if result.Error != nil {
		return nil, fmt.Errorf("failed to create user: %w", result.Error)
	}
	return resetPwd, nil
}

func (rep *ResetPwdRepositoryInfrastructure) Delete(token string) error {
	if err := rep.db.Client.Where("token = ?", token).Delete(&domain.ResetPwd{}).Error; err != nil {
		return fmt.Errorf("failed to delete reset password table info: %w", err)
	}
	return nil
}
