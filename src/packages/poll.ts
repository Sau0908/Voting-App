import { prisma } from "../lib/prisma";
import { ValidationError } from "../lib/error";

type CreatePollParams = {
  question: string;
  isPublished?: boolean;
  options: string[];
  creatorId: string;
};

export const createPoll = async (body: CreatePollParams) => {
  const { question, isPublished = false, options, creatorId } = body;

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: creatorId },
    });
    if (!userExists) {
      throw new ValidationError(
        "Poll",
        "InvalidCreator",
        "Creator user does not exist"
      );
    }

    const poll = await prisma.poll.create({
      data: {
        question,
        isPublished,
        creatorId,
        options: {
          create: options.map((text) => ({ text })),
        },
      },
      include: { options: true },
    });

    return poll;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new ValidationError("Poll", error.name, error.message);
    }
    throw new ValidationError(
      "Poll",
      "UnknownError",
      "An unknown error occurred."
    );
  }
};

export const getPollById = async (id: string) => {
  try {
    const poll = await prisma.poll.findUnique({
      where: { id },
      include: { options: { include: { votes: true } } },
    });

    if (!poll) {
      throw new ValidationError("Poll", "NotFound", "Poll not found");
    }

    const result = {
      ...poll,
      options: poll.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        votesCount: opt.votes.length,
      })),
    };

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new ValidationError("Poll", error.name, error.message);
    }
    throw new ValidationError(
      "Poll",
      "UnknownError",
      "An unknown error occurred."
    );
  }
};
