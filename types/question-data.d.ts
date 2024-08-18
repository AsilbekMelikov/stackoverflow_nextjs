import { Tags, UserData } from ".";

export interface QuestionData {
  _id: string;
  title: string;
  content: string;
  tags: Tags[];
  views: number;
  upvotes: string[];
  downvotes: string[];
  author: UserData;
  answers: string[];
  createdAt: Date;
}
