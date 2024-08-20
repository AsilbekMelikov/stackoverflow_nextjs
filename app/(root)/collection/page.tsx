import QuestionCard from "@/components/card/QuestionCard";
import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { QuestionFilters } from "@/constants/filters";
import { getAllSavedQuestions } from "@/lib/actions/user.action";
import { QuestionData } from "@/types/question-data";
import { auth } from "@clerk/nextjs/server";
import React from "react";

interface SavedQuestions {
  questions: QuestionData[];
}

const Collection = async () => {
  const { userId } = auth();

  if (!userId) {
    return new Error("User not found");
  }

  const result: SavedQuestions = await getAllSavedQuestions({
    clerkId: userId,
  });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
        <Filters
          filters={QuestionFilters}
          otherClasses={"min-h-[56px] sm:min-w-[170px]"}
          containerClasses={"hidden max-md:flex"}
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
            title={"No saved questions found"}
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discussion. our query could be the next big thing others learn from. Get
        involved! 💡"
            link={"/"}
            linkTitle={"Explore Questions"}
          />
        )}
      </div>
    </div>
  );
};

export default Collection;
