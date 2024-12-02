package usecase

import (
	"strconv"

	"github.com/yupon-pro/note-for-debater/domain"
)

type ResetPwdUsecase interface{
	ReadResetPwd(token string) (*domain.ResetPwd, error)
	SaveResetPwd(input SaveResetPwdInput) (*domain.ResetPwd, error)
	DeleteResetPwd(token string) error
}

type SaveResetPwdInput struct{
	Token string `json:"token" form:"token"`
	UserId string `json:"id" form:"id"`
  Email string `json:"email" form:"email"`
}

type resetPwdUsecase struct{
	resetPwdRepository domain.ResetPwdRepository
}

func NewResetPwdUsecase (resetPwdRepository domain.ResetPwdRepository) ResetPwdUsecase{
	return &resetPwdUsecase{ resetPwdRepository: resetPwdRepository }
}


func (r *resetPwdUsecase) ReadResetPwd(token string) (*domain.ResetPwd, error){
	resetPwd, err := r.resetPwdRepository.Read(token)
	if err != nil{
		return nil, err
	}
	return resetPwd, nil
}

func (r *resetPwdUsecase) SaveResetPwd(input SaveResetPwdInput) (*domain.ResetPwd, error) {
	id, err := strconv.Atoi(input.UserId)
	if err != nil{
		return nil, err
	}
	resetPwd := domain.ResetPwd{
		Token: input.Token,
		UserId: id,
		Email: input.Email,	
	}
	if err := resetPwd.Validate(); err != nil{
		return nil, err
	}
	res, err := r.resetPwdRepository.Save(resetPwd)
	if err != nil{
		return nil, err
	}
	return res, nil
}

func (r *resetPwdUsecase) DeleteResetPwd(token string) error {
	if err := r.resetPwdRepository.Delete(token); err != nil {
		return err
	}
	return nil
}