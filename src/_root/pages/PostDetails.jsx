import { useDeletePost, useGetPostID } from "@/lib/react-query/queriesAndMutations";
import { timeAgo } from "@/lib/utils";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { FiDelete } from "react-icons/fi";
import StatsPost from "@/components/shared/StatsPost";

const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostID(id || "");
  const { user } = useUserContext();
  const { mutate: deletePost } = useDeletePost();
  const navigate = useNavigate();

   // State to manage image source
   const [imageSrc, setImageSrc] = useState("");

   // Set initial image source when post data is available
   useEffect(() => {
     if (post) {
       setImageSrc(post?.imageURL);
     }
   }, [post]);
 
   // Update the image source to the full image URL on click
   const handleImageClick = () => {
     const fullImageURL = post?.imageURL.replace(
       /\/preview\?width=\d+&height=\d+&gravity=\w+&quality=\d+/,
       '/preview?'
     );
     setImageSrc(fullImageURL);
   };

  document.title = 'Post Details'
  
function handleDeletePost() {
    deletePost({ postId: id, imageId: post?.imageId });
    navigate("/feed");
  };

  return (
    <div className="flex flex-col flex-1 gap-10 overflow-scroll py-10 px-5 md:p-14 items-center bg-slate-800">
      {isPending ? (
        <Loader />
      ) : (
        <div className="w-full max-w-5xl rounded-[30px] flex-col flex xl:flex-row border border-white xl:rounded-l-[24px]">
          <img
            src={imageSrc}
            alt="post"
            className="h-80 lg:h-[480px] xl:w-[48%] rounded-t-[30px] xl:rounded-l-[24px] xl:rounded-tr-none object-cover p-5 cursor-pointer"
            onClick={handleImageClick}
          />
          <div className="flex flex-col gap-5 lg:gap-7 flex-1 items-start p-8 rounded-[30px]">
            <div className="flex justify-between items-center w-full">
              <Link
                to={`/profile/${post?.creator?.$id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={post?.creator?.imageURL}
                  alt="user"
                  className="rounded-full w-8 h-8 lg:h-12 lg:w-12"
                />

                <div className="flex flex-col">
                  <p className="text-[18px] text-off-white font-medium leading-[140%] lg:text-[18px] lg:font-bold lg:leading-[140%]">
                    {post?.creator.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] text-off-white font-semibold leading-[140%] tracking-tighter lg:text-[14px] lg:font-normal lg:leading-[140%]">
                      {timeAgo(post?.$createdAt)}
                    </p>
                    <p className="text-[14px] text-off-white font-semibold leading-[140%] tracking-tighter lg:text-[14px] lg:font-normal lg:leading-[140%]">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex items-center justify-center gap-1">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}
                >
                  <FiEdit color="white" size={20} />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ghost_details-delete_btn ${
                    user.id !== post?.creator.$id && "hidden"
                  }`}
                >
                  <FiDelete size={20} color="red" />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-white" />
            <div className="text-[14px]  text-white flex flex-col flex-1 w-full font-medium leading-[140%] lg:text-[16px] lg:font-normal lg:leading-[140%] ">
              <p>{post?.content}</p>
              <ul>
                {post?.tags.map((tag) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full"> 
                <StatsPost post={post || {}} userId={user.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
