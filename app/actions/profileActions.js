"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function getProfile() {
  await connectDB();

  const user = await User.findOne()
    .select("-password")
    .lean();

  return JSON.parse(JSON.stringify(user));
}

export async function updateProfile(data) {
  await connectDB();

  const user = await User.findOne();

  if (!user) {
    throw new Error("User not found");
  }

  const updateData = {
    name: data.name,
    email: data.email,
    department: data.department,
    role: data.role,
  };

  // Update password only if entered
  if (data.password && data.password.trim() !== "") {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  await User.findByIdAndUpdate(user._id, updateData);

  revalidatePath("/profile");
}