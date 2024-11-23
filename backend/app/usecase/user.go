package usecase

import (
	"fmt"
	"reflect"

	"github.com/yupon-pro/note-for-debater/domain"
)

type UserUsecase interface{
	ReadUser(email string) (*domain.User, error)
	CreateUser(input *CreateUserInput) error
	UpdateUser(input *UpdateUserInput) error
	DeleteUser(userId int) error	
}

type CreateUserInput struct{
	Name string `json:"name" form:"name"`
  Email string `json:"email" form:"email"`
  Password string `json:"password" form:"password"`
}

type UpdateUserInput struct{
	UserId int `json:"userId" form:"userId"`
	CreateUserInput
}

type userUsecase struct{
	userRepository domain.UserRepository
}

func NewUserUsecase (userRepository domain.UserRepository) UserUsecase{
	return &userUsecase{ userRepository: userRepository }
}


func (n *userUsecase) ReadUser(email string) (*domain.User, error){
	user, err := n.userRepository.Read(email)
	if err != nil{
		return nil, err
	}
	return user, nil

}

func (n *userUsecase) CreateUser(input *CreateUserInput) error {
	user := &domain.User{
		Name: input.Name,
		Email: input.Email,
		Password: input.Password,
	}
	if err := user.Validate(); err != nil{
		return err
	}
	if err := n.userRepository.Create(user); err != nil{
		return err
	}
	return nil
}

func (n *userUsecase) UpdateUser(input *UpdateUserInput) error {
	user, err := n.userRepository.Read(input.Email)
	if err != nil{
		return err
	}

	if err := updateUserFields(user, input); err != nil{
		return err
	}
	if err := user.Validate(); err != nil{
		return err
	}
	if err := n.userRepository.Update(user); err != nil{
		return err
	}
	return nil
}

func (n *userUsecase) DeleteUser(userId int) error {
	if err := n.userRepository.Delete(userId); err != nil{
		return err
	}
	return nil	
}


func updateUserFields(user *domain.User, input *UpdateUserInput) error {
	// リフレクションを使用
	userValue := reflect.ValueOf(user).Elem()
	inputValue := reflect.ValueOf(input).Elem()
	// Elem returns the value that the interface v contains or that the pointer v points to

	for i := 0; i < inputValue.NumField(); i++ {
		fieldName := inputValue.Type().Field(i).Name
		inputField := inputValue.Field(i)

		if inputField.Kind() == reflect.String && inputField.String() != "" {
			userField := userValue.FieldByName(fieldName)
			if !userField.IsValid() || !userField.CanSet() || userField.Kind() != reflect.String {
				return fmt.Errorf("failed to update value")
			}else{
				userField.SetString(inputField.String())
			}
		}
	}

	return nil
}