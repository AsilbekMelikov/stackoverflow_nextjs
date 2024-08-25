import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "../RenderTag";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getPopularTags } from "@/lib/actions/tag.action";

interface IHotQuestions {
  _id: string;
  title: string;
}

interface IPopularTags {
  _id: string;
  name: string;
  totalQuestions: number;
}

const RightSidebar = async () => {
  const hotQuestions: IHotQuestions[] = await getHotQuestions();
  const popularTags: IPopularTags[] = await getPopularTags();

  return (
    <section className="light-border background-light900_dark200 custom-scrollbar sticky right-0 top-0 flex h-screen w-[330px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div className="mb-[60px]">
        <h3 className="h3-bold text-dark200_light900">Hot network</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((question) => {
            return (
              <Link
                key={question._id}
                href={`/question/${question._id}`}
                className="flex items-center justify-between gap-7"
              >
                <p className="text-dark200_light900 body-medium">
                  {question.title?.at(0)?.toUpperCase() +
                    question.title?.slice(1)}
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
                key={tag._id}
                _id={tag._id}
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
