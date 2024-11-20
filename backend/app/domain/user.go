package domain

import "time"

type ClientUser struct{
	UserId int `gorm:"primary_key; AUTO_INCREMENT; column: user_id"`
	Name string `gorm:"not null; column:name"`
	Email string `gorm:"uniqueIndex; not null; column: email"`
	CreatedAt time.Time `gorm:"auto_create_time; column: created_at"`
	UpdatedAt time.Time `gorm:"auto_update_time; column: updated_at"`
}

type User struct{
	ClientUser 
	Password string `gorm:"not null; column:password"`
}

