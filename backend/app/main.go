package main

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	// "github.com/labstack/echo/v4/middleware"
	echoswagger "github.com/swaggo/echo-swagger"
	"github.com/yupon-pro/note-for-debater/config"
	"github.com/yupon-pro/note-for-debater/domain"
	"github.com/yupon-pro/note-for-debater/infrastructure"
	"github.com/yupon-pro/note-for-debater/interfaces"
	"github.com/yupon-pro/note-for-debater/service"
	"github.com/yupon-pro/note-for-debater/usecase"
)

func main() {
	// ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	// defer cancel()

	mydb := new(infrastructure.MyDB)
	if err := mydb.Connect(); err != nil{
		log.Fatal(err)
	}

	e := echo.New()
	if config.IsDevelopment() {
		e.GET("/swagger/*", echoswagger.WrapHandler)
	}
	// e.Use(middleware.Logger())
	// e.Use(middleware.Recover())

	mydb.Client.AutoMigrate(&domain.User{})
	mydb.Client.AutoMigrate(&domain.Note{})
	mydb.Client.AutoMigrate(&domain.TmpUser{})
	mydb.Client.AutoMigrate(&domain.ResetPwd{})

	tx := infrastructure.NewTransactionManager(mydb.Client)

	noteRepository := infrastructure.NewNoteRepositoryInfrastructure(mydb)
	noteUsecase := usecase.NewNoteUsecase(noteRepository)
	noteController := interfaces.NewNoteController(noteUsecase)

	memoRepository := infrastructure.NewMemoRepositoryInfrastructure(mydb)
	memoUsecase := usecase.NewMemoUsecase(memoRepository)
	memoController := interfaces.NewMemoController(memoUsecase)

	userRepository := infrastructure.NewUserRepositoryInfrastructure(mydb)
	userUsecase := usecase.NewUserUsecase(userRepository)
	userController := interfaces.NewUserController(userUsecase)

	tmpUserRepository := infrastructure.NewTmpUserRepositoryInfrastructure(mydb)
	signUpUsecase := service.NewSignUpUsecase(tmpUserRepository, userRepository, tx)
	signUpController := interfaces.NewSignUpController(signUpUsecase)

	resetPwdRepository := infrastructure.NewResetPwdRepositoryInfrastructure(mydb)
	resetPwdUsecase := usecase.NewResetPwdUsecase(resetPwdRepository)
	resetPwdController := interfaces.NewResetPwdController(resetPwdUsecase)

	controllers := interfaces.NewControllers(
		noteController, 
		memoController,
		userController, 
		signUpController, 
		resetPwdController,
	)
	controllers.Mount(e)

	e.GET("/", func(c echo.Context)error{return c.String(http.StatusOK, "hello")})

	e.Logger.Fatal(e.Start(":8080"))

}