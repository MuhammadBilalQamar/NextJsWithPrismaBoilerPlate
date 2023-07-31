import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// THESE ROUTES WILL BE IGNORED AND CONSIDER AS PUBLIC ROUTES
const ignoreRoute = [
  {
    path: '/api/sync-users',
    method: 'GET',
    match: 'startWith',
  },
  {
    path: '/api/getMetaFields',
    method: 'GET',
    match: 'exact',
  },
  {
    path: '/api/profile',
    method: 'GET',
    match: 'startWith',
  },
  {
    path: '/api/getPostUrl',
    method: 'GET',
    match: 'startWith',
  },
  {
    path: '/api/s3',
    method: 'GET',
    match: 'startWith',
  },
  {
    path: '/api/users',
    method: 'GET',
    match: 'startWith',
  },
];

export default async function middleware(req: NextRequest) {
  try {
    const pathname = req.nextUrl.pathname as string;
    for (const path of ignoreRoute) {
      if (path.match === 'startWith' && pathname.startsWith(path.path))
        return NextResponse.next();
      if (path.match === 'exact' && pathname === path.path)
        return NextResponse.next();
    }
    return NextResponse.next();
  } catch (error) {
    console.log(error);
  }
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*', '/dashboard/:path*'],
};
