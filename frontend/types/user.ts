// export type UserRole = "admin" | "librarian" | "user" | "guest"

export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
}
