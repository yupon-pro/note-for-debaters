package domain

import (
	"fmt"
	"time"
)

type ResetPwd struct{
	Token string `gorm:"primary_key; column:token"`
	Email string `gorm:"uniqueIndex; not null; column:email"`
	UserId int `gorm:"uniqueIndex; not null; column:user_id"`
	CreatedAt time.Time `gorm:"auto_create_time; column:created_at"`
	UpdatedAt time.Time `gorm:"auto_update_time; column:updated_at"`
}

func (n ResetPwd) Validate() error {
	if n.Token == "" || n.Email == "" || n.UserId == 0 {
		return fmt.Errorf("please input the necessary values")
	}

	return nil
}

type ResetPwdRepository interface{
	Read(token string) (*ResetPwd, error)
	Save(info ResetPwd) (*ResetPwd, error)
	Delete(token string) error
}