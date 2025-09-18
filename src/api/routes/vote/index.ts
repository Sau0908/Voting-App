import { Router, Request } from "express";
import { apiHandler, zParse } from "../../../lib/apiHandler";
import { createVoteSchema } from "./validation";
import { createVote } from "../../../packages/vote";

export const voteRouter = Router();

voteRouter.post(
  "/",
  apiHandler(async (req: Request) => {
    const { body } = await zParse(createVoteSchema, req);
    return await createVote(body);
  })
);
