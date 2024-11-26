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

type APITmpUser struct{
	MailCode string `gorm:"column:mail_code"`
	Name string `gorm:"column:name"`
	Email string `gorm:"column:email"`
	Password string `gorm:"column:password"`
}

func (n TmpUser) Validate() error {
	if n.Name == "" || n.Email == "" || n.Password == "" {
		return fmt.Errorf("必要なデータを入力してください")
	}

	return nil
}

type TmpUserRepository interface{
	Read(mailCode string) (*APITmpUser, error)
	Save(tmpUser *TmpUser) (*APITmpUser, error)
	Delete(mailCode string) error
}