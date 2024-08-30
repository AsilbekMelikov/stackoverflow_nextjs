import { formatNumber } from "@/lib/utils";
import { BadgeCounts } from "@/types";
import Image from "next/image";
import React from "react";

interface StatsCardProps {
  imgUrl: string;
  value: number;
  title: string;
}

const StatsCard = ({ imgUrl, value, title }: StatsCardProps) => {
  return (
    <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
      <Image
        src={imgUrl}
        alt={title}
        width={40}
        height={50}
        className="object-contain"
      />
      <div>
        <p className="paragraph-semibold text-dark200_light900">{value}</p>
        <p className="text-dark400_light700 body-medium">{title}</p>
      </div>
    </div>
  );
};

interface Props {
  reputation?: number;
  totalAnswers: number;
  totalQuestions: number;
  badgeCounts: BadgeCounts;
}

const Stats = ({
  totalAnswers,
  totalQuestions,
  badgeCounts,
  reputation,
}: Props) => {
  return (
    <div className="mt-10">
      <h3 className="h3-semibold text-dark200_light900">
        Stats - {reputation}
      </h3>

      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalQuestions)}
            </p>
            <p className="text-dark400_light700 body-medium">Questions</p>
          </div>
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalAnswers)}
            </p>
            <p className="text-dark400_light700 body-medium">Answers</p>
          </div>
        </div>

        <StatsCard
          imgUrl={"/assets/icons/gold-medal.svg"}
          value={badgeCounts.GOLD}
          title={"Gold Badges"}
        />
        <StatsCard
          imgUrl={"/assets/icons/silver-medal.svg"}
          value={badgeCounts.SILVER}
          title={"Silver Badges"}
        />
        <StatsCard
          imgUrl={"/assets/icons/bronze-medal.svg"}
          value={badgeCounts.BRONZE}
          title={"Bronze Badges"}
        />
      </div>
    </div>
  );
};

export default Stats;
