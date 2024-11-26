package usecase

import (
	"strconv"

	"github.com/yupon-pro/note-for-debater/domain"
)

type ResetPwdUsecase interface{
	ReadResetPwd(mailCode string) (*domain.APIResetPwd, error)
	SaveResetPwd(input *SaveResetPwdInput) (*domain.APIResetPwd, error)
}

type SaveResetPwdInput struct{
	Token string `json:"token" form:"token"`
	UserId string `json:"user_id" form:"user_id"`
  Email string `json:"email" form:"email"`
}

type resetPwdUsecase struct{
	resetPwdRepository domain.ResetPwdRepository
}

func NewResetPwdUsecase (resetPwdRepository domain.ResetPwdRepository) ResetPwdUsecase{
	return &resetPwdUsecase{ resetPwdRepository: resetPwdRepository }
}


func (n *resetPwdUsecase) ReadResetPwd(token string) (*domain.APIResetPwd, error){
	tmpUser, err := n.resetPwdRepository.Read(token)
	if err != nil{
		return nil, err
	}
	return tmpUser, nil
}

func (n *resetPwdUsecase) SaveResetPwd(input *SaveResetPwdInput) (*domain.APIResetPwd, error) {
	id, err := strconv.Atoi(input.UserId)
	if err != nil{
		return nil, err
	}
	resetPwd := &domain.ResetPwd{
		Token: input.Token,
		UserId: id,
		Email: input.Email,	
	}
	if err := resetPwd.Validate(); err != nil{
		return nil, err
	}
	apiUser, err := n.resetPwdRepository.Save(resetPwd)
	if err != nil{
		return nil, err
	}
	return apiUser, nil
}