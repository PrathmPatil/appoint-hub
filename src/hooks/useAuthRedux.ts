import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  loginUser,
  registerUser,
  logout,
  clearError,
  loadUserFromStorage,
} from "@/store/slices/authSlice";
import type { UserRole } from "@/store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );

  // Load user from localStorage on app start
  useEffect(() => {
    if (!user && !isAuthenticated) {
      dispatch(loadUserFromStorage());
    }
  }, [dispatch, user, isAuthenticated]);

  const login = async (email: string, password: string) => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
  ) => {
    try {
      await dispatch(registerUser({ email, password, name, role })).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout: handleLogout,
    clearError: clearAuthError,
  };
};
