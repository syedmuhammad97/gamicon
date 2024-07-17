import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const topbar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const nav = useNavigate();
  const {user} = useUserContext();

  if (!user || !user.imageURL) {
    console.log("User or user imageURL is undefined");
    // Optionally, provide a fallback image or handle the error gracefully
  }

  useEffect(() => {
    if (isSuccess) {
      nav(0);
    }
  }, [isSuccess]);

  console.log(user.imageURL);

  return (
    <section className="sticky top-0 z-50 md:hidden bg-green-300 w-full">
      <div className="flex justify-between items-center py-4 px-5">
        <Link to="/feed" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.png"
            alt="logo"
            width={130}
            height={325}
          />
        </Link>

        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => signOut()}>
            <FiLogOut />
          </Button>

          <Link
            to={`/profile/${user.id}`}
            className="flex justify-center items-center gap-3"
          >
            <img
              src={user?.imageURL}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default topbar;
