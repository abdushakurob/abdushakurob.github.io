import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import ConnectDB from '@/lib/dbConfig';

// This endpoint should be secured in production or removed after initial setup
export async function POST(req: NextRequest) {
  try {
    await ConnectDB();
    
    // Check if admin user already exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      return NextResponse.json(
        { message: 'Admin user already exists' },
        { status: 400 }
      );
    }
    
    // Get admin credentials from request
    const { username, password } = await req.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Create admin user
    const admin = await User.create({
      username,
      password, // In a real app, hash this password with bcrypt
      role: 'admin'
    });
    
    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: admin._id,
        username: admin.username,
        role: admin.role
      }
    });
    
  } catch (error) {
    console.error('Admin init error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 