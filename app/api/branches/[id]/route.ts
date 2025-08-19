import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const branchId = parseInt(params.id);
    
    // Fetch branch from backend
    const response = await axios.get(`${BASE_URL}/api/branches/${branchId}`, {
      headers: {
        'Authorization': `Bearer ${(session as any).accessToken}`
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching branch:', error);
    
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch branch' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const branchId = parseInt(params.id);
    const body = await request.json();

    // Update branch in backend
    const response = await axios.put(
      `${BASE_URL}/api/branches/${branchId}`,
      body,
      {
        headers: {
          'Authorization': `Bearer ${(session as any).accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error updating branch:', error);
    
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update branch' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const branchId = parseInt(params.id);

    // Delete branch from backend
    await axios.delete(`${BASE_URL}/api/branches/${branchId}`, {
      headers: {
        'Authorization': `Bearer ${(session as any).accessToken}`
      }
    });

    return NextResponse.json(
      { message: 'Branch deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting branch:', error);
    
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete branch' },
      { status: 500 }
    );
  }
}
