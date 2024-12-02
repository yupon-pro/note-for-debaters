package usecase

import (
	// "fmt"

	"github.com/yupon-pro/note-for-debater/domain"
	"github.com/yupon-pro/note-for-debater/infrastructure"
)

type SaveTmpUserInput struct{
	MailCode string `json:"mailCode" form:"mailCode"`
	Name string `json:"name" form:"name"`
  Email string `json:"email" form:"email"`
  Password string `json:"password" form:"password"`
}

type SignUpUsecase interface{
	SaveTmpUser(input SaveTmpUserInput) (*domain.UserInfo, error)
	SignUp(mailCode string) (*domain.APIUser, error)
}

type signUpUsecase struct{
	tmpUserRepository domain.TmpUserRepository
	userRepository domain.UserRepository
	transaction infrastructure.Transaction
}

func NewSignUpUsecase (
	tmpUserRepository domain.TmpUserRepository, 
	userRepository domain.UserRepository,
	transaction infrastructure.Transaction,
	) SignUpUsecase{
	return &signUpUsecase{ 
		tmpUserRepository: tmpUserRepository,
		userRepository: userRepository,
		transaction: transaction,
	}
}

func (s *signUpUsecase) SaveTmpUser(input SaveTmpUserInput) (*domain.UserInfo, error) {
	tmpUser := domain.TmpUser{
		MailCode: input.MailCode,
		Name: input.Name,
		Email: input.Email,
		Password: input.Password,
	}
	if err := tmpUser.Validate(); err != nil{
		return nil, err
	}
	userInfo, err := s.tmpUserRepository.Save(tmpUser)

	if err != nil{
		return nil, err
	}
	return userInfo, nil
}

func (s *signUpUsecase) SignUp(mailCode string) (*domain.APIUser, error) {
	s.transaction.Begin()
	defer func() {
		if r := recover(); r != nil{
			s.transaction.Rollback()
		}
	}()

	userInfo, err := s.tmpUserRepository.Read(mailCode)
	if err != nil{
		s.transaction.Rollback()
		return nil, err
	}

	user := domain.User{
		Name: userInfo.Name,
		Email: userInfo.Email,
		Password: userInfo.Password,
	}
	if err := user.Validate(); err != nil{
		s.transaction.Rollback()
		return nil, err
	}

	apiUser, err := s.userRepository.Create(user)
	if err != nil{
		s.transaction.Rollback()
		return nil, err
	}

	if err := s.tmpUserRepository.Delete(mailCode); err != nil{
		s.transaction.Rollback()
		return nil, err
	}

	s.transaction.Commit()
	return apiUser, nil
}

// [Notion]
// Why should I create service layer? What is service layer?
// To prevent programer from mixing use case or calling other use case inside user case layer,
// the service layer gets independent.
// Refer to https://qiita.com/shunjikonishi/items/9cbf67314000cc42fbcc#service