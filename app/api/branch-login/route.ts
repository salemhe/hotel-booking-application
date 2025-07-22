import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db();
  const branch = await db.collection('branches').findOne({ email });
  if (!branch) {
    return NextResponse.json({ error: 'Branch not found.' }, { status: 404 });
  }
  if (!branch.password) {
    return NextResponse.json({ error: 'No password set for this branch.' }, { status: 400 });
  }
  const isMatch = await bcrypt.compare(password, branch.password);
  if (!isMatch) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }
  // Remove password from response
  const { password: _, ...branchData } = branch;
  return NextResponse.json({ branch: branchData });
}
