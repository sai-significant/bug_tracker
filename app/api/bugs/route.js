import { NextResponse } from "next/server";
import User from "@/models/User";

import connectDB from "@/lib/mongodb";
import Bug from "@/models/Bug";
import { authenticate } from "@/lib/auth";

// GET ALL BUGS
export async function GET(request) {
  await connectDB();

  const auth = await authenticate(request);

  if (auth instanceof NextResponse) return auth;

  const bugs = await Bug.find()
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  return NextResponse.json(bugs);
}

// CREATE BUG
export async function POST(request) {
  await connectDB();

  const auth = await authenticate(request);

  if (auth instanceof NextResponse) return auth;

  const body = await request.json();

  const count = await Bug.countDocuments();

  const bug = await Bug.create({
    bugId: `BUG-${1001 + count}`,
    title: body.title,
    description: body.description,
    module: body.module,
    priority: body.priority,
    severity: body.severity,
    dueDate: body.dueDate,
    createdBy: auth.user.id,
  });

  return NextResponse.json(bug, { status: 201 });
}