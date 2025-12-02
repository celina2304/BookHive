export interface TokenPayload {
  id: string;
  role: "admin" | "librarian" | "user" | "guest";
  iat?: number;
  exp?: number;
}