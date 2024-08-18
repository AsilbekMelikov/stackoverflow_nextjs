import Answer from "@/components/forms/Answer";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import { getQuestionById } from "@/lib/actions/question.action";
import { formatNumber, getTimesStamp } from "@/lib/utils";
import { QuestionData } from "@/types/question-data";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  id: string;
}

const QuestionDetail = async ({ params }: { params: Props }) => {
  const result: QuestionData = await getQuestionById({ questionId: params.id });

  return (
    <div className="flex w-full flex-col items-start justify-center">
      <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <Link
          href={`/profile/${result.author.clerkId}`}
          className="flex items-center justify-start gap-1"
        >
          <Image
            src={result.author.picture}
            alt="profile"
            width={22}
            height={22}
            className="rounded-full"
          />
          <p className="paragraph-semibold text-dark300_light700">
            {result.author.name}
          </p>
        </Link>

        <div className="paragraph-semibold text-dark300_light700 flex justify-end">
          VOTING
        </div>
      </div>

      <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
        {result.title}
      </h2>

      <div className="mb-8 mt-5 flex w-full flex-wrap gap-4">
        <Metric
          imgUrl={"/assets/icons/clock.svg"}
          alt="time"
          value={""}
          title={`Asked ${getTimesStamp(result.createdAt)}`}
          textStyles="body-medium text-dark400_light700"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="answers"
          value={formatNumber(result.answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="views"
          value={formatNumber(result.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={result.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {result.tags.map((tag) => {
          return (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              showCount={false}
            />
          );
        })}
      </div>

      <Answer />
    </div>
  );
};

export default QuestionDetail;
