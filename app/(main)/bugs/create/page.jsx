"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createBug } from "@/app/actions/bugActions";

export default function CreateBug() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    startTransition(async () => {
      try {
        await createBug(data);

        toast.success("Bug created successfully");

        reset();

        router.push("/bugs");
        router.refresh();
      } catch (err) {
        toast.error(err.message);
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Create Bug</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <input
            {...register("title", {
              required: "Title is required",
            })}
            placeholder="Bug Title"
            className="border p-3 rounded w-full"
          />
          <p className="text-red-500 text-sm">
            {errors.title?.message}
          </p>
        </div>

        <div>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            rows={5}
            placeholder="Description"
            className="border p-3 rounded w-full"
          />
          <p className="text-red-500 text-sm">
            {errors.description?.message}
          </p>
        </div>

        <div>
          <input
            {...register("module", {
              required: "Module is required",
            })}
            placeholder="Module"
            className="border p-3 rounded w-full"
          />
          <p className="text-red-500 text-sm">
            {errors.module?.message}
          </p>
        </div>

        <select
          {...register("priority")}
          className="border p-3 rounded w-full"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>

        <select
          {...register("severity")}
          className="border p-3 rounded w-full"
        >
          <option value="Minor">Minor</option>
          <option value="Major">Major</option>
          <option value="Critical">Critical</option>
        </select>

        <input
          type="date"
          {...register("dueDate")}
          className="border p-3 rounded w-full"
        />

        <button
          disabled={isPending}
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          {isPending ? "Creating..." : "Create Bug"}
        </button>
      </form>
    </div>
  );
}