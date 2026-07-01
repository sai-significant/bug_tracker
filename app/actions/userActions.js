"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { authenticate, authorize } from "@/lib/auth";

// GET ALL USERS
export async function getUsers(request) {
  await connectDB();

  const users = await User.find().select("-password").lean();

  return JSON.parse(JSON.stringify(users));
}

// CREATE USER
export async function createUser( data) {
  await connectDB();
console.log(data,"data")
  const { name, email, password, role, department } = data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    department,
  });

  revalidatePath("/users");
}

export async function updateUser(id, data) {
  await connectDB();

  const updateData = {
    name: data.name,
    email: data.email,
    role: data.role,
    department: data.department,
  };

  // Update password only if a new one was entered
  if (data.password && data.password.trim() !== "") {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  await User.findByIdAndUpdate(id, updateData);

  revalidatePath("/users");
}

export async function deleteUser(id) {
  await connectDB();

  await User.findByIdAndDelete(id);

  revalidatePath("/users");
}