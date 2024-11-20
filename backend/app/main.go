package main

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/yupon-pro/note-for-debater/infrastructure"
	echoswagger "github.com/swaggo/echo-swagger"
)


func main() {
	mydb := new(infrastructure.MyDB)
	if err := mydb.Connect(); err != nil{
		log.Fatal(err)
	}
	defer mydb.Disconnect()

	if err := mydb.Ping(); err != nil{
		log.Fatal(err)
	}

	e := echo.New()
	e.GET("/", func(c echo.Context)error{return c.String(http.StatusOK, "hello")})

	e.Logger.Fatal(e.Start(":8080"))

}