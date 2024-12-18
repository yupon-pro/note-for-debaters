package domain


import (
	"fmt"
	"time"
)

type UpdateNote struct {
	Title string
  Table string
  Script string
}


type Note struct {
	NoteId    int `gorm:"primary_key; AUTO_INCREMENT; column: note_id"`
	UserId    int `gorm:"column:user_id"`
	User      User `gorm:"foreignKey:UserId"`
	Title     string `gorm:"column:title; not null"`
	Table     string `gorm:"column:table; not null"`
	Script    string `gorm:"column:script"`
	Memos     []Memo `gorm:"foreignKey:NoteId;"`
	CreatedAt time.Time `gorm:"autoCreateTime; column:created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime; column:updated_at"`
}

// [Notation]
// The note has many memos. This type is so called hay many.
// Refer to https://gorm.io/docs/has_many.html

func (n Note) Validate() error {
	if n.Title == "" || n.Table == ""  {
		return fmt.Errorf("please input the necessary values")
	}

	return nil
}

type NoteRepository interface{
	Read(noteId int) (*Note, error)
	ReadAll(userId int) ([]Note, error)
	ReadLatest(userId int) (*Note, error)
	Create(note Note) (*Note, error)
	Update(note Note) (*Note, error)
	DeleteByNoteId(noteId int) error
	DeleteByUserId(UserId int) error
}