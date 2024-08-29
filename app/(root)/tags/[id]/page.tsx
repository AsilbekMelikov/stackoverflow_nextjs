import QuestionCard from "@/components/card/QuestionCard";

import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { getQuestionsByTagId } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";
import { QuestionData } from "@/types/question-data";
import React from "react";

interface TagQuestions {
  questions: QuestionData[];
  tagName: string;
  totalTagQuestions: number;
}

const TagDetail = async ({ params, searchParams }: URLProps) => {
  const result: TagQuestions = await getQuestionsByTagId({
    tagId: params.id,
    searchQuery: searchParams.q,
    page: searchParams.page ? +searchParams.page : 1,
    pageSize: searchParams.page_size ? +searchParams.page_size : 5,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 capitalize">
        {result.tagName}
      </h1>

      <div className="mt-11 w-full">
        <LocalSearchBar
          route={`/tags/${params.id}`}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search tag questions..."
          otherClasses="flex-1"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes.length}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title={"There’s no tag question to show"}
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
            discussion. our query could be the next big thing others learn from. Get
            involved! 💡"
            link={"/ask-question"}
            linkTitle={"Ask a Question"}
          />
        )}
      </div>

      <Pagination totalData={result.totalTagQuestions} />
    </>
  );
};

export default TagDetail;
