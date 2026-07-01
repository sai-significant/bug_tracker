import { authMiddleware } from "@/middleware/authMiddleware";

export async function authenticate(request) {
  return await authMiddleware(request);
}

export function authorize(...roles) {
  return (request) => {
    if (!roles.includes(request.user.role)) {
      return false;
    }

    return true;
  };
}