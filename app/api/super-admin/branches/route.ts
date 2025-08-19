import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Extend the NextAuth session type to include user role
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      accessToken?: string;
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: No session found' },
        { status: 401 }
      );
    }

    // Check if user has super-admin role
    if (session.user.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    // Build where clause
    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status && status !== 'All') {
      whereClause.status = status;
    }

    // Get total count for pagination
    const totalBranches = await prisma.branch.count({ where: whereClause });

    // Fetch branches with related data
    const branches = await prisma.branch.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        reservations: {
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          },
          select: {
            id: true,
            totalAmount: true
          }
        },
        menuItems: {
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          },
          select: {
            id: true,
            name: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      }
    });

    // Define interface for the branch data structure
    interface BranchWithRelations {
      id: string;
      name: string;
      status: string;
      address: string;
      city: string;
      phoneNumber: string | null;
      email: string;
      reservations: Array<{
        id: string;
        totalAmount: number | null;
      }>;
      menuItems: Array<{
        id: string;
        name: string;
      }>;
      reviews: Array<{
        rating: number;
      }>;
    }

    // Transform data to match expected format
    const transformedBranches = branches.map((branch: BranchWithRelations) => {
      const todayReservations = branch.reservations.length;
      const todayRevenue = branch.reservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
      const averageRating = branch.reviews.length > 0 
        ? branch.reviews.reduce((sum, r) => sum + r.rating, 0) / branch.reviews.length 
        : 0;
      const lastFoodToday = branch.menuItems.length > 0 ? branch.menuItems[branch.menuItems.length - 1]?.name : 'N/A';

      return {
        id: branch.id,
        name: branch.name,
        status: branch.status,
        todayReservation: todayReservations,
        todayRevenue: todayRevenue,
        lastFoodToday: lastFoodToday,
        averageRating: parseFloat(averageRating.toFixed(1)),
        address: branch.address,
        city: branch.city,
        phoneNumber: branch.phoneNumber,
        email: branch.email
      };
    });

    return NextResponse.json({
      data: transformedBranches,
      totalPages: Math.ceil(totalBranches / limit),
      currentPage: page,
      totalBranches: totalBranches
    });
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branches' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: User not found' },
        { status: 401 }
      );
    }

    // Check if user has super-admin role
    if (session.user.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'address', 'city', 'email', 'password'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingBranch = await prisma.branch.findUnique({
      where: { email: body.email }
    });

    if (existingBranch) {
      return NextResponse.json(
        { error: 'Branch with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create new branch
    const newBranch = await prisma.branch.create({
      data: {
        name: body.name,
        address: body.address,
        city: body.city,
        phoneNumber: body.phoneNumber,
        email: body.email,
        password: hashedPassword,
        businessType: body.businessType || 'restaurant',
        openingDays: body.openingDays || [],
        opensAt: body.opensAt || '08:00',
        closesAt: body.closesAt || '22:00',
        status: 'Active',
        assignedManager: body.assignedManager || null,
        assignedMenu: body.assignedMenu || null,
        importAllMenuItems: body.importAllMenuItems || false
      }
    });

    // Return created branch without password
    const { password, ...branchWithoutPassword } = newBranch;

    return NextResponse.json(branchWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Error creating branch:', error);
    return NextResponse.json(
      { error: 'Failed to create branch' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
