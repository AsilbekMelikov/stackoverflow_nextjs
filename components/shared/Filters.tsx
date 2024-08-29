"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

const Filters = ({ filters, otherClasses, containerClasses }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("filter");

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={`relative ${containerClasses}`}>
      <Select
        defaultValue={query || undefined}
        onValueChange={handleUpdateParams}
      >
        <SelectTrigger
          className={`background-light800_dark300 light-border text-dark500_light700 body-regular rounded-[5px] border px-5 py-2.5 ${otherClasses}`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a value" />
          </div>
        </SelectTrigger>
        <SelectContent className="background-light800_dark300 body-regular text-dark500_light700">
          <SelectGroup>
            {filters.map((item) => {
              return (
                <SelectItem key={item.value} value={item.value}>
                  {item.name}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filters;
