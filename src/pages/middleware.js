import { NextResponse } from 'next/server'
import  { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware( NextRequest) {
  return NextResponse.redirect(new URL('https://rio.mn:8080/dashboard/mail'), request.url)
}
console.log('iiii')
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/developer/collections/',
}