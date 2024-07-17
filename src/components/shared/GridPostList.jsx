import { useUserContext } from "@/context/AuthContext";
import React from "react";
import { Link } from "react-router-dom";
import StatsPost from "./StatsPost";

/**
 * @typedef {Object} GridPostListProps
 * @property {import('appwrite').Models.Document[]} post - The array of post documents.
 * @property {boolean} showUser?
 * @property {boolean} showStats?
 */

/**
 * GridPostList component
 * @param {GridPostListProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const GridPostList = ({ post, showUser = true, showStats = true }) => {
  const { user } = useUserContext();

  return(
    <ul className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7 max-w-5xl">
        {post.map((post) => (
            <li key={post.$id} className="relative min-w-80 h-80">
                <Link to={`/posts/${post.$id}` } className="flex rounded-[24px] border border-slate-600 overflow-hidden cursor-pointer w-full h-full">
                    <img src={post.imageURL} className="w-full h-full object-cover" />
                </Link>

                <div className="absolute bottom-0 p-5 flex-between w-full bg-gradient-to-t from-dark-3 to-transparent rounded-b-[24px] gap-2">
                    {showUser && (
                        <div className="flex flex-1 items-center justify-start gap-2">
                            <img src={post.creator.imageURL} alt="user" className="w-8 h-8 rounded-full"/>
                            <p className="line-clamp-1 text-white">{post.creator.name}</p>
                        </div>
                    )}
                    {showStats && <StatsPost post={post} userId={user.id} />}
                </div>
            </li>
        ))}
    </ul>
  );
};

export default GridPostList;
