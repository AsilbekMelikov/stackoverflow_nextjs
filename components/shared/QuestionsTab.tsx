import { getUserTopQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { QuestionData } from "@/types/question-data";
import React from "react";
import QuestionCard from "../card/QuestionCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId: string | null;
}

interface ITopQuestions {
  totalQuestions: number;
  questions: QuestionData[];
}

const QuestionsTab = async ({ userId, clerkId, searchParams }: Props) => {
  const result: ITopQuestions = await getUserTopQuestions({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
    pageSize: searchParams.page_size ? +searchParams.page_size : 5,
  });

  return (
    <>
      <div className="mt-10 flex flex-col gap-6">
        {result.questions.map((question) => (
          <QuestionCard
            key={question._id}
            _id={question._id}
            clerkId={clerkId}
            title={question.title}
            tags={question.tags}
            author={question.author}
            upvotes={question.upvotes.length}
            views={question.views}
            answers={question.answers}
            createdAt={question.createdAt}
          />
        ))}
      </div>

      <Pagination totalData={result.totalQuestions} />
    </>
  );
};

export default QuestionsTab;
