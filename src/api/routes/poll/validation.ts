import { object, string, boolean, array } from "zod";

export const createPollSchema = object({
  body: object({
    question: string().min(1, "Question is required"),
    isPublished: boolean().optional(),
    options: array(string().min(1, "Option text is required")).min(
      1,
      "At least one option is required"
    ),
    creatorId: string().min(1, "CreatorId is required"),
  }).strict(),
});

export const getPollByIdSchema = object({
  params: object({
    id: string().min(1, "Poll ID is required"),
  }).strict(),
});
