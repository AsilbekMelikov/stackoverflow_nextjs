"use server";

import { Error, FilterQuery } from "mongoose";
import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";

export async function getUserById(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });
    revalidatePath(path);
  } catch (error) {}
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const user = await User.findOneAndDelete(
      { clerkId: params.clerkId },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    // Delete user from database
    // and questions, answers, comments, etc.

    // get user question ids
    // const userQuestionIds = await Question.find({ author: user._id }).distinct(
    //   "_id"
    // );

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: delete user answers, comments, etc.

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();

    const { filter, searchQuery, page = 1, pageSize = 5 } = params;

    const query: FilterQuery<typeof User> = {};

    let sortOptions = {};
    const switchCaseFn = (item: string) => {
      switch (item) {
        case "new_users":
          sortOptions = { ...sortOptions, joinedAt: -1 };
          break;
        case "old_users":
          sortOptions = { ...sortOptions, joinedAt: 1 };
          break;
        case "top_contributors":
          sortOptions = { ...sortOptions, reputation: -1 };
          break;
        default:
          break;
      }
    };

    if (typeof filter === "string") {
      switchCaseFn(filter);
    }

    if (searchQuery) {
      query.$or = [
        {
          name: { $regex: new RegExp(searchQuery, "i") },
        },
        {
          username: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }

    const users = await User.find(query)
      .sort(sortOptions)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const totalUsers = await User.countDocuments(query);

    return { users, totalUsers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function saveUserQuestions(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Updated user not found");
    }

    const isQuestionSaved = user.saved.includes(questionId);
    let updateQuery = {};
    if (isQuestionSaved) {
      updateQuery = { $pull: { saved: questionId } };
    } else {
      updateQuery = { $addToSet: { saved: questionId } };
    }

    await User.findByIdAndUpdate(userId, updateQuery, { new: true });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();

    const { clerkId, searchQuery, filter, page = 1, pageSize = 5 } = params;

    let sortOptions = {};
    const switchCaseFn = (item: string) => {
      switch (item) {
        case "most_recent":
          sortOptions = { ...sortOptions, createdAt: -1 };
          break;
        case "oldest":
          sortOptions = { ...sortOptions, createdAt: 1 };
          break;
        case "most_voted":
          sortOptions = { ...sortOptions, upvotes: -1 };
          break;
        case "most_viewed":
          sortOptions = { ...sortOptions, views: -1 };
          break;
        case "most_answered":
          sortOptions = { ...sortOptions, answers: -1 };
          break;
        default:
          break;
      }
    };

    if (typeof filter === "string") {
      switchCaseFn(filter);
    }

    const query: FilterQuery<typeof Question> = searchQuery
      ? [
          { title: { $regex: new RegExp(searchQuery, "i") } },
          { content: { $regex: new RegExp(searchQuery, "i") } },
        ]
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOptions,
        skip: (page - 1) * pageSize,
        limit: pageSize,
      },
      populate: [
        {
          path: "tags",
          model: Tag,
          select: "_id name",
        },
        {
          path: "author",
          model: User,
          select: "_id clerkId name picture",
        },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }
    const savedQuestions = user.saved;

    const totalSavedQuestions = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
    });

    return {
      questions: savedQuestions,
      totalQuestions: totalSavedQuestions.saved.length,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });

    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return { user, totalQuestions, totalAnswers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserTopQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 5 } = params;

    const totalQuestions = await Question.countDocuments({
      author: userId,
    });

    const userQuestions = await Question.aggregate([
      { $match: { author: userId } }, // Filter by author
      {
        $project: {
          _id: 1,
          title: 1,
          views: 1,
          upvotes: 1,
          answers: 1,
          tags: 1,
          author: 1,
          createdAt: 1,
          answersCount: { $size: "$answers" }, // Add a field to store the length of the answers array
        },
      },
      { $sort: { views: -1, upvotes: -1, answersCount: -1 } }, // Sort by views, upvotes, and answersCount
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
    ]).exec();

    await Question.populate(userQuestions, [
      { path: "tags", select: "_id name" },
      { path: "author", select: "_id clerkId name picture" },
    ]);

    return { totalQuestions, questions: userQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 5 } = params;

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate("question", "_id title")
      .populate("author", "_id clerkId name picture");

    return { totalAnswers, answers: userAnswers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
