import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../store/slices/authSlice';
import { showSuccessToast, showErrorToast } from '../utils/toastConfig';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent duplicate execution (React StrictMode runs effects twice in development)
    if (hasProcessed.current) {
      return;
    }
    hasProcessed.current = true;

    const token = searchParams.get('token');
    const provider = searchParams.get('provider');
    const error = searchParams.get('error');
    const isNewUser = searchParams.get('isNewUser') === 'true';

    if (error) {
      showErrorToast(decodeURIComponent(error), { 
        title: 'Authentication Failed',
        isAuth: true 
      });
      navigate('/login', { replace: true });
      return;
    }

    if (token) {
      // OAuth logins default to rememberMe = true (persistent storage)
      localStorage.setItem('authToken', token);
      localStorage.setItem('rememberMe', 'true');
      // Clear from sessionStorage if it exists
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
      
      // Fetch user data
      dispatch(fetchCurrentUser())
        .then((result) => {
          if (fetchCurrentUser.fulfilled.match(result)) {
            const user = result.payload?.data?.user;
            
            // Store user in localStorage (OAuth logins are persistent)
            if (user) {
              localStorage.setItem('user', JSON.stringify(user));
            }

            // Show success message based on whether it's a new account or existing login
            const providerName = provider === 'google' ? 'Google' : provider === 'linkedin' ? 'LinkedIn' : 'OAuth';
            if (isNewUser) {
              // New account created
              showSuccessToast(
                `${providerName} account created successfully!`,
                { 
                  title: 'Account Created',
                  isAuth: true 
                }
              );
            } else {
              // Existing account login
              showSuccessToast(
                `${providerName} login successful!`,
                { 
                  title: 'Login Successful',
                  isAuth: true 
                }
              );
            }
            
            // Redirect based on user role
            const role = user?.role === 'student' ? 'user' : user?.role;
            
            if (role === 'admin' || role === 'superadmin') {
              navigate('/admin', { replace: true });
            } else if (role === 'user' || role === 'student') {
              navigate('/dashboard', { replace: true });
            } else {
              // For other roles (gatherer, creator, processor, explainer)
              const roleRoutes = {
                gatherer: '/gatherer',
                creator: '/creator',
                processor: '/processor',
                explainer: '/explainer',
              };
              navigate(roleRoutes[role] || '/dashboard', { replace: true });
            }
          } else {
            showErrorToast('Failed to fetch user data', { 
              title: 'Authentication Error',
              isAuth: true 
            });
            navigate('/login', { replace: true });
          }
        })
        .catch(() => {
          showErrorToast('Failed to authenticate', { 
            title: 'Authentication Error',
            isAuth: true 
          });
          navigate('/login', { replace: true });
        });
    } else {
      // No token provided
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cinnebar-red mx-auto mb-4"></div>
        <p className="text-oxford-blue font-roboto text-lg">
          Authenticating...
        </p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;

