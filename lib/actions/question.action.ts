"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { FilterQuery } from "mongoose";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const { filter, searchQuery, page = 1, pageSize = 5 } = params;

    const query: FilterQuery<typeof Question> = {};

    let sortOptions = {};

    const switchCaseFn = (item: string) => {
      switch (item) {
        case "newest":
          sortOptions = { ...sortOptions, createdAt: -1 };
          break;
        case "frequent":
          sortOptions = { ...sortOptions, views: -1 };
          break;
        case "unanswered":
          query.answers = { $size: 0 };
          break;
        default:
          break;
      }
    };

    if (typeof filter === "string") {
      switchCaseFn(filter);
    } else {
      filter?.forEach((item) => {
        switchCaseFn(item);
      });
    }

    if (searchQuery === "?") {
      throw new Error("Invalid search");
    }

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort(sortOptions)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const totalQuestions = await Question.countDocuments(query);

    return { questions, totalQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase();

    const { title, content, tags, author, path } = params;

    const question = await Question.create({ title, content, author });

    const tagDocuments = [];

    // Create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTags = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTags._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // Create an interaction record for the user's ask_question action
    await Interaction.create({
      user: author,
      action: "ask_question",
      question: question._id,
      tags: tagDocuments,
    });

    // Increment author's reputation by +5 for creating a question
    await User.findByIdAndUpdate({ _id: author }, { $inc: { reputation: 5 } });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();
    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // Increment author's reputation by +1 /-1 for upvoting/invoking an upvote to the question
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -1 : 1 },
    });

    // Increment author's reputation by +10/-10 for receiving an upvote/downvote to the question
    // if (question.author.toString() !== userId) { // For now, i closed if statement because of low reputation initially
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });
    // }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // Decrement author's reputation
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? -1 : 1 },
    });

    // Decrement author's reputation by +10/-10 for receiving an upvote/downvote to the question
    // if (question.author.toString() !== userId) { // For now, i closed if statement because of low reputation initially
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasdownVoted ? -10 : 10 },
    });
    // }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, path } = params;

    await Question.findByIdAndDelete(questionId);
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    const tagsToUpdate = await Tag.find({ questions: questionId });

    for (const tag of tagsToUpdate) {
      // Update tag questions if questions' length is greater than 1
      if (tag.questions.length > 1) {
        await Tag.updateOne(
          { _id: tag._id },
          { $pull: { questions: questionId } }
        );
        // Delete the tag if questions' length is equal to 1.
      } else {
        await Tag.deleteOne({ _id: tag._id });
      }
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase();

    const { title, content, oldTags, newTags, questionId, path } = params;

    await Question.findByIdAndUpdate(questionId, {
      title,
      content,
    });

    // removed tags from the question after editing
    const removedTags = oldTags
      .filter((tag) => !newTags.includes(tag.name))
      .map((tag) => tag._id);

    // added tags to the question after editing
    const addedTags = newTags.filter((item) => {
      for (const tag of oldTags) {
        if (tag.name === item) {
          return false;
        }
      }
      return true;
    });

    if (removedTags.length > 0) {
      for (const removedTag of removedTags) {
        await Question.findByIdAndUpdate(questionId, {
          $pull: { tags: removedTag },
        });

        const tag = await Tag.findById(removedTag);
        if (tag.questions.length > 1) {
          await Tag.findByIdAndUpdate(removedTag, {
            $pull: { questions: questionId },
          });
        } else {
          await Tag.deleteOne({ _id: removedTag });
        }
      }
    }

    if (addedTags.length > 0) {
      const tagDocuments = [];
      for (const tag of addedTags) {
        const existingTag = await Tag.findOneAndUpdate(
          {
            name: { $regex: new RegExp(`^${tag}$`, "i") },
          },
          { $setOnInsert: { name: tag }, $addToSet: { questions: questionId } },
          { upsert: true, new: true }
        );
        tagDocuments.push(existingTag._id);
      }
      await Question.findByIdAndUpdate(questionId, {
        $push: { tags: { $each: tagDocuments } },
      });
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getHotQuestions() {
  try {
    connectToDatabase();

    const topInteractedQuestions = await Question.aggregate([
      {
        $project: {
          _id: 1,
          title: 1,
          views: 1,
          upvotes: 1,
          answersCount: { $size: "$answers" },
        },
      },
      { $sort: { views: -1, upvotes: -1, answersCount: -1 } },
      { $limit: 5 },
    ]);

    return topInteractedQuestions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
