"use client";

import { Button } from "@/components/ui/button";
import { GlobalSearchFilters } from "@/constants/filters";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const typeParams = searchParams.get("type");

  const [active, setActive] = useState(typeParams || "");

  const handleToggle = (param: string) => {
    if (active === param) {
      setActive("");
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keys: ["type"],
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(param);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: param,
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="flex items-center gap-5 px-5">
      <p className="base-semibold text-dark400_light800">Type:</p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((filter) => {
          return (
            <Button
              key={filter.value}
              className={`small-semibold light-border-2 rounded-[40px] px-5 py-2.5 dark:text-light-900  ${active === filter.value ? "bg-primary-500 text-light-900" : "background-light700_dark300 text-dark-500 dark:hover:text-primary-500"}`}
              onClick={() => handleToggle(filter.value)}
            >
              {filter.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default GlobalFilters;
