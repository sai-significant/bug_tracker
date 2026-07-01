import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { authenticate, authorize } from "@/lib/auth";

// GET ALL USERS
export async function GET(request) {
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

  const users = await User.find().select("-password");

  return NextResponse.json(users);
}

// CREATE USER
export async function POST(request) {
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

  const { name, email, password, role, department } =
    await request.json();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return NextResponse.json(
      { message: "Email already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    department,
  });

  return NextResponse.json(user, { status: 201 });
}