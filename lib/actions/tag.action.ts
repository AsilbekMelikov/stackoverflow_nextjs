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

    // const { page = 1, pageSize = 10, filter, searchQuery } = params;

    const tags = await Tag.find({}).sort({ createdAt: -1 });

    return { tags };
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

    const { tagId, searchQuery } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
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

    return { questions, tagName: tag.name };
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
