import { NextResponse } from "next/server";
import User from "@/models/User";

import connectDB from "@/lib/mongodb";
import Bug from "@/models/Bug";
import { authenticate } from "@/lib/auth";

// GET SINGLE BUG
export async function GET(request, { params }) {
  await connectDB();

  const auth = await authenticate(request);

  if (auth instanceof NextResponse) return auth;

  const bug = await Bug.findById(params.id)
    .populate("assignedTo")
    .populate("createdBy");

  if (!bug) {
    return NextResponse.json(
      { message: "Bug not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(bug);
}

// UPDATE BUG
export async function PUT(request, { params }) {
  await connectDB();

  const auth = await authenticate(request);

  if (auth instanceof NextResponse) return auth;

  const body = await request.json();

  const updatedBug = await Bug.findByIdAndUpdate(
    params.id,
    body,
    { new: true }
  );

  if (!updatedBug) {
    return NextResponse.json(
      { message: "Bug not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updatedBug);
}

// DELETE BUG
export async function DELETE(request, { params }) {
  await connectDB();

  const auth = await authenticate(request);

  if (auth instanceof NextResponse) return auth;

  const deletedBug = await Bug.findByIdAndDelete(params.id);

  if (!deletedBug) {
    return NextResponse.json(
      { message: "Bug not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Bug deleted successfully",
  });
}