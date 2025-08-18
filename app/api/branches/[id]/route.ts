import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Mock data - in real app, use database
const mockBranches = [
  {
    id: 1,
    branchName: "Main Branch",
    address: "123 Main Street, Lagos",
    city: "Lagos",
    state: "Lagos",
    phone: "+234-123-456-7890",
    opensAt: "08:00",
    closesAt: "22:00",
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    manager: "John Doe",
    menu: "Standard Menu",
    importMenuItems: true
  },
  {
    id: 2,
    branchName: "Victoria Island",
    address: "456 VI Road, Lagos",
    city: "Lagos",
    state: "Lagos",
    phone: "+234-987-654-3210",
    opensAt: "09:00",
    closesAt: "21:00",
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    manager: "Jane Smith",
    menu: "Premium Menu",
    importMenuItems: false
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const branchId = parseInt(params.id);
    const branch = mockBranches.find(b => b.id === branchId);

    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(branch);
  } catch (error) {
    console.error('Error fetching branch:', error);
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
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const branchId = parseInt(params.id);
    const body = await request.json();

    const branchIndex = mockBranches.findIndex(b => b.id === branchId);
    if (branchIndex === -1) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }

    // Update branch
    mockBranches[branchIndex] = {
      ...mockBranches[branchIndex],
      ...body
    };

    return NextResponse.json(mockBranches[branchIndex]);
  } catch (error) {
    console.error('Error updating branch:', error);
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
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const branchId = parseInt(params.id);
    const branchIndex = mockBranches.findIndex(b => b.id === branchId);

    if (branchIndex === -1) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }

    // In real implementation, delete from database
    mockBranches.splice(branchIndex, 1);

    return NextResponse.json(
      { message: 'Branch deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting branch:', error);
    return NextResponse.json(
      { error: 'Failed to delete branch' },
      { status: 500 }
    );
  }
}
