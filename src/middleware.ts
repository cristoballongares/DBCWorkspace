import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: [
    '/((?!login|invite|api/auth|api/invitations/accept|_next/static|_next/image|favicon.ico).*)',
  ],
};
