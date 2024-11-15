import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { authenticate } from "@/libs/auth";
import { isLoginData } from "@/utils/authTypeGuard";

export const {
	auth,
	signIn,
	signOut,
	handlers: { GET, POST },
} = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			async authorize(credentials) {
				// this value presume that it is not form data but normal object.
				if (isLoginData(credentials)) {
					const { email, password } = credentials;
          
					try{
						const user = await authenticate({ email, password });
						
						return user;
					}catch(error){
						console.log(error);
						return null;
					}
				}
				console.log("Invalid credentials");
				return null;
			},
		}),
	],
});
