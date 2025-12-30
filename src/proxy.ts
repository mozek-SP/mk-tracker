import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
    // Check if the user has an auth cookie
    const authCookie = request.cookies.get('auth');
    const isLoginPage = request.nextUrl.pathname === '/login';

    // If user is not authenticated and trying to access restricted pages (root)
    if (!authCookie && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If user is authenticated and tries to go to login, redirect to dashboard
    if (authCookie && isLoginPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
