"use client";

import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const LeftSidebar = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-200 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          if (link.route === "/profile") {
            if (userId) {
              link.route = `/profile/${userId}`;
            } else return null;
          }

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`${isActive ? "primary-gradient rounded-lg text-light-900" : "text-dark300_light900"} relative flex items-center justify-start gap-4 p-4`}
            >
              <Image
                src={link.imgURL}
                width={20}
                height={20}
                alt={link.label}
                className={`${isActive ? "" : "invert-colors"}`}
              />
              <p
                className={`${isActive ? "base-bold" : "base-medium"} max-lg:hidden`}
              >
                {link.label}
              </p>
            </Link>
          );
        })}
      </div>

      <SignedOut>
        <div className="mt-3 flex flex-col gap-3">
          <Link href={"/sign-in"}>
            <Button className="btn-secondary body-semibold min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Image
                src={"/assets/icons/account.svg"}
                width={20}
                height={20}
                alt={"Login"}
                className="invert-colors lg:hidden"
              />
              <span className="primary-text-gradient max-lg:hidden">
                Log in
              </span>
            </Button>
          </Link>
          <Link href={"/sign-up"}>
            <Button className="btn-tertiary body-semibold min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Image
                src={"/assets/icons/sign-up.svg"}
                width={20}
                height={20}
                alt={"Account"}
                className="invert-colors lg:hidden"
              />
              <span className="text-dark400_light900 max-lg:hidden">
                Sign up
              </span>
            </Button>
          </Link>
        </div>
      </SignedOut>
      <SignedIn>
        <Link href={"/log-out"}>Log out</Link>
      </SignedIn>
    </section>
  );
};

export default LeftSidebar;
