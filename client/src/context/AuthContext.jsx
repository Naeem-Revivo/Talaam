import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  showErrorToast,
  showLogoutToast,
  showSuccessToast,
} from "../utils/toastConfig";
import "../styles/customToast.css";
import { loginFailed, loginSuccess } from "../assets/svg/toast";

const AuthContext = createContext(null);

const STATIC_CREDENTIALS = {
  admin: {
    email: "admin@talaam.com",
    password: "Admin@123",
    role: "admin",
    name: "Admin",
  },
  user: {
    email: "user@talaam.com",
    password: "User@123",
    role: "user",
    name: "John Smith",
  },
  gatherer: {
    email: "gatherer@talaam.com",
    password: "123",
    role: "gatherer",
    name: "Data Gatherer",
  },
  creator: {
    email: "creator@talaam.com",
    password: "123",
    role: "creator",
    name: "Content Creator",
  },
  processor: {
    email: "processor@talaam.com",
    password: "123",
    role: "processor",
    name: "Data Processor",
  },
  explainer: {
    email: "explainer@talaam.com",
    password: "123",
    role: "explainer",
    name: "Content Explainer",
  },
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("talaam_auth_user");
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("talaam_auth_user");
      }
    }
  }, []);

  // Persist to localStorage when user changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("talaam_auth_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("talaam_auth_user");
    }
  }, [currentUser]);

  const login = (email, password) => {
    const credentials = Object.values(STATIC_CREDENTIALS);
    const matchedUser = credentials.find(
      (cred) =>
        cred.email.toLowerCase() === email.trim().toLowerCase() &&
        cred.password === password
    );

    if (matchedUser) {
      const user = {
        email: matchedUser.email,
        role: matchedUser.role,
        name: matchedUser.name,
      };
      setCurrentUser(user);
      showSuccessToast("You have successfully logged in.", {
        icon: loginSuccess,
      });

      // Navigate after delay to show toast
      setTimeout(() => {
        // Redirect based on role
        switch (matchedUser.role) {
          case "admin":
            navigate("/admin", { replace: true });
            break;
          case "user":
            navigate("/dashboard", { replace: true });
            break;
          case "gatherer":
            navigate("/gatherer", { replace: true });
            break;
          case "creator":
            navigate("/creator", { replace: true });
            break;
          case "processor":
            navigate("/processor", { replace: true });
            break;
          case "explainer":
            navigate("/explainer", { replace: true });
            break;
          default:
            navigate("/", { replace: true });
        }
      }, 1500);
      return { ok: true, role: matchedUser.role };
    }

    showErrorToast("Incorrect email or password.", { icon: loginFailed });
    return { ok: false, message: "Invalid credentials" };
  };

  const logout = () => {
    setCurrentUser(null);
    showLogoutToast("You have been logged out successfully.", {
      icon: loginSuccess,
    });

    // Navigate after delay to show toast
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1500);
  };

  const value = useMemo(
    () => ({
      user: currentUser,
      isAuthenticated: !!currentUser,
      role: currentUser?.role ?? null,
      login,
      logout,
    }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
