import { UserInTransit, CreateUser } from "@/types/user";

export function generateUserInTransit(details: any): UserInTransit {
  const user: UserInTransit = {
    name: details.name,
    username: details.username,
    email: details.email,
    role: details.role,
    access: details.access,
    department: details.department,
    designation: details.designation,
  };

  return user;
}
