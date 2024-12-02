package interfaces

import (
	"fmt"
	"time"

	jwt "github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/yupon-pro/note-for-debater/utils"
)

type jwtCustomClaims struct {
	Email string 
	UserId int   
	jwt.RegisteredClaims
}

type UserInToken struct{
	UserId int
	Email string
}

func GetJWTToken(email string, userId int) (string, error) {
	claims := &jwtCustomClaims{
		email,
		userId,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	JWTSecret, err := utils.GetJWTSecret()
	if err != nil{
		return "", fmt.Errorf("failed to get environment: %w", err)
	}

	t, err := token.SignedString([]byte(JWTSecret))
	if err != nil{
		return "", fmt.Errorf("failed to create access token: %w", err)
	}

	return t, nil
}

func UserInfoViaToken(e echo.Context) (UserInToken, error){
	// [Notation] 
	// This method may be used to get user info in other interface layers.
	user, ok := e.Get("user").(*jwt.Token)

	if !ok {
		return UserInToken{}, fmt.Errorf("failed to retrieve user token")
	}

	return ExtractUseInfoFromToken(user)

}

func ExtractUseInfoFromToken(userToken *jwt.Token) (UserInToken, error) {
	claims, ok := userToken.Claims.(*jwtCustomClaims)
	if !ok {
		return UserInToken{}, fmt.Errorf("invalid token claims")
	}

	uToken := UserInToken{
		claims.UserId,
		claims.Email,
	}

	return uToken, nil
}

func ApplyJWTMiddleware() echo.MiddlewareFunc {
	// [Notation]
	// This method may be used to protect endpoints by jwt authentication in other layers.
	JWTSecret, err := utils.GetJWTSecret()
	if err != nil{
		fmt.Println(err)
	}

	jwtMiddleware := echojwt.WithConfig(echojwt.Config{
    SigningKey: []byte(JWTSecret),
    NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(jwtCustomClaims)
    },
	})
	return jwtMiddleware
}
