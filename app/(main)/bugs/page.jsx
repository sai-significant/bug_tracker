"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  getBugs,
  createBug,
  updateBug,
  deleteBug,
} from "@/app/actions/bugActions";
import { Pencil, Trash2 } from "lucide-react";

export default function BugsPage() {
  const [bugs, setBugs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBug, setEditingBug] = useState(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    loadBugs();
  }, []);

  async function loadBugs() {
    try {
      const data = await getBugs();
      setBugs(data);
    } catch (error) {
      toast.error("Failed to load bugs");
      console.error(error);
    }
  }
  const handleDelete = (id) => {
  if (!window.confirm("Delete this bug?")) return;

  startTransition(async () => {
    try {
      await deleteBug(id);

      toast.success("Bug deleted");

      await loadBugs();
    } catch (error) {
      toast.error(error.message);
    }
  });
};

  const onSubmit = (data) => {
  startTransition(async () => {
    try {
      if (editingBug) {
        await updateBug(editingBug._id, data);
        toast.success("Bug updated successfully");
      } else {
        await createBug(data);
        toast.success("Bug created successfully");
      }

      reset();

      setEditingBug(null);
      setShowForm(false);

      await loadBugs();
    } catch (error) {
      toast.error(error.message);
    }
  });
};

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bug Management</h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          {showForm ? "Close" : "Create Bug"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow rounded-lg p-6 mb-6 grid grid-cols-2 gap-4"
        >
          <div>
            <label className="font-medium">Title</label>

            <input
              {...register("title", {
                required: "Title is required",
              })}
              className="w-full border rounded p-2 mt-1"
              placeholder="Enter bug title"
            />

            <p className="text-red-500 text-sm">
              {errors.title?.message}
            </p>
          </div>

          <div>
            <label className="font-medium">Module</label>

            <input
              {...register("module", {
                required: "Module is required",
              })}
              className="w-full border rounded p-2 mt-1"
              placeholder="Authentication"
            />

            <p className="text-red-500 text-sm">
              {errors.module?.message}
            </p>
          </div>

          <div>
            <label className="font-medium">Priority</label>

            <select
              {...register("priority")}
              className="w-full border rounded p-2 mt-1"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Severity</label>

            <select
              {...register("severity")}
              className="w-full border rounded p-2 mt-1"
            >
              <option value="Minor">Minor</option>
              <option value="Major">Major</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div>
  <label className="font-medium">Status</label>

  <select
    {...register("status")}
    className="w-full border rounded p-2 mt-1"
  >
    <option value="Open">Open</option>
    <option value="Assigned">Assigned</option>
    <option value="In Progress">In Progress</option>
    <option value="Resolved">Resolved</option>
    <option value="Closed">Closed</option>
    <option value="Rejected">Rejected</option>
  </select>
</div>

          <div className="col-span-2">
            <label className="font-medium">Description</label>

            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              rows={5}
              className="w-full border rounded p-2 mt-1"
              placeholder="Describe the bug..."
            />

            <p className="text-red-500 text-sm">
              {errors.description?.message}
            </p>
          </div>

          <div>
            <label className="font-medium">Due Date</label>

            <input
              type="date"
              {...register("dueDate")}
              className="w-full border rounded p-2 mt-1"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isPending}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
            >
              {isPending
  ? "Saving..."
  : editingBug
  ? "Update Bug"
  : "Create Bug"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Module</th>
              <th className="p-3 text-left">Priority</th>
              <th className="p-3 text-left">Severity</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Due Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bugs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-6">
                  No Bugs Found
                </td>
              </tr>
            ) : (
              bugs.map((bug) => (
                <tr key={bug._id} className="border-t hover:bg-gray-50">

  <td className="p-3">{bug.title}</td>

  <td className="p-3">{bug.module}</td>

  <td className="p-3">
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        bug.priority === "Critical"
          ? "bg-purple-100 text-purple-700"
          : bug.priority === "High"
          ? "bg-red-100 text-red-700"
          : bug.priority === "Medium"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {bug.priority}
    </span>
  </td>

  <td className="p-3">{bug.severity}</td>

  <td className="p-3">
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        bug.status === "Open"
          ? "bg-red-100 text-red-700"
          : bug.status === "Resolved"
          ? "bg-green-100 text-green-700"
          : bug.status === "In Progress"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      {bug.status}
    </span>
  </td>

  <td className="p-3">
    {bug.dueDate
      ? new Date(bug.dueDate).toLocaleDateString()
      : "-"}
  </td>

  <td className="p-3">

    <div className="flex justify-center gap-3">

      <button
        className="text-blue-600 hover:text-blue-800"
        onClick={() => {
          setEditingBug(bug);

          reset({
            title: bug.title,
            module: bug.module,
            description: bug.description,
            priority: bug.priority,
            severity: bug.severity,
            status: bug.status,
            dueDate: bug.dueDate
              ? bug.dueDate.substring(0, 10)
              : "",
          });

          setShowForm(true);
        }}
      >
        <Pencil size={18} />
      </button>

      <button
        onClick={() => handleDelete(bug._id)}
        className="text-red-600 hover:text-red-800"
      >
        <Trash2 size={18} />
      </button>

    </div>

  </td>

</tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}