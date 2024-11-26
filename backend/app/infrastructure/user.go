package infrastructure

import (
	"fmt"

	"github.com/yupon-pro/note-for-debater/domain"
	"gorm.io/gorm/clause"
)

type UserRepositoryInfrastructure struct {
	db  *MyDB
}

func NewUserRepositoryInfrastructure(db *MyDB) domain.UserRepository {
	return &UserRepositoryInfrastructure{db}
}

func (rep *UserRepositoryInfrastructure) Read(email string) (*domain.APIUser, error) {
	var apiUser *domain.APIUser
	if err := rep.db.Client.Model(&domain.User{}).Where("email = ?", email).First(apiUser).Error; err != nil {
		return nil, fmt.Errorf("failed to read user: %w", err)
	}
	return apiUser, nil
}

func (rep *UserRepositoryInfrastructure) ReadAuth(email string) (*domain.AuthUser, error) {
	var authUser *domain.AuthUser
	if err := rep.db.Client.Model(&domain.User{}).Where("email = ?", email).First(authUser).Error; err != nil {
		return nil, fmt.Errorf("failed to read user: %w", err)
	}
	return authUser, nil
}

// Why are models passed to model and first different? 
// Refer to https://gorm.io/docs/advanced_query.html#Smart-Select-Fields

func (rep *UserRepositoryInfrastructure) Create(user *domain.User) (*domain.APIUser, error) {
	var apiUser *domain.APIUser
	res := []clause.Column{
		{Name: "userId"},
		{Name: "email"},
		{Name: "name"},
	}
	result := rep.db.Client.Model(&domain.User{}).Clauses(clause.Returning{Columns: res}).Create(user).Scan(apiUser)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to create user: %w", result.Error)
	}
	return apiUser, nil
}

func (rep *UserRepositoryInfrastructure) Update(user *domain.User) (*domain.APIUser, error) {
	var apiUser *domain.APIUser
	res := []clause.Column{
		{Name: "userId"},
		{Name: "email"},
		{Name: "name"},
	}
	result := rep.db.Client.Model(&domain.User{}).Clauses(clause.Returning{Columns: res}).Where("user_id = ?", user.UserId).Updates(user).Scan(apiUser)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to update user: %w", result.Error)
	}
	return apiUser, nil
}

// What is Clauses and columns? Refer to
// https://gorm.io/docs/update.html#Returning-Data-From-Modified-Rows

func (rep *UserRepositoryInfrastructure) Delete(userId int) error {
	result := rep.db.Client.Where("user_id = ?", userId).Delete(&domain.User{})
	if result.Error != nil {
		return fmt.Errorf("failed to delete user: %w", result.Error)
	}
	return nil
}
