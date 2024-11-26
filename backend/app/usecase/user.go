package usecase

import (
	"github.com/yupon-pro/note-for-debater/domain"
)

type UserUsecase interface{
	ReadAPIUser(email string) (*domain.APIUser, error)
	ReadAuthUser(email string) (*domain.AuthUser, error)
	CreateUser(input *CreateUserInput) (*domain.APIUser, error)
	UpdateUser(input *UpdateUserInput) (*domain.APIUser, error)
	DeleteUser(userId int) error	
}

type CreateUserInput struct{
	Name string `json:"name" form:"name"`
  Email string `json:"email" form:"email"`
  Password string `json:"password" form:"password"`
}

type UpdateUserInput struct{
	UserId int `json:"user_id" form:"user_id"`
	CreateUserInput
}

type userUsecase struct{
	userRepository domain.UserRepository
}

func NewUserUsecase (userRepository domain.UserRepository) UserUsecase{
	return &userUsecase{ userRepository: userRepository }
}


func (n *userUsecase) ReadAPIUser(email string) (*domain.APIUser, error){
	user, err := n.userRepository.Read(email)
	if err != nil{
		return nil, err
	}
	return user, nil
}

func (n *userUsecase) ReadAuthUser(email string) (*domain.AuthUser, error){
	user, err := n.userRepository.ReadAuth(email)
	if err != nil{
		return nil, err
	}
	return user, nil
}

func (n *userUsecase) CreateUser(input *CreateUserInput) (*domain.APIUser, error) {
	user := &domain.User{
		Name: input.Name,
		Email: input.Email,
		Password: input.Password,
	}
	if err := user.Validate(); err != nil{
		return nil, err
	}
	apiUser, err := n.userRepository.Create(user)
	if err != nil{
		return nil, err
	}
	return apiUser, nil
}

func (n *userUsecase) UpdateUser(input *UpdateUserInput) (*domain.APIUser, error) {
	user := &domain.User{
		UserId: input.UserId,
		Name: input.Name,
		Email: input.Email,
		Password: input.Password,
	}
	apiUser, err := n.userRepository.Update(user);
	if  err != nil{
		return nil, err
	}
	return apiUser, nil
}

func (n *userUsecase) DeleteUser(userId int) error {
	if err := n.userRepository.Delete(userId); err != nil{
		return err
	}
	return nil	
}