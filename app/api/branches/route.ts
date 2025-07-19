import { NextRequest, NextResponse } from 'next/server'

// In-memory store for demo purposes (replace with DB in production)
interface Branch {
  id: number;
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
}

const branches: Branch[] = [
  {
    id: 1,
    branchName: "Josh Chicken & Grill - Ikeja",
    address: "123 Ikeja Street, Lagos",
    city: "Ikeja",
    state: "lagos",
    phone: "+2347012345678",
    opensAt: "09:00",
    closesAt: "22:00",
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    manager: "",
    menu: "",
    importMenuItems: false
  }
]

export async function GET() {
  return NextResponse.json(branches)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const newBranch = { ...data, id: Date.now() }
  branches.push(newBranch)
  return NextResponse.json(newBranch, { status: 201 })
}
