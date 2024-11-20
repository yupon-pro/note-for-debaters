package infrastructure

import (
	"fmt"
	"os"
	"gorm.io/gorm"
	"gorm.io/driver/postgres"
	_ "github.com/lib/pq"
)

type MyDB struct{
	Client *gorm.DB
}

func (db *MyDB) getDBInfo() (info string) {
	username := os.Getenv("POSTGRES_USER")
	password := os.Getenv("POSTGRES_PASSWORD")
	dbName := os.Getenv("POSTGRES_DB")
	info = fmt.Sprintf("host=db user=%s password=%s dbname=%s port=5432 sslmode=disable", username, password, dbName)
	return info
}

func (db *MyDB) Connect() (err error) {
	info := db.getDBInfo()

	db.Client, err = gorm.Open(postgres.Open(info))
	// gorm close the instance automatically
	// gorm check the connection automatically when it is initialized.
	
	if err != nil {
		return fmt.Errorf("failed to connect to the database: %w", err)
	}

	return  nil
}
