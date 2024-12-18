package infrastructure

import (
	"fmt"
	"time"

	"github.com/yupon-pro/note-for-debater/domain"
	"github.com/yupon-pro/note-for-debater/utils"
	"gorm.io/gorm/clause"
)

type TmpUserRepositoryInfrastructure struct {
	db  *MyDB
}

func NewTmpUserRepositoryInfrastructure(db *MyDB) domain.TmpUserRepository {
	return &TmpUserRepositoryInfrastructure{db}
}

func (rep *TmpUserRepositoryInfrastructure) Read(mailCode string) (*domain.UserInfo, error) {
	var tmpUser domain.TmpUser
	if err := rep.db.Client.Where("mail_code = ?", mailCode).First(&tmpUser).Error; err != nil {
		return nil, fmt.Errorf("failed to read user: %w", err)
	}

	duration := -1 * time.Hour
	if utils.IsExpired(tmpUser.UpdatedAt, duration) {
		return nil, fmt.Errorf("the code is expired")
	}

	userInfo := &domain.UserInfo{
		Name: tmpUser.Name,
		Email: tmpUser.Email,
		Password: tmpUser.Password,
	}

	return userInfo, nil
}

func (rep *TmpUserRepositoryInfrastructure) Save(tmpUser domain.TmpUser) (*domain.UserInfo, error) {
	hashPwd, err := utils.EncryptPwd(tmpUser.Password)
	if err != nil{
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}
	tmpUser.Password = hashPwd

	userInfo := &domain.UserInfo{}
	
	err = rep.db.Client.
		Model(&domain.TmpUser{}).
		Clauses(
			clause.OnConflict{
				Columns: []clause.Column{{ Name: "email" }},
				DoUpdates: clause.AssignmentColumns([]string{"mail_code", "name" , "password", "updated_at"}),
			}, 
			clause.Returning{Columns: []clause.Column{
				{Name: "name"},
				{Name: "email"},
				{Name: "password"},
			}},
		).
		Create(&tmpUser).
		Scan(userInfo).
		Error

	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}
	return userInfo, nil
}

// [Notation]
// What is clause.OnConflict? 
// Refer to https://stackoverflow.com/questions/39333102/how-to-create-or-update-a-record-with-gorm

func (rep *TmpUserRepositoryInfrastructure) Delete(mailCode string) error {
	result := rep.db.Client.Where("mail_code = ?", mailCode).Delete(&domain.TmpUser{})
	if result.Error != nil {
		return fmt.Errorf("failed to delete user: %w", result.Error)
	}
	return nil
}