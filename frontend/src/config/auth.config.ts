import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/auth/signIn',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }){
      const isLoggedIn = !!auth?.user;
      const isOnUser = nextUrl.pathname.includes("mypage");
      if (isOnUser) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
    async jwt({ token, user, }){
      if(user && user.id ){
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }){
      session.user.id = token.id;
      return session;
    }
  },
  providers: [],
} satisfies NextAuthConfig;