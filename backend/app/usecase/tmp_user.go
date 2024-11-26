package usecase

import (
	"github.com/yupon-pro/note-for-debater/domain"
)

type TmpUserUsecase interface{
	ReadTmpUser(mailCode string) (*domain.APITmpUser, error)
	SaveTmpUser(input *SaveTmpUserInput) (*domain.APITmpUser, error)
	DeleteTmpUser(mailCode string) error	
}

type SaveTmpUserInput struct{
	MailCode string `json:"mail_code" form:"mail_code"`
	Name string `json:"name" form:"name"`
  Email string `json:"email" form:"email"`
  Password string `json:"password" form:"password"`
}

type tmpUserUsecase struct{
	tmpUserRepository domain.TmpUserRepository
}

func NewTmpUserUsecase (tmpUserRepository domain.TmpUserRepository) TmpUserUsecase{
	return &tmpUserUsecase{ tmpUserRepository: tmpUserRepository }
}


func (n *tmpUserUsecase) ReadTmpUser(mailCode string) (*domain.APITmpUser, error){
	tmpUser, err := n.tmpUserRepository.Read(mailCode)
	if err != nil{
		return nil, err
	}
	return tmpUser, nil
}

func (n *tmpUserUsecase) SaveTmpUser(input *SaveTmpUserInput) (*domain.APITmpUser, error) {
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


func (n *tmpUserUsecase) DeleteTmpUser(mailCode string) error {
	if err := n.tmpUserRepository.Delete(mailCode); err != nil{
		return err
	}
	return nil	
}