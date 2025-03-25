import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Get the auth token from cookies
    const token = req.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({
        authenticated: false,
        user: null
      });
    }
    
    try {
      // Decode the token
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      
      return NextResponse.json({
        authenticated: true,
        user: {
          id: decoded.id,
          username: decoded.username,
          role: decoded.role
        }
      });
    } catch (e) {
      // Invalid token
      const response = NextResponse.json({
        authenticated: false,
        user: null
      });
      
      // Clear the invalid token
      response.cookies.set({
        name: 'auth_token',
        value: '',
        expires: new Date(0),
        path: '/',
      });
      
      return response;
    }
    
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 