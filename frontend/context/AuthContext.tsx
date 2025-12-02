"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import { useRouter } from "next/navigation"
import * as jwtDecodeModule from "jwt-decode";
import { User } from "@/types/user"
import { getUserFromStorage, getTokenFromStorage, saveUserAndTokenToStorage, clearUserAndTokenFromStorage } from "@/lib/auth-storage"
import api from "@/lib/api"
import { TokenPayload } from "@/types/auth"

const jwt_decode = jwtDecodeModule.jwtDecode;

// initialize logout function with type (function returning nothing) | null and initial value null
let logoutFn: (() => void) | null = null;

// set logout handler
export const setLogoutHandler = (fn: () => void) => {
  // assign function from params to our variable
  logoutFn = fn;
}

// set trigger
export const triggerLogout = () => {
  if (logoutFn) logoutFn();
}

type AuthContextType = {
  token: string | null
  role: TokenPayload["role"] | null
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  user: null,
  login: async () => { },
  register: async () => { },
  logout: () => { },
  loading: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<TokenPayload["role"] | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const clearStorageAndState = () => {
    clearUserAndTokenFromStorage();
    setUser(null);
    setToken(null);
    setRole(null);
    setLoading(false);
  }
  const logout = useCallback(() => {
    clearStorageAndState();
    // redirect to login
    router.push("/auth/login")
  }, [router])

  useEffect(() => {
    // set logout handler
    setLogoutHandler(logout);

    // retrieve user from localstorage
    const storedUser = getUserFromStorage()
    if (storedUser) setUser(storedUser)

    // retrieve acces token from localstorage
    const storedToken = getTokenFromStorage()

    if (storedToken) {
      try {
        const decoded: TokenPayload = jwt_decode<TokenPayload>(storedToken);
        const now = Date.now() / 1000;

        // If token is expired remove everything
        if (decoded.exp && decoded.exp < now) {
          clearStorageAndState();
        } else {
          // set roles and token from access token payload
          setToken(storedToken);
          setRole(decoded.role);
        }
      } catch (err) {
        console.log("Error decoding access token: ", err);
        clearUserAndTokenFromStorage();
      }
    }
    setLoading(false)
  }, [logout])

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post("/users/login", { email, password })
      // extract user and token from login response
      const { user, token } = res.data;
      // save user and token to localstorage
      saveUserAndTokenToStorage(user, token);

      // update state of user and token
      setUser(user)
      setToken(token);

      // extract role from jwt
      const decoded = jwt_decode<TokenPayload>(token);
      setRole(decoded.role);
      router.push("/dashboard")
    } catch (err) {
      console.error("Login failed", err)
      throw err
    } finally {
      setLoading(false);
    }
  }

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post("/users/register", { firstName, lastName, email, password })
      if (res.status == 201) {
        // for a successful register -> automatically login thereafter using registering data
        login(email, password);
      }
    } catch (err) {
      console.error("Register failed", err)
      throw err
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ token, role, user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
