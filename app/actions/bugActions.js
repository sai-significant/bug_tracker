"use server";

import connectDB from "@/lib/mongodb";
import Bug from "@/models/Bug";
import { revalidatePath } from "next/cache";

// GET ALL BUGS
export async function getBugs() {
  await connectDB();

  const bugs = await Bug.find().lean();

  return JSON.parse(JSON.stringify(bugs));
}

// CREATE BUG
export async function createBug(data) {
  await connectDB();

  await Bug.create({
    bugId: `BUG-${Date.now()}`,
    title: data.title,
    description: data.description,
    module: data.module,
    priority: data.priority,
    severity: data.severity,
    dueDate: data.dueDate,
    status: "Open",

    // Replace with logged-in user later
    createdBy: "6a439e51046eb74ad0ecec52",
  });

  revalidatePath("/bugs");
}

// UPDATE BUG
export async function updateBug(id, data) {
  await connectDB();

  await Bug.findByIdAndUpdate(id, {
    title: data.title,
    description: data.description,
    module: data.module,
    priority: data.priority,
    severity: data.severity,
    status: data.status,
    dueDate: data.dueDate,
  });

  revalidatePath("/bugs");
}

// DELETE BUG
export async function deleteBug(id) {
  await connectDB();

  await Bug.findByIdAndDelete(id);

  revalidatePath("/bugs");
}