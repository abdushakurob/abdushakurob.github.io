import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import ConnectDB from '@/lib/dbConfig';

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findOne({ username });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // In a real app, you should use bcrypt to compare passwords
    // For simplicity, we're doing a direct comparison here
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Set a session cookie
    const token = Buffer.from(JSON.stringify({ 
      id: user._id,
      username: user.username,
      role: user.role 
    })).toString('base64');

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });

    // Set cookie with HTTP only flag
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'strict',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 