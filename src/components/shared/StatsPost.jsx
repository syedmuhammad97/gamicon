import {
  useDeleteSavePost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaRegSave, FaSave } from "react-icons/fa";

/**
 * @typedef {Object} StatsPostProps
 * @property {import('appwrite').Models.Document} post? - The post document.
 * @property {string} userId - The user ID.
 */

/**
 * StatsPost component
 * @param {StatsPostProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const StatsPost = ({ post, userId }) => {
  const likesList = post?.likes.map(
    /** @param {import('appwrite').Models.Document} user */ (user) => user.$id
  );

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavePost } = useDeleteSavePost();

  const { data: currentUser } = useGetCurrentUser();

  const savePostRecord = currentUser?.save.find(
    /** @param {import('appwrite').Models.Document} record */ (record) =>
      record.post?.$id === post?.$id
  );

  useEffect(() => {
    setIsSaved(!!savePostRecord);
  }, [currentUser]);

  /**
   *
   * @param {React.MouseEvent} e
   *
   */
  const handleLikePost = (e) => {
    e.stopPropagation();

    let newLikes = [...likes];

    const hasLiked = newLikes.includes(userId);

    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }

    setLikes(newLikes);

    likePost({ postId: post?.$id || '', likesArray: newLikes });
  };

  /**
   *
   * @param {React.MouseEvent} e
   *
   */
  const handleSavePost = (e) => {
    e.stopPropagation();

    if (savePostRecord) {
      setIsSaved(false);
      deleteSavePost(savePostRecord.$id);
    } else {
      savePost({ postId: post?.$id || '', userId });
      setIsSaved(true);
    }
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5 pt-4">
        {checkIsLiked(likes, userId) ? (
          <FaHeart
            size={20}
            color="red"
            onClick={handleLikePost}
            className="cursor-pointer"
          />
        ) : (
          <FaRegHeart
            size={20}
            color="white"
            onClick={handleLikePost}
            className="cursor-pointer"
          />
        )}
        <p className="text-[14px] text-white font-medium leading-[140%] lg:text-[16px] lg:font-medium lg:leading-[140%]">
          {likes.length}
        </p>
      </div>

      <div className="flex gap-2 mr-5 pt-4">
        {isSaved ? (
          <FaSave
            size={20}
            color="white"
            onClick={handleSavePost}
            className="cursor-pointer"
          />
        ) : (
          <FaRegSave
            size={20}
            color="white"
            onClick={handleSavePost}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default StatsPost;
