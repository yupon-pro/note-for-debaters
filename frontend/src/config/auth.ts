import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { getUser } from "@/libs/getUser";

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
				const parsedCredentials = z
					.object({ email: z.string().email(), password: z.string().min(6) })
					.safeParse(credentials);

				if (parsedCredentials.success) {
					const { email, password } = parsedCredentials.data;
          
					try{
						const user = await getUser({ email, password });
						
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
