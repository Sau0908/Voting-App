import { object, string } from "zod";

export const createVoteSchema = object({
  body: object({
    userId: string().min(1, "UserId is required"),
    pollOptionId: string().min(1, "PollOptionId is required"),
  }).strict(),
});
