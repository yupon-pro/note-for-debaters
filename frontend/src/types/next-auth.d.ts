
import type { DefaultSession } from 'next-auth';
import { User as DefaultUser } from "next-auth";
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string;
      name: string;
      email: string;
    } & DefaultSession["user"]
    accessToken?: string;
  }

  interface User extends DefaultUser{
    id: string;
  }
}


declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    accessToken?: string;
  }
}
