"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} from "@/app/actions/userActions";

import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (id) => {
  if (!window.confirm("Delete this user?")) return;

  startTransition(async () => {
    try {
      await deleteUser(id);
      toast.success("User deleted");
      await loadUsers();
    } catch (error) {
      toast.error(error.message);
    }
  });
};

  const onSubmit = (data) => {
  startTransition(async () => {
    try {
      if (editingUser) {
        await updateUser(editingUser._id, data);
        toast.success("User updated successfully");
      } else {
        await createUser(data);
        toast.success("User created successfully");
      }

      reset();
      setEditingUser(null);
      setShowForm(false);

      await loadUsers();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  });
};

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users</h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showForm ? "Close" : "Add User"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow rounded-lg p-6 mb-6 grid grid-cols-2 gap-4"
        >
          <div>
            <input
              {...register("name", {
                required: "Name is required",
              })}
              placeholder="Name"
              className="w-full border rounded px-3 py-2"
            />
            <p className="text-red-500 text-sm">
              {errors.name?.message}
            </p>
          </div>

          <div>
            <input
              {...register("email", {
                required: "Email is required",
              })}
              type="email"
              placeholder="Email"
              className="w-full border rounded px-3 py-2"
            />
            <p className="text-red-500 text-sm">
              {errors.email?.message}
            </p>
          </div>

          <div>
           <input
  {...register("password", {
    validate: (value) => {
      if (!editingUser && !value) {
        return "Password is required";
      }

      if (value && value.length < 6) {
        return "Minimum 6 characters";
      }

      return true;
    },
  })}
  type="password"
  placeholder={
    editingUser
      ? "Leave blank to keep current password"
      : "Password"
  }
  className="w-full border rounded px-3 py-2"
/>
            <p className="text-red-500 text-sm">
              {errors.password?.message}
            </p>
          </div>

          <div>
            <select
              {...register("role", {
                required: "Role is required",
              })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Developer">Developer</option>
              <option value="Tester">Tester</option>
            </select>

            <p className="text-red-500 text-sm">
              {errors.role?.message}
            </p>
          </div>

          <div className="col-span-2">
            <input
              {...register("department", {
                required: "Department is required",
              })}
              placeholder="Department"
              className="w-full border rounded px-3 py-2"
            />

            <p className="text-red-500 text-sm">
              {errors.department?.message}
            </p>
          </div>

          <div className="col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="bg-green-600 text-white px-5 py-2 rounded"
            >
              {isPending
  ? "Saving..."
  : editingUser
  ? "Update User"
  : "Create User"}
            </button>

            <button
              type="button"
              onClick={() => {
                reset();
                setShowForm(false);
              }}
              className="bg-gray-500 text-white px-5 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Department</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
  <td className="p-3">{user.name}</td>

  <td className="p-3">{user.email}</td>

  <td className="p-3">
    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
      {user.role}
    </span>
  </td>

  <td className="p-3">{user.department}</td>

  <td className="p-3">
    <div className="flex justify-center gap-3">
      <button
        onClick={() => {
          setEditingUser(user);

          reset({
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
            department: user.department,
          });

          setShowForm(true);
        }}
        className="text-blue-600 hover:text-blue-800"
      >
        <Pencil size={18} />
      </button>

      <button
        onClick={() => {
  reset();
  setEditingUser(null);
  setShowForm(false);
}}
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
  );
}