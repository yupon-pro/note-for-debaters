import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { authenticate } from "@/libs/auth";
import { isLoginData, isUserWithToken } from "@/utils/authTypeGuard";

export const {
	auth,
	signIn,
	signOut,
	handlers: { GET, POST },
} = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			name: "SignIn",
			async authorize(credentials) {
				// this value presume that it is not form data but normal object.
				if (isLoginData(credentials)) {
					const { email, password } = credentials;
          
					try{
						const { user, accessToken } = await authenticate({ email, password });
						
						return { ...user, accessToken };
						// [Notion]
						// Due to type of user object defined in next-auth.d.ts,
						// the user object must contain access token.
					}catch(error){
						console.log(error);
						return null;
					}
				}
				console.log("Invalid credentials");
				return null;
			},
		}),
		Credentials({
			name: "SignUp",
			async authorize(credentials) {
				// this value presume that it is not form data but normal object.
				if (isUserWithToken(credentials)) {
					const { user, accessToken } = credentials;
          
					return { ...user, accessToken}
				}
				console.log("Invalid credentials");
				return null;
			},
		}),
	],
});
