package domain

import (
	"time"

)


type Memo struct {
	ClientMemoId string `gorm:"uniqueIndex; not null; column: client_memo_id"`
	ServerMemoId int `gorm:"primary_key; AUTO_INCREMENT; column: server_memo_id"`
	NoteId int `gorm:"column: note_id"`
	UserId int `gorm:"column: user_id"`
	User User `gorm:"foreignKey:user_id"`
	Content string `gorm:"not null"`
	X string `gorm:"not null"`
	Y string `gorm:"not null"`
	Width string `gorm:"not null"`
	Height string `gorm:"not null"`
	CreatedAt time.Time `gorm:"autoCreateTime; column: created_at"`
  UpdatedAt time.Time `gorm:"autoUpdateTime; column: updated_at"`
}


type MemoRepository interface{
	ReadAll(noteId int) ([]Memo, error)
	Create(memo *Memo) (*Memo, error)
	Update(memo *Memo) (*Memo, error)
	Delete(serverMemoId int) error
}