import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { authenticate, authorize } from "@/lib/auth";

// GET SINGLE USER
export async function GET(request, { params }) {
  await connectDB();

  const auth = await authenticate(request);
  if (auth instanceof NextResponse) return auth;

  request.user = auth.user;

  if (!authorize("Admin")(request)) {
    return NextResponse.json(
      { message: "Access Forbidden" },
      { status: 403 }
    );
  }

  const user = await User.findById(params.id).select("-password");

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}

// UPDATE USER
export async function PUT(request, { params }) {
  await connectDB();

  const auth = await authenticate(request);
  if (auth instanceof NextResponse) return auth;

  request.user = auth.user;

  if (!authorize("Admin")(request)) {
    return NextResponse.json(
      { message: "Access Forbidden" },
      { status: 403 }
    );
  }

  const body = await request.json();

  if (body.password) {
    body.password = await bcrypt.hash(body.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(
    params.id,
    body,
    { new: true }
  ).select("-password");

  return NextResponse.json(updatedUser);
}

// DELETE USER
export async function DELETE(request, { params }) {
  await connectDB();

  const auth = await authenticate(request);
  if (auth instanceof NextResponse) return auth;

  request.user = auth.user;

  if (!authorize("Admin")(request)) {
    return NextResponse.json(
      { message: "Access Forbidden" },
      { status: 403 }
    );
  }

  await User.findByIdAndDelete(params.id);

  return NextResponse.json({
    message: "User deleted successfully",
  });
}