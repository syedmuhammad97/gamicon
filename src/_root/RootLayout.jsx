import Sidebar, { SidebarSelection } from "@/components/shared/Sidebar";
import { FaSave, FaStar } from "react-icons/fa";
import {
  MdDateRange,
  MdOutlinePostAdd,
  MdGridView,
  MdOutlineExplore,
} from "react-icons/md";
import React from "react";
import { Link, Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="w-full md:flex">
      {/* <Topbar /> */}
      <Sidebar>
        {/* <Link to="/">
          <SidebarSelection icon={<FaHome size={20} />} text="Home" />
        </Link> */}
        <Link to="/feed">
          <SidebarSelection icon={<MdGridView size={20} />} text="Feed" />
        </Link>
        <Link to="/explore">
          <SidebarSelection
            icon={<MdOutlineExplore size={20} />}
            text="Explore"
          />
        </Link>
        <Link to="/rewards">
          <SidebarSelection icon={<FaStar size={20} />} text="Rewards" />
        </Link>
        <Link to="/saved">
          <SidebarSelection icon={<FaSave size={20} />} text="Saved" />
        </Link>
        <Link to="/create-posts">
          <SidebarSelection
            icon={<MdOutlinePostAdd size={20} />}
            text="Create Post"
          />
        </Link>
        <Link to="/create-bookings">
          <SidebarSelection
            icon={<MdDateRange size={20} />}
            text="Create Bookings"
          />
        </Link>
      </Sidebar>

      <section className="flex flex-1 h-full">
        <Outlet />
      </section>
    </div>
  );
};

export default RootLayout;
