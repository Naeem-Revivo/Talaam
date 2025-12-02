import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Guard that ONLY uses Redux auth state
export const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth || {});

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

// Role-based guard that ONLY uses Redux auth state
export const RoleRoute = ({ allow = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  // Normalize role from Redux user
  // Backend currently uses 'student' for regular users → map to 'user' to match existing routes
  const backendRole = user?.role;
  const role =
    backendRole === 'student' ? 'user' : backendRole || null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (allow.length > 0 && !allow.includes(role)) {
      // If user is logged in but not allowed, redirect them to their home
      const homeRoutes = {
        admin: '/admin',
        superadmin: '/admin',
        user: '/dashboard',
        gatherer: '/gatherer',
        creator: '/creator',
        processor: '/processor',
        explainer: '/explainer'
      };
    return <Navigate to={homeRoutes[role] || '/dashboard'} replace />;
  }
  return <Outlet />;
};