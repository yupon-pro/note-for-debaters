package usecase

import (
	"github.com/yupon-pro/note-for-debater/domain"
	"github.com/yupon-pro/note-for-debater/infrastructure"
)

type UserUsecase interface{
	ReadAPIUser(email string) (*domain.APIUser, error)
	ReadAuthUser(email string) (*domain.User, error)
	UpdateUser(input UpdateUserInput) (*domain.APIUser, error)
	DeleteUser(userId int) error	
}

type CreateUserInput struct{
	Name string `json:"name" form:"name"`
  Email string `json:"email" form:"email"`
  Password string `json:"password" form:"password"`
}

type UpdateUserInput struct{
	UserId int `json:"id" form:"id"`
	CreateUserInput
}

type userUsecase struct{
	userRepository domain.UserRepository
	noteRepository domain.NoteRepository
	memoRepository domain.MemoRepository
	transaction infrastructure.Transaction
}

func NewUserUsecase (
	userRepository domain.UserRepository,
	noteRepository domain.NoteRepository,
	memoRepository domain.MemoRepository,
	transaction infrastructure.Transaction,
	) UserUsecase{
	return &userUsecase{ 
		userRepository: userRepository,
		noteRepository: noteRepository,
		memoRepository: memoRepository , 
		transaction: transaction ,
	}
}


func (u *userUsecase) ReadAPIUser(email string) (*domain.APIUser, error){
	user, err := u.userRepository.Read(email)
	if err != nil{
		return nil, err
	}
	return user, nil
}

func (u *userUsecase) ReadAuthUser(email string) (*domain.User, error){
	user, err := u.userRepository.ReadAuth(email)
	if err != nil{
		return nil, err
	}
	return user, nil
}

func (u *userUsecase) UpdateUser(input UpdateUserInput) (*domain.APIUser, error) {
	apiUser, err := u.userRepository.Update(
		domain.User{
			UserId: input.UserId,
			Name: input.Name,
			Email: input.Email,
			Password: input.Password,
		},
	);
	if  err != nil{
		return nil, err
	}
	return apiUser, nil
}

func (u *userUsecase) DeleteUser(userId int) error {
	u.transaction.Begin()
	defer func() {
		if r := recover(); r != nil{
			u.transaction.Rollback()
		}
	}()

	if err := u.userRepository.Delete(userId); err != nil{
		u.transaction.Rollback()
		return err
	}
	if err := u.noteRepository.DeleteByUserId(userId); err != nil{
		u.transaction.Rollback()
		return err
	}
	if err := u.memoRepository.DeleteByUserId(userId); err != nil{
		u.transaction.Rollback()
		return err
	}
	
	u.transaction.Commit()
	return nil	
}