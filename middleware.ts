import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get('expo_token')?.value;
    const pathname = request.nextUrl.pathname;

    const isPublicRoute = publicRoutes.includes(pathname);

    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
    }

    export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};