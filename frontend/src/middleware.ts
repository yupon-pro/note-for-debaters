import NextAuth from 'next-auth';
import { authConfig } from './config/auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/((?!api|delivery/status|delivery/register|/|_next/static|_next/image|.*\\.png$).*)'],
};

