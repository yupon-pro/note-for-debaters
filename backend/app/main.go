package main

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echoswagger "github.com/swaggo/echo-swagger"
	"github.com/yupon-pro/note-for-debater/config"
	"github.com/yupon-pro/note-for-debater/infrastructure"
)


func main() {
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

	e.GET("/", func(c echo.Context)error{return c.String(http.StatusOK, "hello")})

	e.Logger.Fatal(e.Start(":8082"))

}