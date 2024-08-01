import { HomePageFilters } from "@/constants/filters";
import React from "react";
import { Button } from "../ui/button";

const HomeFilters = () => {
  const active = "newest";
  return (
    <div className="mt-10 hidden flex-wrap gap-4 md:flex">
      {HomePageFilters.map((item) => {
        return (
          <Button
            key={item.value}
            className={`body-medium  min-h-[42px] rounded-lg px-6 py-3 shadow-none ${active === item.value ? "bg-primary-100 text-primary-500 dark:bg-dark-400" : "background-light800_dark300 text-light400_light500"}`}
          >
            {item.name}
          </Button>
        );
      })}
    </div>
  );
};

export default HomeFilters;
