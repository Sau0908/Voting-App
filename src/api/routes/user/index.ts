import express, { Request, Router } from "express";
import { createUserSchema, getUserByIdSchema } from "./validation";
import { apiHandler, zParse } from "../../../lib/apiHandler";
import { createUser, getUserById } from "../../../packages/user";

export const userRouter: Router = express.Router();

userRouter.post(
  "/",
  apiHandler(async (req: Request) => {
    const { body } = await zParse(createUserSchema, req);
    return await createUser(body);
  })
);

userRouter.get(
  "/:id",
  apiHandler(async (req: Request) => {
    const { params } = await zParse(getUserByIdSchema, req);
    return await getUserById(params.id);
  })
);
