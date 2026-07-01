"use server";

import { cookies } from "next/headers";

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete("token"); // Replace "token" with your cookie name if different

  return {
    success: true,
  };
}