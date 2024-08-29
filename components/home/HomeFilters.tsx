"use client";

import { HomePageFilters } from "@/constants/filters";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

const HomeFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.getAll("filter");

  const [activeFilter, setActiveFilter] = useState(query || []);

  const handleClick = (item: string) => {
    if (activeFilter.includes(item)) {
      setActiveFilter((prev) => prev.filter((query) => query !== item));
    } else {
      setActiveFilter((prev) => [...prev, item]);
    }
  };

  useEffect(() => {
    if (activeFilter) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: activeFilter,
      });
      router.push(newUrl, { scroll: false });
    } else {
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keys: ["filter"],
      });
      router.push(newUrl, { scroll: false });
    }
  }, [activeFilter, searchParams, router]);

  return (
    <div className="mt-10 hidden flex-wrap gap-4 md:flex">
      {HomePageFilters.map((item) => {
        return (
          <Button
            key={item.value}
            className={`body-medium  min-h-[42px] rounded-lg px-6 py-3 shadow-none ${activeFilter.includes(item.value) ? "bg-primary-100 text-primary-500 dark:bg-dark-400" : "background-light800_dark300 text-light400_light500"}`}
            onClick={() => handleClick(item.value)}
          >
            {item.name}
          </Button>
        );
      })}
    </div>
  );
};

export default HomeFilters;
