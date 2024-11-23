package main

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echoswagger "github.com/swaggo/echo-swagger"
	"github.com/yupon-pro/note-for-debater/config"
	"github.com/yupon-pro/note-for-debater/infrastructure"
	"github.com/yupon-pro/note-for-debater/interfaces"
	"github.com/yupon-pro/note-for-debater/usecase"
)


func main() {
	// [TODO] Implement JWT and authentication.

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
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	noteRepository := infrastructure.NewNoteRepositoryInfrastructure(mydb)
	noteUsecase := usecase.NewNoteUsecase(noteRepository)
	noteController := interfaces.NewNoteController(noteUsecase)

	userRepository := infrastructure.NewUserRepositoryInfrastructure(mydb)
	userUsecase := usecase.NewUserUsecase(userRepository)
	userController := interfaces.NewUserController(userUsecase)

	controllers := interfaces.NewControllers(noteController, userController)
	controllers.Mount(e)

	e.GET("/", func(c echo.Context)error{return c.String(http.StatusOK, "hello")})

	e.Logger.Fatal(e.Start(":8082"))

}