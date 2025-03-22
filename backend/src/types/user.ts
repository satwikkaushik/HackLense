export interface CreateUser {
  name: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "teacher" | "user";
  access?: "admin" | "editor" | "viewer";
  department?: string;
  designation?: string;
}
