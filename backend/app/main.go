package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	// "github.com/labstack/echo/v4/middleware"
	_ "github.com/yupon-pro/note-for-debater/docs"
	echoswagger "github.com/swaggo/echo-swagger"
	"github.com/yupon-pro/note-for-debater/config"
	"github.com/yupon-pro/note-for-debater/domain"
	"github.com/yupon-pro/note-for-debater/infrastructure"
	"github.com/yupon-pro/note-for-debater/interfaces"
	"github.com/yupon-pro/note-for-debater/usecase"
)

// [Notation]
// How to add jwt authentication to swagger-go?
// Refer to https://stackoverflow.com/questions/56176814/how-to-add-jwt-auth-to-swagger-go-echo-swaggo-swag

// @title Note for debater
// @version 1.0
// @description This is backend api for the project.
// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization
// @host localhost:8080
// @BasePath /
// @schemes http
func main() {
	// ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	// defer cancel()

	mydb := new(infrastructure.MyDB)
	if err := mydb.Connect(); err != nil{
		log.Fatal(err)
	}

	e := echo.New()
	if config.IsDevelopment() {
		fmt.Println("In Development.")
		e.GET("/swagger/*", echoswagger.WrapHandler)
	}
	// e.Use(middleware.Logger())
	// e.Use(middleware.Recover())

	mydb.Client.AutoMigrate(&domain.User{})
	mydb.Client.AutoMigrate(&domain.TmpUser{})
	mydb.Client.AutoMigrate(&domain.ResetPwd{})
	mydb.Client.AutoMigrate(&domain.Note{})
	mydb.Client.AutoMigrate(&domain.Memo{})

	tx := infrastructure.NewTransactionManager(mydb.Client)

	memoRepository := infrastructure.NewMemoRepositoryInfrastructure(mydb)
	memoUsecase := usecase.NewMemoUsecase(memoRepository)
	memoController := interfaces.NewMemoController(memoUsecase)

	noteRepository := infrastructure.NewNoteRepositoryInfrastructure(mydb)
	noteUsecase := usecase.NewNoteUsecase(noteRepository, memoRepository, tx)
	noteController := interfaces.NewNoteController(noteUsecase)

	userRepository := infrastructure.NewUserRepositoryInfrastructure(mydb)
	userUsecase := usecase.NewUserUsecase(userRepository, noteRepository, memoRepository, tx)
	userController := interfaces.NewUserController(userUsecase)

	tmpUserRepository := infrastructure.NewTmpUserRepositoryInfrastructure(mydb)
	signUpUsecase := usecase.NewSignUpUsecase(tmpUserRepository, userRepository, tx)
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

	e.GET("/", HealthCheck)

	e.Logger.Fatal(e.Start(":8080"))

}

// HealthCheck godoc
// @Summary Show the status of server.
// @Description get the status of server.
// @Tags root
// @Accept */*
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router / [get]
func HealthCheck(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]interface{}{
		"data": "Server is up and running",
	})
}

// [Notation]
// To initialize the swagger-go considering the file dependency,
// you had better to add --parseDependency --parseInternal
// Refer to https://stackoverflow.com/questions/65947311/how-to-use-a-type-definition-in-another-file-with-swaggo