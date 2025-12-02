import { User } from "@/types/user"

const USER_KEY = "auth_user"
const TOKEN_KEY = "auth_token"

// Get user object from localStorage
export function getUserFromStorage(): User | null {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

// Get token from localStorage
export function getTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? token : null
}

// Save user and token to localStorage
export function saveUserAndTokenToStorage(user: User, token: string) {
  if (typeof window === "undefined") return null
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  localStorage.setItem(TOKEN_KEY, token)
}

// token to localStorage
export function saveTokenToStorage(token: string) {
  if (typeof window === "undefined") return null
  localStorage.setItem(TOKEN_KEY, token)
}

// Clear user + token from localStorage
export function clearUserAndTokenFromStorage() {
  if (typeof window === "undefined") return null
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(TOKEN_KEY)
}
