import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * PublicRoute - Redirects authenticated users away from public auth pages
 * If user is authenticated, redirects them to their dashboard based on role
 * If not authenticated, allows access to the public route
 */
export const PublicRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  // If user is authenticated, redirect to their dashboard
  if (isAuthenticated) {
    const role = user?.role;
    const adminRole = user?.adminRole;
    const hasActiveSubscription =
      localStorage.getItem('hasActiveSubscription') === 'true' ||
      sessionStorage.getItem('hasActiveSubscription') === 'true';

    // Determine redirect destination based on role
    if (role === 'superadmin') {
      return <Navigate to="/admin" replace />;
    } else if (role === 'admin') {
      // For admin users, use adminRole to determine the dashboard
      if (adminRole === 'gatherer') {
        return <Navigate to="/gatherer" replace />;
      } else if (adminRole === 'creator') {
        return <Navigate to="/creator" replace />;
      } else if (adminRole === 'processor') {
        return <Navigate to="/processor" replace />;
      } else if (adminRole === 'explainer') {
        return <Navigate to="/explainer" replace />;
      } else {
        // Default admin users to admin dashboard
        return <Navigate to="/admin" replace />;
      }
    } else if (role === 'student' || role === 'user') {
      // Redirect to subscription bridge - it will check subscription and route accordingly
      return <Navigate to="/question-banks" replace />;
    } else if (role === 'gatherer') {
      return <Navigate to="/gatherer" replace />;
    } else if (role === 'creator') {
      return <Navigate to="/creator" replace />;
    } else if (role === 'processor') {
      return <Navigate to="/processor" replace />;
    } else if (role === 'explainer') {
      return <Navigate to="/explainer" replace />;
    } else {
      // Default fallback to dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  // User is not authenticated, allow access to public route
  return <Outlet />;
};

