import TagCard from "@/components/card/TagCard";
import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import { SearchParamsProps } from "@/types";
import React from "react";

const Tags = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
    pageSize: searchParams.page_size ? +searchParams.page_size : 5,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Tags</h1>

      <div className="mt-11 flex gap-7 max-sm:flex-col">
        <LocalSearchBar
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search by tag name..."
          otherClasses="flex-1"
        />

        <Filters
          filters={TagFilters}
          otherClasses={"min-h-[56px] sm:min-w-[170px]"}
        />
      </div>

      {result.tags.length > 0 ? (
        <div className="mt-12 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
          {result.tags.map((tag) => {
            return (
              <TagCard
                key={tag._id}
                _id={tag._id}
                name={tag.name}
                questions={tag.questions}
              />
            );
          })}
        </div>
      ) : (
        <NoResult
          title="No tags found"
          description="It looks like there are no tags found"
          link="/ask-question"
          linkTitle="Ask a question"
        />
      )}
      <Pagination totalData={result.totalTags} />
    </>
  );
};

export default Tags;
