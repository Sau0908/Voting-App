import { object, string } from "zod";

export const createUserSchema = object({
  body: object({
    name: string().min(1, "Name is required"),
    email: string().email("Invalid email"),
    password: string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  }).strict(),
});

export const getUserByIdSchema = object({
  params: object({
    id: string().uuid("Invalid user ID"),
  }),
});
