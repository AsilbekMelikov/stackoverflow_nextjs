import { BADGE_CRITERIA } from "@/constants";
import { QuestionData } from "./question-data";

export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
}

export interface PaginationData {
  name: string;
  value: string;
}

export interface Job {
  id?: string;
  employer_name?: string;
  employer_logo?: string | undefined;
  employer_website?: string;
  job_employment_type?: string;
  job_title?: string;
  job_description?: string;
  job_apply_link?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
}

export interface Country {
  name: {
    common: string;
  };
}

export interface ParamsProps {
  params: { id: string };
}

export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined };
}

export interface URLProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}

export interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA;

export interface UserData {
  _id: string;
  clerkId: string;
  name: string;
  username: string;
  email?: string;
  picture: string;
  password?: string;
  bio?: string;
  location?: string;
  portfolioWebsite?: string;
  reputation?: number;
  saved?: QuestionData[];
  joinedAt: Date;
}

export interface Tags {
  _id: string;
  createdOn: string;
  followers: UserData[];
  name: string;
  questions: QuestionData[];
}

export interface Answers {
  _id: string;
  author: UserData;
  question: QuestionData;
  content: string;
  upvotes: string[];
  downvotes: string[];
  createdAt: Date;
}
