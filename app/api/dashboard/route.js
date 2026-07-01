import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Bug from "@/models/Bug";
import { authMiddleware } from "@/middleware/authMiddleware";


export async function GET(request) {
  console.log("sai")
  await connectDB();

  const auth = await authMiddleware(request);

  if (auth instanceof NextResponse) {
    return auth;
  }

  const bugs = await Bug.find();

  const total = bugs.length;
  const open = bugs.filter(b => b.status === "Open").length;
  const resolved = bugs.filter(b => b.status === "Resolved").length;

  return NextResponse.json({
    total,
    open,
    resolved,
  });
}