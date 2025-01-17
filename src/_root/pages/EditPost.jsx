import PostForm from "@/components/forms/PostForm";
import { useGetPostID } from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";
import React from "react";
import { MdOutlineAddComment } from "react-icons/md";
import { useParams } from "react-router-dom";

const EditPost = () => {
    const { id } = useParams();
    const { data: post, isPending} = useGetPostID(id)

    document.title = 'Edit Post'

    if(isPending) return <Loader />
  return ( 
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 bg-slate-800">
        <div className="max-w-5xl flex justify-start items-center gap-3 w-full">
          <MdOutlineAddComment size={36} color="white" />
          <h2 className="text-[24px] font-bold leading-[140%] tracking-tighter md:text-[36px] md:font-bold md:leading-[140%] md:tracking-tighter text-left w-full text-white">
            Edit Post
          </h2>
        </div>
        <PostForm action="Update" post={post}/>
      </div>
    </div>
  );
};

export default EditPost;
