"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  getProfile,
  updateProfile,
} from "@/app/actions/profileActions";

export default function ProfilePage() {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    async function loadProfile() {
      try {
        const user = await getProfile();

        if (user) {
          reset(user);
        }
      } catch (err) {
        toast.error("Failed to load profile");
      }
    }

    loadProfile();
  }, [reset]);

  const onSubmit = (data) => {
    startTransition(async () => {
      try {
        await updateProfile(data);
        toast.success("Profile Updated");
      } catch (err) {
        toast.error(err.message || "Something went wrong");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-8">
      <h1 className="text-3xl font-bold mb-6">
        My Profile
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div>
          <label className="block mb-1 font-medium">
            Full Name
          </label>

          <input
            {...register("name")}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Email
          </label>

          <input
            type="email"
            {...register("email")}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Department
          </label>

          <input
            {...register("department")}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Department"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Role
          </label>

          <select
            {...register("role")}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Developer">Developer</option>
            <option value="Tester">Tester</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            New Password
          </label>

          <input
            type="password"
            {...register("password")}
            minLength={6}
            className="w-full border rounded px-3 py-2"
            placeholder="Leave blank to keep current password"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
        >
          {isPending ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}