package domain

import (
	"fmt"
	"time"
)

type TmpUser struct{
	MailCode string `gorm:"primary_key; column:mail_code"`
	Name string `gorm:"not null; column:name"`
	Email string `gorm:"uniqueIndex; not null; column:email"`
	Password string `gorm:"not null; column:password"`
	CreatedAt time.Time `gorm:"auto_create_time; column:created_at"`
	UpdatedAt time.Time `gorm:"auto_update_time; column:updated_at"`
}

type UserInfo struct{
	Name string `gorm:"column:name"`
	Email string `gorm:"column:email"`
	Password string `gorm:"column:password"`
}

func (n TmpUser) Validate() error {
	if n.MailCode == "" || n.Name == "" || n.Email == "" || n.Password == "" {
		return fmt.Errorf("please input the necessary values")
	}

	return nil
}

type TmpUserRepository interface{
	Read(mailCode string) (*UserInfo, error)
	Save(tmpUser TmpUser) (*UserInfo, error)
	Delete(mailCode string) error
}