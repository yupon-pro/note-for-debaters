package service

import (
	"github.com/yupon-pro/note-for-debater/domain"
)

type CreateUserInput struct{
	Name string
  Email string
  Password string
}

type SaveTmpUserInput struct{
	MailCode string `json:"mail_code" form:"mail_code"`
	Name string `json:"name" form:"name"`
  Email string `json:"email" form:"email"`
  Password string `json:"password" form:"password"`
}

type SignUpUsecase interface{
	ReadTmpUser(mailCode string) (*domain.UserInfo, error)
	SaveTmpUser(input *SaveTmpUserInput) (*domain.UserInfo, error)
	DeleteTmpUser(mailCode string) error	
	CreateUser(input *CreateUserInput) (*domain.APIUser, error)
}

type signUpUsecase struct{
	tmpUserRepository domain.TmpUserRepository
	userRepository domain.UserRepository
}

func NewSignUpUsecase (
	tmpUserRepository domain.TmpUserRepository, 
	userRepository domain.UserRepository,
	) SignUpUsecase{
	return &signUpUsecase{ 
		tmpUserRepository: tmpUserRepository,
		userRepository: userRepository,
	}
}


func (n *signUpUsecase) ReadTmpUser(mailCode string) (*domain.UserInfo, error){
	tmpUser, err := n.tmpUserRepository.Read(mailCode)
	if err != nil{
		return nil, err
	}
	return tmpUser, nil
}

func (n *signUpUsecase) SaveTmpUser(input *SaveTmpUserInput) (*domain.UserInfo, error) {
	tmpUser := &domain.TmpUser{
		MailCode: input.MailCode,
		Name: input.Name,
		Email: input.Email,
		Password: input.Password,
	}
	if err := tmpUser.Validate(); err != nil{
		return nil, err
	}
	apiUser, err := n.tmpUserRepository.Save(tmpUser)
	if err != nil{
		return nil, err
	}
	return apiUser, nil
}


func (n *signUpUsecase) DeleteTmpUser(mailCode string) error {
	if err := n.tmpUserRepository.Delete(mailCode); err != nil{
		return err
	}
	return nil	
}

func (n *signUpUsecase) CreateUser(input *CreateUserInput) (*domain.APIUser, error) {
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