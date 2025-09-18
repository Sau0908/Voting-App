import { Response } from "express";
import { CustomError } from "ts-custom-error";
import { z } from "zod";

export function handleErrors(error: any, res: Response) {
  if (error instanceof ZodValidationError) {
    return res.status(400).json(error.format());
  }

  if (error instanceof ValidationError) {
    const err = error.format();
    return res.status(400).json(err);
  }

  return res.status(500).json({ message: "Internal server error." });
}

export class UnauthorizedError extends CustomError {
  message: string;
  public constructor(message: string) {
    super(message);
    this.message = message;
  }
  public format() {
    return {
      message: this.message,
    };
  }
}

export class ValidationError extends CustomError {
  object: string;
  field: string;
  data: any;

  public constructor(
    object: string,
    field: string,
    message: string,
    data?: any
  ) {
    super(message);
    this.object = object;
    this.field = field;
    this.data = data;
  }

  public format() {
    return {
      object: this.object,
      field: this.field,
      message: this.message,
      data: this.data,
    };
  }
}

export class ZodValidationError extends CustomError {
  errors: Array<{ path: string; message: string }>;

  constructor(zodErrors: z.ZodError) {
    super("Validation failed");
    this.errors = zodErrors.errors.map((error) => ({
      path: error.path.join("."),
      message: error.message,
    }));
  }

  public format() {
    return {
      message: this.message,
      errors: this.errors,
    };
  }
}

export class NotFoundError extends CustomError {
  public constructor(message: string) {
    super(message);
    this.message = message;
  }

  public format() {
    return {
      message: this.message,
    };
  }
}
