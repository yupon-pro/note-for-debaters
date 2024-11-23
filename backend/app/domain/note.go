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
	NoteId int `gorm:"primary_key; AUTO_INCREMENT; column: note_id"`
  UserId int	`gorm:"column: user_id"`
	User User `gorm:"foreignKey:UserId"`
	Title string `gorm:"column: title; not null"`
  Table string `gorm:"column: table; not null"`
  Script string `gorm:"column: script"`
	CreatedAt time.Time `gorm:"autoCreateTime; column: created_at"`
  UpdatedAt time.Time `gorm:"autoUpdateTime; column: updated_at"`
}

func (n Note) Validate() error {
	if n.Title == "" || n.Table == ""  {
		return fmt.Errorf("必要なデータを入力してください")
	}

	return nil
}

type NoteRepository interface{
	Read(noteId int) (*Note, error)
	ReadAll(userId int) ([]Note, error)
	ReadLatest(userId int)(*Note, error)
	Create(note *Note) error
	Update(note *Note) error
	Delete(noteId int) error
}