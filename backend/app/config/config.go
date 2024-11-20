package config

import "os"

func IsDevelopment() bool {
	env := os.Getenv("ENV")
	return env == "DEVELOPMENT"
}