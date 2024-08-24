import { getUserAnswers } from "@/lib/actions/user.action";
import { Answers, SearchParamsProps } from "@/types";
import React from "react";
import AnswerCard from "../card/AnswerCard";

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
    page: 1,
  });

  return (
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
  );
};

export default AnswersTab;
