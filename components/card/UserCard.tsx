import React from "react";
import RenderTag from "../shared/RenderTag";
import Image from "next/image";
import Link from "next/link";
import { getTopInteractedTags } from "@/lib/actions/tag.action";
import { Badge } from "../ui/badge";

interface IUserProps {
  _id: string;
  clerkId: string;
  imgUrl: string;
  name: string;
  username: string;
}

const UserCard = async ({
  _id,
  clerkId,
  imgUrl,
  name,
  username,
}: IUserProps) => {
  const tags = await getTopInteractedTags({ userId: _id });

  return (
    <Link
      href={`/profile/${clerkId}`}
      className="card-wrapper light-border shadow-light100_darknone w-full max-w-[260px] rounded-2xl border p-8"
    >
      <article className="flex flex-col items-center justify-center gap-5">
        <div className="flex flex-col items-center text-center">
          <Image
            src={imgUrl}
            alt={"User profile picture"}
            width={100}
            height={100}
            className="rounded-full object-contain"
          />
          <h3 className="h3-bold text-dark200_light900 mt-4 line-clamp-1">
            {name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">@{username}</p>
        </div>

        <div className="flex w-full justify-center gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => {
              return <RenderTag key={tag._id} _id={tag._id} name={tag.name} />;
            })
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
