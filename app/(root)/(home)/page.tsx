import HomeFilters from "@/components/home/HomeFilters";
import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/shared/QuestionCard";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";
import React from "react";

const Home = () => {
  const questions = [
    {
      _id: "1",
      title:
        "The Lightning Component c:LWC_PizzaTracker generated invalid output for field status. Error How to solve this",
      tags: [
        { _id: "1", name: "Javascript" },
        { _id: "2", name: "Sql" },
      ],
      author: {
        _id: "1",
        name: "John Doe",
        picture: "John-doe.png",
      },
      upvotes: 123432,
      views: 12332,
      answers: [],
      createdAt: new Date(2024, 7, 1),
    },
    {
      _id: "2",
      title:
        "The Lightning Component c:LWC_PizzaTracker generated invalid output for field status. Error How to solve this",
      tags: [
        { _id: "1", name: "Vue" },
        { _id: "2", name: "Python" },
      ],
      author: {
        _id: "1",
        name: "John Salay",
        picture: "John-salay.png",
      },
      upvotes: 24234231434,
      views: 1000000,
      answers: [],
      createdAt: new Date(2022, 7, 4),
    },
  ];

  return (
    <>
      <div className="flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All questions</h1>
        <Link href={"/ask-question"} className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient paragraph-medium min-h-[46px] rounded-lg px-4 py-3 text-light-900 max-sm:w-full">
            Ask a question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
        <Filters
          filters={HomePageFilters}
          otherClasses={"min-h-[56px] sm:min-w-[170px]"}
          containerClasses={"hidden max-md:flex"}
        />
      </div>
      <HomeFilters />
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title={"There’s no question to show"}
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discussion. our query could be the next big thing others learn from. Get
        involved! 💡"
            link={"/ask-question"}
            linkTitle={"Ask a Question"}
          />
        )}
      </div>
    </>
  );
};

export default Home;
