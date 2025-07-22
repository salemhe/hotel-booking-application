import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

interface Branch {
  _id?: ObjectId;
  branchName: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  opensAt: string;
  closesAt: string;
  selectedDays: string[];
  manager: string;
  menu: string;
  importMenuItems: boolean;
  email?: string; // for login
  password?: string; // hashed password for login
}

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const branches = await db.collection<Branch>('branches').find({}).toArray();
  return NextResponse.json(branches);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const client = await clientPromise;
  const db = client.db();
  // Optionally hash password here if provided
  const result = await db.collection<Branch>('branches').insertOne(data);
  const newBranch = await db.collection<Branch>('branches').findOne({ _id: result.insertedId });
  return NextResponse.json(newBranch, { status: 201 });
}
