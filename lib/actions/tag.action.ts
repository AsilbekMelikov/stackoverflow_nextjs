"use server";

import Tag, { ITag } from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import User from "@/database/user.model";
import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 5 } = params;

    let sortOptions = {};
    const switchCaseFn = (item: string) => {
      switch (item) {
        case "popular":
          sortOptions = { ...sortOptions, questions: -1 };
          break;
        case "recent":
          sortOptions = { ...sortOptions, createdOn: -1 };
          break;
        case "name":
          sortOptions = { ...sortOptions, name: 1 };
          break;
        case "old":
          sortOptions = { ...sortOptions, createdOn: 1 };
          break;
        default:
          break;
      }
    };

    if (typeof filter === "string") {
      switchCaseFn(filter);
    }

    const query: FilterQuery<typeof Tag> = searchQuery
      ? {
          name: { $regex: new RegExp(searchQuery, "i") },
        }
      : {};

    const tags = await Tag.find(query)
      .sort(sortOptions)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const totalTags = await Tag.countDocuments(query);

    return { tags, totalTags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const { userId, limit = 3 } = params;

    const user = User.findById(userId);

    if (!user) throw new Error("User not found");

    // We have to find interactions for the user and group by tags...
    // Interaction...

    const topTags = Tag.find({}).limit(limit);

    return topTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();

    const { tagId, searchQuery, page = 1, pageSize = 5 } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: query,
      options: {
        sort: { createdAt: -1 },
        skip: (page - 1) * pageSize,
        limit: pageSize,
      },
      populate: [
        {
          path: "author",
          model: User,
          select: "_id clerkId name picture",
        },
        {
          path: "tags",
          model: Tag,
          select: "_id name",
        },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }
    const questions = tag.questions;

    const allTagQuestions = await Tag.findOne(tagFilter).populate({
      path: "questions",
      match: query,
    });

    return {
      questions,
      tagName: tag.name,
      totalTagQuestions: allTagQuestions.questions.length,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getPopularTags() {
  try {
    connectToDatabase();

    const popularTags = await Tag.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          totalQuestions: { $size: "$questions" },
        },
      },
      {
        $sort: { totalQuestions: -1 },
      },
      { $limit: 8 },
    ]);
    return popularTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
