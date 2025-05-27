import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete("user-token");
  cookieStore.delete("vendor-token");
  return NextResponse.json({ message: "Token cleared" });
}
