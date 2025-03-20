"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing user session
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would validate credentials against a backend
    // This is just a mock implementation
    return new Promise<void>((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        if (email && password.length >= 6) {
          const user = { email, name: email.split("@")[0] };
          setUser(user);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(user));
          resolve();
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 500);
    });
  };

  const signup = async (email: string, password: string, name: string) => {
    // In a real app, this would create a new user in the backend
    // This is just a mock implementation
    return new Promise<void>((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        if (email && password.length >= 6 && name) {
          // Check if user already exists (checking localStorage in this mock implementation)
          const existingUsers = JSON.parse(
            localStorage.getItem("users") || "[]"
          );
          const userExists = existingUsers.some((u: any) => u.email === email);

          if (userExists) {
            reject(new Error("User with this email already exists"));
            return;
          }

          // Create new user
          const newUser = { email, name };

          // Save to "database" (localStorage in this mock)
          existingUsers.push({ email, password, name });
          localStorage.setItem("users", JSON.stringify(existingUsers));

          // Log in the new user
          setUser(newUser);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(newUser));

          resolve();
        } else {
          reject(
            new Error(
              "Invalid information. Please ensure all fields are filled and password is at least 6 characters."
            )
          );
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, signup, logout }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
