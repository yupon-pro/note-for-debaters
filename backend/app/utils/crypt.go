package utils

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)


func EncryptPwd(password string) (string, error) {
	hashPwd, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashPwd), nil
}

func ComparePwd(hashPwd, reqPwd string) error {
	if err := bcrypt.CompareHashAndPassword([]byte(hashPwd), []byte(reqPwd)); err != nil{
		return fmt.Errorf("the password doesn't match: %w", err)
	}
	return nil
}