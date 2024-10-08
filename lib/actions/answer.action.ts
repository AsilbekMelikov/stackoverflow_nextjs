"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";
import Interaction from "@/database/interaction.model";

export const createAnswers = async (params: CreateAnswerParams) => {
  try {
    connectToDatabase();

    const { author, question, content, path } = params;

    const newAnswer = await Answer.create({ author, question, content });

    const questionObject = await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO: Add interaction...
    await Interaction.create({
      user: author,
      action: "answer",
      question,
      answer: newAnswer._id,
      tags: questionObject.tags,
    });

    // Increment author's reputation by +10/-10 for creating an answer
    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllAnswers = async (params: GetAnswersParams) => {
  try {
    connectToDatabase();

    const { questionId, filter, page = 1, pageSize = 5 } = params;

    let sortOptions = {};
    const switchCaseFn = (item: string) => {
      switch (item) {
        case "highestUpvotes":
          sortOptions = { ...sortOptions, upvotes: -1 };
          break;
        case "lowestUpvotes":
          sortOptions = { ...sortOptions, downvotes: -1 };
          break;
        case "recent":
          sortOptions = { ...sortOptions, createdAt: -1 };
          break;
        case "old":
          sortOptions = { ...sortOptions, createdAt: 1 };
          break;
        default:
          break;
      }
    };

    if (typeof filter === "string") {
      switchCaseFn(filter);
    }

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture", User)
      .sort(sortOptions)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const unsortedTotalAnswers = await Answer.countDocuments({
      question: questionId,
    });

    return { answers, unsortedTotalAnswers };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const upvoteAnswer = async (params: AnswerVoteParams) => {
  try {
    connectToDatabase();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { upvotes: userId },
      };
    }

    const updatedAnswer = await Answer.findByIdAndUpdate(
      answerId,
      updateQuery,
      { new: true }
    );

    if (!updatedAnswer) {
      throw new Error("Answer not found");
    }

    // TODO, add the author's reputation
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -2 : 2 },
    });

    await User.findByIdAndUpdate(updatedAnswer.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
};

export const downvoteAnswer = async (params: AnswerVoteParams) => {
  try {
    connectToDatabase();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { downvotes: userId },
      };
    }

    const updatedAnswer = await Answer.findByIdAndUpdate(
      answerId,
      updateQuery,
      { new: true }
    );

    if (!updatedAnswer) {
      throw new Error("Answer not found");
    }

    // TODO, add the author's reputation
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? -2 : 2 },
    });

    await User.findByIdAndUpdate(updatedAnswer.author, {
      $inc: { reputation: hasdownVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
};

export const deleteAnswer = async (params: DeleteAnswerParams) => {
  try {
    connectToDatabase();

    const { answerId, path } = params;

    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found");
    }

    await Answer.deleteOne({ _id: answerId });
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } }
    );
    await Interaction.deleteMany({ answer: answerId });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
