import GridPostList from "@/components/shared/GridPostList";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import {
  useGetPost,
  useSearchPost,
} from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

const Explore = () => {
  const [searchVal, setSearchVal] = useState("");
  const { ref, inView} = useInView();
  const debounceValue = useDebounce(searchVal, 500);
  const { data: post, fetchNextPage, hasNextPage } = useGetPost();
  const { data: searchPosts, isFetching: isSearchFetching } = useSearchPost(debounceValue);

  useEffect(() => {
    if(inView && ! searchVal) fetchNextPage();
  }, [inView, searchVal])

  if(!post){
    return(
      <div className="flex justify-center items-center w-full h-full"><Loader /></div>
    )
  }

  const showResult = searchVal !== '';
  const showPosts = !showResult && post.pages.every((item) => item.documents.length === 0)

  return (
    <div className="flex flex-col flex-1 items-center overflow-scroll py-10 px-5 md:p-14 bg-slate-800">
      <div className="max-w-5xl flex flex-col items-center w-full gap-6 md:gap-9">
        <h2 className="text-[24px] text-white font-bold leading-[140%] tracking-tighter md:text-[30px] md:font-bold md:leading-[140%] md:tracking-tighter w-full">
          Find Conversation
        </h2>
        <div className="flex gap-1 w-full px-4 rounded-lg bg-slate-400">
          <FaSearch size={25} className="translate-y-2" />
          <Input
            type="text"
            placeholder="Search"
            className="h-12 bg-slate-400 border-none placeholder:text-black focus-visible:ring-0 focus-visible:ring-offset-0 ring-offset-0"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between items-center w-full max-w-5xl mt-16 mb-7">
        <h3 className="text-[18px] text-white font-bold leading-[140%] tracking-tighter md:text-[24px] md:font-bold md:leading-[140%] md:tracking-tighter w-full">
          Popular Posts
        </h3>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {showResult ? (
          <SearchResults 
            isSearchFetching={isSearchFetching}
            searchPosts={searchPosts}
          />
        ) : showPosts ? (
          <p className="text-slate-50 mt-10 text-center w-full">End of Posts</p>
        ): post.pages.map((item, index) => (<GridPostList key={`page-${index}`} post={item.documents}/>))}
      </div>

      {hasNextPage && !searchVal && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
