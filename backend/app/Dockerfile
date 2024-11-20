# For development
FROM golang:1.23-alpine

ENV TZ=Asia/Tokyo

WORKDIR /app

COPY . /app

RUN apk update && apk add git

RUN go install github.com/air-verse/air@latest
RUN go install github.com/swaggo/swag/cmd/swag@latest
RUN swag init -g /app/main.go

CMD ["air", "-c", ".air.toml"]

