import express, { Router, Request } from "express";
import { apiHandler, zParse } from "../../../lib/apiHandler";
import { createPollSchema, getPollByIdSchema } from "./validation";
import { createPoll, getPollById } from "../../../packages/poll";

export const pollRouter: Router = express.Router();

pollRouter.post(
  "/",
  apiHandler(async (req: Request) => {
    const { body } = await zParse(createPollSchema, req);
    return await createPoll(body);
  })
);

pollRouter.get(
  "/:id",
  apiHandler(async (req: Request) => {
    const { params } = await zParse(getPollByIdSchema, req);
    return await getPollById(params.id);
  })
);
