package utils

import (
	"fmt"
	"os"
)

func GetJWTSecret() (string, error){
	JWTSecret := os.Getenv("JWT_SECRET")
	if JWTSecret == ""{
		return "", fmt.Errorf("no secret value is set")
	}
	return JWTSecret, nil
}