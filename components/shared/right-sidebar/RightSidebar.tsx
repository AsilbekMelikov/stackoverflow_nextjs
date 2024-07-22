import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "../RenderTag";

const RightSidebar = () => {
  const hotQuestions = [
    {
      id: 1,
      title:
        "Would it be appropriate to point out an error in another paper during a referee report?",
    },
    { id: 2, title: "How can an airconditioning machine exist?" },
    { id: 3, title: "Interrogated every time crossing UK Border as citizen" },
    { id: 4, title: "Low digit addition generator" },
    {
      id: 5,
      title: "What is an example of 3 numbers that do not make up a vector?",
    },
  ];

  const popularTags = [
    {
      id: 1,
      name: "Javascript",
      totalQuestions: 5,
    },
    {
      id: 2,
      name: "Vue",
      totalQuestions: 10,
    },
    {
      id: 3,
      name: "React",
      totalQuestions: 8,
    },
    {
      id: 4,
      name: "Python",
      totalQuestions: 3,
    },
    {
      id: 5,
      name: "Java",
      totalQuestions: 7,
    },
  ];

  return (
    <section className="light-border background-light900_dark200 custom-scrollbar sticky right-0 top-0 flex h-screen w-[330px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div className="mb-[60px]">
        <h3 className="h3-bold text-dark200_light900">Hot network</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((question) => {
            return (
              <Link
                key={question.id}
                href={`/questions/${question.id}`}
                className="flex items-center justify-between gap-7"
              >
                <p className="text-dark200_light900 body-medium">
                  {question.title}
                </p>
                <Image
                  src={"/assets/icons/chevron-right.svg"}
                  alt="chevron right"
                  width={20}
                  height={20}
                  className="invert-colors"
                />
              </Link>
            );
          })}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => {
            return (
              <RenderTag
                key={tag.id}
                _id={tag.id}
                name={tag.name}
                totalQuestions={tag.totalQuestions}
                showCount
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
