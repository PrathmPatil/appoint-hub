import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "user" | "service_provider" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  providerType?: "individual" | "business"; // Only for service_provider role
  avatar?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Demo accounts with correct roles
    const demoAccounts = [
      {
        email: "admin@example.com",
        password: "admin123",
        role: "admin" as UserRole,
        providerType: undefined,
      },
      {
        email: "provider@example.com",
        password: "provider123",
        role: "service_provider" as UserRole,
        providerType: "individual" as const,
      },
      {
        email: "business@example.com",
        password: "business123",
        role: "service_provider" as UserRole,
        providerType: "business" as const,
      },
      {
        email: "user@example.com",
        password: "user123",
        role: "user" as UserRole,
        providerType: undefined,
      },
    ];

    // Check for demo accounts first
    const demoAccount = demoAccounts.find(
      (account) => account.email === email && account.password === password,
    );

    let role: UserRole = "user";
    let providerType: "individual" | "business" | undefined;

    if (demoAccount) {
      role = demoAccount.role;
      providerType = demoAccount.providerType;
    } else {
      // Fallback: determine role from email for any other emails
      if (email.includes("admin")) role = "admin";
      else if (email.includes("business")) {
        role = "service_provider";
        providerType = "business";
      } else if (email.includes("provider")) {
        role = "service_provider";
        providerType = "individual";
      }
    }

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email
        .split("@")[0]
        .replace(/[^a-zA-Z]/g, " ")
        .trim(),
      role,
      providerType,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(mockUser));
    localStorage.setItem("isAuthenticated", "true");

    return mockUser;
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({
    email,
    password,
    name,
    role,
  }: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
  }) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("isAuthenticated", "true");

    return newUser;
  },
);

export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUserFromStorage",
  async () => {
    const savedUser = localStorage.getItem("user");
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (savedUser && isAuthenticated === "true") {
      return JSON.parse(savedUser) as User;
    }

    throw new Error("No user found in storage");
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Login failed";
        state.isAuthenticated = false;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Registration failed";
        state.isAuthenticated = false;
      })
      // Load from storage cases
      .addCase(loadUserFromStorage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
