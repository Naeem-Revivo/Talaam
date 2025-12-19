import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isProfileComplete } from '../utils/profileUtils';

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
  const adminRole = user?.adminRole;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allow.length > 0) {
    // Check if user has access based on role or adminRole
    let hasAccess = false;

    // For admin routes: allow superadmin OR admin without adminRole
    if (allow.includes('admin') || allow.includes('superadmin')) {
      if (role === 'superadmin') {
        // Superadmin always has access to admin routes
        hasAccess = true;
      } else if (role === 'admin') {
        // Admin only has access if they don't have an adminRole
        // Users with adminRole should go to their specific role routes
        hasAccess = !adminRole;
      }
    }

    // For role-specific routes (gatherer, creator, processor, explainer)
    // Allow if role matches OR if user is admin with matching adminRole
    allow.forEach((allowedRole) => {
      if (allowedRole !== 'admin' && allowedRole !== 'superadmin') {
        if (role === allowedRole || (role === 'admin' && adminRole === allowedRole)) {
          hasAccess = true;
        }
      }
    });

    if (!hasAccess) {
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
      
      // Determine redirect based on adminRole if user is admin, otherwise use role
      const redirectRole = (role === 'admin' && adminRole) ? adminRole : role;
      return <Navigate to={homeRoutes[redirectRole] || '/dashboard'} replace />;
    }
  }

  // For student/user routes, check if profile is complete
  if (allow.includes('user') && (role === 'user' || role === 'student')) {
    if (!isProfileComplete(user)) {
      return <Navigate to="/complete-profile" replace />;
    }
  }

  return <Outlet />;
};