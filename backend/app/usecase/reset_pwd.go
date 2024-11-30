package usecase

import (
	"strconv"

	"github.com/yupon-pro/note-for-debater/domain"
)

type ResetPwdUsecase interface{
	ReadResetPwd(token string) (*domain.APIResetPwd, error)
	SaveResetPwd(input *SaveResetPwdInput) (*domain.APIResetPwd, error)
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


func (r *resetPwdUsecase) ReadResetPwd(token string) (*domain.APIResetPwd, error){
	tmpUser, err := r.resetPwdRepository.Read(token)
	if err != nil{
		return nil, err
	}
	return tmpUser, nil
}

func (r *resetPwdUsecase) SaveResetPwd(input *SaveResetPwdInput) (*domain.APIResetPwd, error) {
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
	apiUser, err := r.resetPwdRepository.Save(resetPwd)
	if err != nil{
		return nil, err
	}
	return apiUser, nil
}

func (r *resetPwdUsecase) DeleteResetPwd(token string) error {
	if err := r.resetPwdRepository.Delete(token); err != nil {
		return err
	}
	return nil
}