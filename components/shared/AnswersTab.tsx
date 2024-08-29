import { getUserAnswers } from "@/lib/actions/user.action";
import { Answers, SearchParamsProps } from "@/types";
import React from "react";
import AnswerCard from "../card/AnswerCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId: string | null;
}

interface IAnswers {
  totalAnswers: number;
  answers: Answers[];
}

const AnswersTab = async ({ userId, clerkId, searchParams }: Props) => {
  const result: IAnswers = await getUserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
    pageSize: searchParams.page_size ? +searchParams.page_size : 5,
  });

  return (
    <>
      <div className="mt-10 flex flex-col gap-6">
        {result.answers.map((answer) => (
          <AnswerCard
            key={answer._id}
            question={answer.question}
            _id={answer._id}
            clerkId={clerkId}
            author={answer.author}
            upvotes={answer.upvotes.length}
            createdAt={answer.createdAt}
          />
        ))}
      </div>
      <Pagination totalData={result.totalAnswers} />
    </>
  );
};

export default AnswersTab;
