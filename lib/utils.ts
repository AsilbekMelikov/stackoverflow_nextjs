import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
