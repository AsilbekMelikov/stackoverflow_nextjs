import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mb-8 mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-14 flex-1" />
        <div className="hidden md:block">
          <Skeleton className="h-14 w-28" />
        </div>
      </div>
      <Skeleton className="hidden h-14 w-full max-md:block" />

      <div className="mt-12 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <Skeleton key={item} className="h-60 w-full rounded-2xl" />
        ))}
      </div>
    </section>
  );
};

export default Loading;
