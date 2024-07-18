import { timeAgo } from "@/lib/utils";
import React from "react";
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { useUserContext } from "@/context/AuthContext";
import StatsPost from "./StatsPost";
import { Badge } from "../ui/badge";

/**
 * @typedef {import("appwrite").Models.Document} PostCardProps
 * @param {PostCardProps} post
 * @returns {JSX.Element}
 */

const PostCard = ({ post }) => {
  const { user } = useUserContext();

  if (!post.creator) {
    console.log("Error: post.creator is undefined");
    return;
  }

  
  const creatorId = post.creator.$id || post.creator.id; 
  const creatorName = post.creator.name || "Unknown"; // Default to "Unknown" if name is missing
  const creatorImageURL = post.creator.imageURL

  if (!creatorId) {
    console.log("Error: creatorId is undefined or null");
    return;
  }

  return (
    <div className="rounded-3xl border p-5 lg:p-7 w-full max-w-screen-sm border-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${creatorId}`}>
            <img
              src={creatorImageURL}
              alt="user"
              className="rounded-full w-12 lg:h-12"
            />
          </Link>
          <div className="flex flex-col">
            <div className="flex flex-row gap-2">
            <p className="text-[18px] text-white font-medium leading-[140%] lg:text-[18px] lg:font-bold lg:leading-[140%]">
              {creatorName}
            </p>
            <Badge variant="default">{user.roleType}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-[14px] text-white font-semibold leading-[140%] tracking-tighter lg:text-[14px] lg:font-normal lg:leading-[140%]">
                {timeAgo(post.$createdAt)}
              </p>
              <p className="text-[14px] text-white font-semibold leading-[140%] tracking-tighter lg:text-[14px] lg:font-normal lg:leading-[140%]">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        <Link to={`/update-post/${post.$id}`} className={`${user.id !== creatorId && "hidden"}`}>
          <FiEdit size={20} color="white" />
        </Link>
      </div>
        
      <Link to={`/posts/${post.$id}`}> 
        <div className="text-[14px] text-white font-medium leading-[140%] lg:text-[16px] lg:font-medium lg:leading-[140%] py-5">
          <p>{post.content}</p>
          <ul>
            {post.tags.map((tag) => (
              <li key={tag} className="text-light-3">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img src={post.imageURL} alt="image posted"/>
      </Link>

      <StatsPost post={post} userId={user.id}/>
    </div>
  );
};

export default PostCard;
