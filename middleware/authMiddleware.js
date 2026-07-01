import { NextResponse } from "next/server";
import { verifyToken } from "../lib/jwt";

export async function authMiddleware(request) {
  try {
    console.log(request.headers.get("authorization"));

    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Access denied. No token provided." },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    request.user = decoded;

    return request;
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid or expired token." },
      { status: 401 }
    );
  }
}