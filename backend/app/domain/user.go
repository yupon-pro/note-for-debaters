package domain

import (
	"fmt"
	"time"
)

type User struct{
	UserId int `gorm:"primary_key; AUTO_INCREMENT; column:user_id"`
	Name string `gorm:"not null; column:name"`
	Email string `gorm:"uniqueIndex; not null; column:email"`
	Password string `gorm:"not null; column:password"`
	CreatedAt time.Time `gorm:"auto_create_time; column:created_at"`
	UpdatedAt time.Time `gorm:"auto_update_time; column:updated_at"`
}

type APIUser struct{
	UserId int 
	Name string
	Email string
}

type AuthUser struct{
	APIUser
	Password string
}

func (n User) Validate() error {
	if n.Name == "" || n.Email == "" || n.Password == "" {
		return fmt.Errorf("必要なデータを入力してください")
	}

	return nil
}

type UserRepository interface{
	Read(email string) (*APIUser, error)
	ReadAuth(email string) (*AuthUser, error)
	Create(note *User) (*APIUser, error)
	Update(note *User) (*APIUser, error)
	Delete(userId int) error
}