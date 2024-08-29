import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { PaginationData } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimesStamp = (createdAt: Date): string => {
  const current = new Date().getTime();
  const createdAtTime = createdAt.getTime();
  const timeDiffence = current - createdAtTime;

  // Define time intervals in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (timeDiffence < minute) {
    const seconds = Math.floor(timeDiffence / 1000);
    return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
  } else if (timeDiffence < hour) {
    const minutes = Math.floor(timeDiffence / minute);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (timeDiffence < day) {
    const hours = Math.floor(timeDiffence / hour);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (timeDiffence < week) {
    const days = Math.floor(timeDiffence / day);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (timeDiffence < month) {
    const weeks = Math.floor(timeDiffence / week);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else if (timeDiffence < year) {
    const months = Math.floor(timeDiffence / month);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.floor(timeDiffence / year);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
};

export const formatNumber = (value: number): string => {
  const thousand = 1000;
  const million = thousand * 1000;
  const billion = million * 1000;
  if (value < thousand) {
    return value.toString();
  } else if (value < million) {
    const formattedVal = (value / thousand).toFixed(1);
    return `${formattedVal}K`;
  } else if (value < billion) {
    const formattedVal = (value / million).toFixed(1);
    return `${formattedVal}M`;
  } else {
    const formattedVal = (value / billion).toFixed(1);
    return `${formattedVal}B`;
  }
};

export const getJoinedDate = (date: Date): string => {
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return `${month} ${year}`;
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | string[] | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

interface RemoveUrlQueryParams {
  params: string;
  keys: string[];
}

export const removeKeysFromQuery = ({ params, keys }: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keys.forEach((key) => delete currentUrl[key]);

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

export const createFirstAndLastPages = (
  pageNumber: number[],
  activePage: number,
  totalPages: number
) => {
  let firstPages;
  if (activePage > 0 && activePage < 4 && totalPages > 5) {
    firstPages = pageNumber.slice(1, activePage > 2 ? activePage + 1 : 3);
  } else if (activePage > 3 && totalPages > 5 && activePage < totalPages - 1) {
    firstPages = pageNumber.slice(activePage - 2, activePage + 1);
  } else if (activePage >= totalPages - 1 && totalPages > 5) {
    firstPages = pageNumber.slice(totalPages - 4, totalPages - 1);
  }
  return firstPages || pageNumber;
};

export const paginationSelectOptions = (total: number): PaginationData[] => {
  const pageSizes = [5, 10, 20, 50, 100, 500];
  return pageSizes
    .filter((size) => size <= total)
    .map((size) => ({
      name: `${size.toString().padStart(2, "0")}/ page`,
      value: size.toString().padStart(2, "0"),
    }))
    .concat(
      pageSizes
        .filter((size) => size > total)
        .slice(0, 1)
        .map((size) => ({
          name: `${size.toString().padStart(2, "0")}/ page`,
          value: size.toString().padStart(2, "0"),
        }))
    );
};
