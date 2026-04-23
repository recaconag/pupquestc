import { Navigate, useLocation } from "react-router-dom";
import { getVerifiedUserFromStorage } from "../../auth/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

/**
 * Route guard component.
 * - No valid JWT  → redirect to /login (saves current path in location.state.from)
 * - adminOnly + role !== ADMIN → redirect to /
 * Uses synchronous localStorage read so there is no flash of unauthenticated content.
 */
const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const user = getVerifiedUserFromStorage();

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  if (adminOnly && user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
