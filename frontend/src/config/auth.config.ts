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
    async jwt({ token, user, trigger, session }){
      if(user && user.id ){
        token.id = user.id;
        token.accessToken = user.accessToken;
      }
      if(trigger === "update" && session) {
        token = {...token, user: session};
        return token;
        // [Notion]
        // Why and how is trigger used?
        // Refer to https://medium.com/@youngjun625/next-js14-nextauth-v5-2-session-update-b977cb6afd47
      }
      return token;
    },
    async session({ session, token }){
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      return session;
    }
  },
  providers: [],
} satisfies NextAuthConfig;