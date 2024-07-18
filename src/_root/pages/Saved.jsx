import GridPostList from "@/components/shared/GridPostList";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";

import { Loader } from "lucide-react";
import { FaSave } from "react-icons/fa";

const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();

  const savePosts = currentUser?.save
    .map(
      /** @param {import('appwrite').Models.Document} savePost */ (
        savePost
      ) => ({
        ...savePost.post,
        creator: {
          imageURL: currentUser.imageURL,
        },
      })
    )
    .reverse();

    document.title = 'Saved'

  return (
    <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:p-14 bg-slate-800">
      <div className="flex gap-2 max-w-5xl w-full">
        <FaSave size={36} color="white" />
        <h2 className="text-[24px] text-white font-bold leading-[140%] tracking-tighter md:text-[30px] md:font-bold md:leading-[140%] md:tracking-tighter text-left w-full">
          Saved Posts
        </h2>
      </div>

      {!currentUser ? (
        <Loader className="item-center justify-center w-full" />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savePosts.length === 0 ? (
            <p className="text-white">No saved posts</p>
          ) : (
            <GridPostList post={savePosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;
