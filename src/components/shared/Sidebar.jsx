import React, { createContext, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { LuMenu, LuX } from "react-icons/lu";
import { Button } from "../ui/button";
import { FiLogOut } from "react-icons/fi";

const SidebarContext = createContext();
export default function Sidebar({ children }) {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const nav = useNavigate();
  const { user } = useUserContext();
  const [expanded, setExpended] = useState(true);

  useEffect(() => {
    if (isSuccess) {
      nav(0);
    }
  }, [isSuccess]);

  return (
    <aside className="h-screen">
      <nav className=" md:flex h-full flex-col bg-violet-200 border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="/assets/images/logo.png"
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            alt="logo"
            width={170}
            height={36}
          />
          <button
            onClick={() => setExpended((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <LuX /> : <LuMenu />}
          </button>
        </div>

        <div className="border-t flex p-3 border-b">
          <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
            <img
              src={user.imageURL}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />
            <div
              className={`flex flex-col overflow-hidden transition-all ${
                expanded ? "w-52 ml-3" : "w-0"
              }`}
            >
              <p className="text-[18px] font-bold leading-[140%]">
                {user.name}
              </p>
              <p className="text-[14px] font-normal leading-[140%] text-black">
                @{user.username}
              </p>
            </div>
          </Link>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <Button
            variant="ghost"
            className="text-2xl"
            onClick={() => signOut()}
          >
            <FiLogOut />
          </Button>
          <p
            className={`
          text-[20px] py-1 font-medium leading-[140%]
          overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            Logout
          </p>
        </div>
      </nav>
    </aside>
  );
}

export function SidebarSelection({ icon, text, active }) {
  const { expanded } = useContext(SidebarContext);
  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1
       font-medium rounded-md cursor-pointer transition-colors group
       ${
         active
           ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
           : "hover:bg-indigo-50 text-gray-600"
       }`}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>

      {!expanded && (
        <div
          className={`
        absolute left-full rounded-md px-2 py-1 ml-6
        bg-indigo-100 text-indigo-800 text-sm
        invisible opacity-20 -translate-x-3 transition-all
        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  );
}

