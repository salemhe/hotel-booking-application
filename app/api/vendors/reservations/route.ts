import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/app/config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');

    if (!vendorId) {
      return NextResponse.json(
        { error: 'Vendor ID is required' },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('authorization');
    const response = await fetch(`${API_URL}/api/vendors/reservations?vendorId=${vendorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader })
      }
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching vendor reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendor reservations' },
      { status: 500 }
    );
  }
}
