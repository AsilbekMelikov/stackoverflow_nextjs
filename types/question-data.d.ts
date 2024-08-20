import { Answers, Tags, UserData } from ".";

export interface QuestionData {
  _id: string;
  title: string;
  content: string;
  tags: Tags[];
  views: number;
  upvotes: string[];
  downvotes: string[];
  author: UserData;
  answers: Answers[];
  createdAt: Date;
}
