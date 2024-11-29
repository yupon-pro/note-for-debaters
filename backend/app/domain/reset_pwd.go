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

type APIResetPwd struct{
	Token string `gorm:"column:token"`
	Email string `gorm:"column:email"`
	UserId int `gorm:"column:user_id"`
}

func (n ResetPwd) Validate() error {
	if n.Token == "" || n.Email == "" || n.UserId == 0 {
		return fmt.Errorf("you miss the field value")
	}

	return nil
}

type ResetPwdRepository interface{
	Read(token string) (*APIResetPwd, error)
	Save(info *ResetPwd) (*APIResetPwd, error)
	Delete(token string) error
}