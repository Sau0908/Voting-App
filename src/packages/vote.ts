import { io } from "..";
import { ValidationError } from "../lib/error";
import { prisma } from "../lib/prisma";

interface CreateVoteParams {
  userId: string;
  pollOptionId: string;
}

export const createVote = async (body: CreateVoteParams) => {
  const { userId, pollOptionId } = body;

  try {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      throw new ValidationError("Vote", "InvalidUser", "User does not exist");
    }

    const optionExists = await prisma.pollOption.findUnique({
      where: { id: pollOptionId },
      include: { poll: true },
    });
    if (!optionExists) {
      throw new ValidationError(
        "Vote",
        "InvalidOption",
        "Poll option does not exist"
      );
    }

    const alreadyVoted = await prisma.vote.findFirst({
      where: {
        userId,
        pollOption: { pollId: optionExists.pollId },
      },
    });
    if (alreadyVoted) {
      throw new ValidationError(
        "Vote",
        "DuplicateVote",
        "User already voted in this poll"
      );
    }

    const vote = await prisma.vote.create({
      data: { userId, pollOptionId },
    });

    const updatedPoll = await prisma.poll.findUnique({
      where: { id: optionExists.pollId },
      include: {
        options: {
          include: { votes: true },
        },
      },
    });

    if (!updatedPoll) {
      throw new ValidationError("Vote", "PollNotFound", "Poll not found");
    }

    const formattedResults = {
      id: updatedPoll.id,
      question: updatedPoll.question,
      optionsPollUpdates: updatedPoll.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        votes: opt.votes.length,
      })),
      totalVotesCast: updatedPoll.options.reduce(
        (sum, opt) => sum + opt.votes.length,
        0
      ),
    };

    io.to(updatedPoll.id).emit("pollUpdated", formattedResults);

    return { vote, results: formattedResults };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new ValidationError("Vote", error.name, error.message);
    }
    throw new ValidationError(
      "Vote",
      "UnknownError",
      "An unknown error occurred."
    );
  }
};
