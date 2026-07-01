"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  LayoutDashboard,
  Bug,
  Users,
  User,
  LogOut,
} from "lucide-react";

import { logout } from "@/app/actions/authActions";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const menus = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      title: "Bugs",
      icon: Bug,
      path: "/bugs",
    },
    {
      title: "Users",
      icon: Users,
      path: "/users",
    },
    {
      title: "Profile",
      icon: User,
      path: "/profile",
    },
  ];

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logout();

        router.push("/login");
        router.refresh();
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-5">

      <h1 className="text-2xl font-bold mb-10">
        Bug Tracker
      </h1>

      <div className="space-y-3">
        {menus.map((menu) => (
          <Link
            key={menu.title}
            href={menu.path}
            className={`flex items-center gap-3 p-3 rounded-lg ${
              pathname === menu.path
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`}
          >
            <menu.icon size={20} />
            {menu.title}
          </Link>
        ))}
      </div>

      <button
        onClick={handleLogout}
        disabled={isPending}
        className="mt-10 flex items-center gap-3 p-3 rounded-lg hover:bg-red-600 w-full"
      >
        <LogOut size={20} />
        {isPending ? "Logging out..." : "Logout"}
      </button>

    </div>
  );
}