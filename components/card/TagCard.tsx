import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";

interface ITag {
  _id: string;
  name: string;
  questions: string[];
}

const TagCard = ({ _id, name, questions }: ITag) => {
  return (
    <Link
      href={`/tag/${_id}`}
      className="card-wrapper light-border shadow-light100_darknone rounded-2xl"
    >
      <article className="flex max-w-[260px] flex-col items-start justify-center px-7 py-10">
        <Badge className="background-light800_dark400 paragraph-semibold text-dark300_light900 flex items-center justify-center rounded-[4px] border-light-800 px-5 py-1.5 uppercase dark:border-none">
          {name}
        </Badge>
        <p className="small-regular text-dark500_light700 mt-[18px]">
          JavaScript, often abbreviated as JS, is a programming language that is
          one of the core technologies of the World Wide Web, alongside HTML and
          CSS
        </p>
        <p className="small-medium text-dark400_light500 mt-3.5">
          <span className="primary-text-gradient body-semibold mr-2.5">
            {questions.length}
          </span>
          {questions.length > 1 ? "Questions" : "Question"}
        </p>
      </article>
    </Link>
  );
};

export default TagCard;
