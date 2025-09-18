import { AnyZodObject, z } from "zod";
import { NextFunction, Request, Response } from "express";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  ZodValidationError,
} from "./error";

export function apiHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = await fn(req, res, next);
      if (data) {
        switch (req.method) {
          case "POST":
            res.status(201).send({
              data: data,
            });
            break;
          default:
            res.status(200).send({
              data: data,
            });
            break;
        }
      } else {
        switch (req.method) {
          case "POST":
            res.status(201).send();
            break;
          case "GET":
            console.log("404 error in API Route: ", req.originalUrl);
            res.status(404).send("Resource doesnt exist");
            break;
          case "PUT":
            res.status(204).send();
            break;
          case "DELETE":
            res.status(204).send();
            break;
          default:
            res.status(200).send();
        }
      }
    } catch (err: any) {
      if (err instanceof ValidationError) {
        console.log("400 error in API Route: ", req.originalUrl, err.format());
        res.status(400).json(err.format());
      } else if (err instanceof ZodValidationError) {
        console.log("400 error in API Route: ", req.originalUrl, err.format());
        res.status(400).json(err.format());
      } else if (err instanceof UnauthorizedError) {
        console.log("401 error in API Route: ", req.originalUrl, err.format());
        res.status(401).json(err.format());
      } else if (err instanceof NotFoundError) {
        console.log("404 error in API Route: ", req.originalUrl, err.format());
        res.status(404).json(err.format());
      } else {
        console.log(
          "Error in API Route: ",
          req.originalUrl,
          err,
          req.body,
          req.params
        );
        res.status(500).send({
          message: `Internal server error: ${err.message}`,
        });
      }
    }
  };
}

export async function zParse<T extends AnyZodObject>(
  schema: T,
  req: Request
): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(req);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ZodValidationError(error);
    }
    throw error;
  }
}
