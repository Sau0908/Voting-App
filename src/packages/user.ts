import { ValidationError } from "../lib/error";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

type CreateUserParams = {
  name: string;
  email: string;
  password: string;
};

export const createUser = async (body: CreateUserParams) => {
  const { name, email, password } = body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ValidationError("User", "Conflict", "Email already in use");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, passwordHash },
    });

    return { id: newUser.id, name: newUser.name, email: newUser.email };
  } catch (error) {
    if (error instanceof Error) {
      throw new ValidationError("User", error.name, error.message);
    }
    throw new ValidationError(
      "User",
      "UnknownError",
      "An unknown error occurred."
    );
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new ValidationError("User", "NotFound", "User not found");
    }

    return { id: user.id, name: user.name, email: user.email };
  } catch (error) {
    if (error instanceof Error) {
      throw new ValidationError("User", error.name, error.message);
    }
    throw new ValidationError(
      "User",
      "UnknownError",
      "An unknown error occurred."
    );
  }
};
