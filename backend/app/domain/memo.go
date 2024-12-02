package domain

import (
	"fmt"
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

func (m *Memo) Validate() error{
	if m.X == "" || m.Y == "" || m.Width == "" || m.Height == "" || m.ClientMemoId == "" {
		return fmt.Errorf("please input the necessary values")
	}
	return nil
}


type MemoRepository interface{
	// ReadAll(noteId int) ([]Memo, error)
	// [Notion]
	// There is no need to implement read method 
	// because the memos are always included by a note.
	// So far, there has been no necessity to call memos without note info.
	CreateBatch(memos []Memo) ([]Memo, error)
	UpdateBatch(memos []Memo) ([]Memo, error)
	DeleteByMemoId(serverMemoId int) error
	DeleteByNoteId(memoId int) error
	DeleteByUserId(userId int) error
}