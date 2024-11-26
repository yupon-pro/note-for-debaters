package interfaces

import (
	"fmt"

	jwt "github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/yupon-pro/note-for-debater/utils"
)

type UserInToken struct{
	UserId int
	Email string
}

func UserInfoViaToken(e echo.Context) (UserInToken, error){
	// [Notion] 
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
	fmt.Println(uToken)
	return uToken, nil
}

func ApplyJWTMiddleware() echo.MiddlewareFunc {
	// [Notion]
	// This method may be used to protect by jwt authentication in other layers.
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
