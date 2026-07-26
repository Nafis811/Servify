import { Navigate, Outlet } from "react-router-dom";
import { getStoredSession } from "../features/auth/auth.session";

export function AdminGuard() {
  const session = getStoredSession();

  if (!session || session.user.role !== "admin") {
    // Prevent unauthorized users from visiting /admin
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
