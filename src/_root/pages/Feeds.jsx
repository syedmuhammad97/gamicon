
import PostCard from "@/components/shared/PostCard";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";
import React from "react";

//feeds is home
const Feeds = () => {
  const{data: posts, isPending: isPostLoading, isError: isErrorPosts} = useGetRecentPosts();
  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14">
        <div className="max-w-screen-sm flex flex-col items-center w-full gap-6 md:gap-9">
          <h2
            className="text-[24px] text-white font-bold leading-[140%] 
          tracking-tighter md:text-[30px] md:font-bold md:leading-[140%] 
          md:tracking-tighter text-left w-full"
          >
            Feeds
          </h2>
          {isPostLoading && !posts ? (
            <Loader />
          ):(
            <ul className="flex flex-col flex-1 gap-9 w-full">      
              {posts.documents.map((post) => (
                <PostCard post={post} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feeds;
