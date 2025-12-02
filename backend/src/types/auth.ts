export interface AuthPayload {
    _id: string;
    role: "admin" | "librarian" | "user" | "guest";
  }