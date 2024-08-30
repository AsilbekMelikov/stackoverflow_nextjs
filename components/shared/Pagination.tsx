"use client";

import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createFirstAndLastPages,
  formUrlQuery,
  paginationSelectOptions,
} from "@/lib/utils";

interface Props {
  totalData: number;
}

const Pagination = ({ totalData }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activePageFromSearch = searchParams.get("page");
  const pageSizeFromSearch = searchParams.get("page_size");
  const [pageSize, setPageSize] = useState(pageSizeFromSearch || "5");
  const [activePage, setActivePage] = useState(
    activePageFromSearch ? +activePageFromSearch : 1
  );

  const numberOfPage = Math.ceil(totalData / +pageSize);

  const pageNumberArray = useMemo(
    () => Array.from({ length: numberOfPage }, (_, i) => i + 1),
    [numberOfPage]
  );

  const handleValueChange = (item: string) => {
    const changePageSize = item.slice(0, 1) === "0" ? item.slice(1) : item;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page_size",
      value: changePageSize === "5" ? null : changePageSize,
    });
    router.push(newUrl);
    setPageSize(changePageSize);
  };

  const handleNavigation = (direction: string | number) => {
    const nextPageNumber =
      direction === "next"
        ? activePage + 1
        : direction === "prev"
          ? activePage - 1
          : +direction;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber > 1 ? nextPageNumber.toString() : null,
    });
    router.push(newUrl);
    setActivePage(nextPageNumber);
  };

  if (!totalData) return null;

  return (
    <div className="mt-9 flex items-center justify-center">
      <div className="flex gap-5 max-sm:flex-col-reverse">
        <div className="flex gap-5 max-sm:flex-col">
          <Button
            className="background-light800_dark300 text-dark400_light800 body-medium light-border-2 select-none rounded-lg border px-3 py-3.5 shadow-sm"
            disabled={activePage === 1}
            onClick={() => handleNavigation("prev")}
          >
            Prev
          </Button>

          <div className="flex gap-3">
            {numberOfPage > 5 && (
              <Button
                className={`${activePage === 1 ? "primary-gradient text-light-900" : "background-light800_dark300 text-dark400_light800"} paragraph-medium rounded-lg`}
                onClick={() => setActivePage(1)}
              >
                1
              </Button>
            )}
            {activePage > 3 && numberOfPage > 5 && (
              <Button className="background-light800_dark300 text-dark400_light800 paragraph-medium rounded-lg text-center">
                ...
              </Button>
            )}
            {createFirstAndLastPages(
              pageNumberArray,
              activePage,
              numberOfPage
            ).map((page) => {
              return (
                <Button
                  key={page}
                  className={`${activePage === page ? "primary-gradient text-light-900" : "background-light800_dark300 text-dark400_light800"} paragraph-medium rounded-lg`}
                  onClick={() => handleNavigation(page)}
                >
                  {page}
                </Button>
              );
            })}
            {activePage < numberOfPage - 2 && numberOfPage > 5 && (
              <Button className="background-light800_dark300 text-dark400_light800 paragraph-medium rounded-lg text-center">
                ...
              </Button>
            )}
            {numberOfPage > 5 && (
              <Button
                className={`${activePage === numberOfPage ? "primary-gradient text-light-900" : "background-light800_dark300 text-dark400_light800"} paragraph-medium rounded-lg`}
                onClick={() => setActivePage(numberOfPage)}
              >
                {numberOfPage}
              </Button>
            )}
          </div>

          <Button
            className="background-light800_dark300 text-dark400_light800 body-medium light-border-2 select-none rounded-lg border px-3 py-3.5 shadow-sm"
            disabled={activePage === numberOfPage}
            onClick={() => handleNavigation("next")}
          >
            Next
          </Button>
        </div>
        <Select
          value={pageSize.padStart(2, "0")}
          onValueChange={handleValueChange}
        >
          <SelectTrigger className="background-light800_dark300 light-border text-dark500_light700 body-regular min-w-[130px] rounded-[5px] border px-5 py-2.5 focus:ring-0 focus:ring-offset-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="background-light800_dark300 body-regular text-dark500_light700">
            {paginationSelectOptions(totalData).map((data) => {
              return (
                <SelectItem key={data.name} value={data.value}>
                  {data.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Pagination;
