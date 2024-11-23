package infrastructure

import (
	"fmt"

	"github.com/yupon-pro/note-for-debater/domain"
)

type UserRepositoryInfrastructure struct {
	db  *MyDB
}

func NewUserRepositoryInfrastructure(db *MyDB) domain.UserRepository {
	return &UserRepositoryInfrastructure{db}
}

func (rep *UserRepositoryInfrastructure) Read(email string) (*domain.User, error) {
	var user *domain.User
	if err := rep.db.Client.Where("email = ?", email).First(user).Error; err != nil {
		return nil, fmt.Errorf("failed to read user: %w", err)
	}
	return user, nil
}

func (rep *UserRepositoryInfrastructure) Create(user *domain.User) error {
	if err := rep.db.Client.Create(user).Error; err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}
	return nil
}

func (rep *UserRepositoryInfrastructure) Update(user *domain.User) error {
	result := rep.db.Client.Model(&domain.User{}).Where("user_id = ?", user.UserId).Updates(user)
	if result.Error != nil {
		return fmt.Errorf("failed to update user: %w", result.Error)
	}
	return nil
}

func (rep *UserRepositoryInfrastructure) Delete(userId int) error {
	result := rep.db.Client.Where("user_id = ?", userId).Delete(&domain.User{})
	if result.Error != nil {
		return fmt.Errorf("failed to delete user: %w", result.Error)
	}
	return nil
}
