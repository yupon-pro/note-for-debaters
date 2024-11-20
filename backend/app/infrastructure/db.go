package infrastructure

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq"
)

type MyDB struct{
	Client *sql.DB
}


func (db *MyDB) getDBInfo() (info string) {
	username := os.Getenv("POSTGRES_USER")
	password := os.Getenv("POSTGRES_PASSWORD")
	dbName := os.Getenv("POSTGRES_DB")
	info = fmt.Sprintf("host=db port=5432 user=%s password=%s dbname=%s sslmode=disable", username, password, dbName)
	return info
}

func (db *MyDB) Connect() (err error) {
	info := db.getDBInfo()
	db.Client, err = sql.Open("postgres", info)
	
	if err != nil {
		return fmt.Errorf("failed to connect to the database: %w", err)
	}

	return  nil
}

func (db *MyDB) Disconnect() error {
	if db.Client == nil {
		return nil
	}
	
	if err := db.Client.Close(); err != nil{
		return fmt.Errorf("failed to close the database connection: %w", err)
	}
	fmt.Println("Successfully close the database connection")
	db.Client = nil
	return nil
}

func (db *MyDB) Ping() error{
	if 	err := db.Client.Ping();	err != nil {
		return fmt.Errorf("failed to verify the database connection %w", err)
	}
	fmt.Println("Successfully connected!")
	return nil
}
