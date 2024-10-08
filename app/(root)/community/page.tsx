import UserCard from "@/components/card/UserCard";
import Filters from "@/components/shared/Filters";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";
import React from "react";

const Community = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllUsers({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
    pageSize: searchParams.page_size ? +searchParams.page_size : 5,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-11 flex gap-7 max-md:flex-col">
        <LocalSearchBar
          route="/community"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search by username..."
          iconPosition="left"
        />
        <Filters
          containerClasses=""
          filters={UserFilters}
          otherClasses="min-h-[56px] min-w-[207px]"
        />
      </div>

      {result.users.length > 0 ? (
        <div className="mt-12 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
          {result?.users?.map((user) => {
            return (
              <UserCard
                key={user._id}
                _id={user._id}
                clerkId={user.clerkId}
                imgUrl={user.picture}
                name={user.name}
                username={user.username}
              />
            );
          })}
        </div>
      ) : (
        <div className="paragraph-regular text-dark200_light800 mx-auto mt-12 max-w-4xl text-center">
          <p>No users yet</p>
          <Link href={"/sign-up"} className="mt-2 font-bold text-accent-blue">
            Join to be the first!
          </Link>
        </div>
      )}

      <Pagination totalData={result.totalUsers} />
    </>
  );
};

export default Community;
