import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/app/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    const response = await fetch(`${API_URL}/api/vendor/hotel-accounts/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader })
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error verifying account:', error);
    return NextResponse.json(
      { error: 'Failed to verify account' },
      { status: 500 }
    );
  }
}
