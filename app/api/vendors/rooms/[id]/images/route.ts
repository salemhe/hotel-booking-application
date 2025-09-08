import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/app/config';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const authHeader = request.headers.get('authorization');

    const response = await fetch(`${API_URL}/api/vendors/rooms/${id}/images`, {
      method: 'POST',
      headers: {
        ...(authHeader && { 'Authorization': authHeader })
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error uploading room images:', error);
    return NextResponse.json(
      { error: 'Failed to upload room images' },
      { status: 500 }
    );
  }
}
