import React from "react";
import "./globals.css";
import { Route, Routes, useLocation } from "react-router-dom";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForms from "./_auth/forms/SignupForms";

import AuthLayout from "./_auth/AuthLayout";
import { Toaster } from "@/components/ui/toaster";
import RootLayout from "./_root/RootLayout";
import Explore from "./_root/pages/Explore";
import Saved from "./_root/pages/Saved";
import CreatePosts from "./_root/pages/CreatePost";
import Reward from "./_root/pages/Reward";
import Feeds from "./_root/pages/Feeds";
import Profile from "./_root/pages/Profile";
import EditPost from "./_root/pages/EditPost";
import PostDetails from "./_root/pages/PostDetails";
import EditProfile from "./_root/pages/EditProfile";
import CreateBooking from "./_root/pages/CreateBooking";

const App = () => {
  const location = useLocation();
  const isAuthRoute =
    location.pathname === "/sign-in" || location.pathname === "/sign-up";

  return (
    <main
      className={
        isAuthRoute
          ? "flex h-screen bg-cover bg-no-repeat bg-center px-4 bg-[url('/assets/images/background.jpg')]"
          : "flex h-screen bg-gray-800"
      }
    >
      <Routes>
        {/* Public Route */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForms />} />
        </Route>

        {/* Private Route */}
        <Route element={<RootLayout /> }>
          <Route index element={<Feeds />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/feed" element={<Feeds />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/create-posts" element={<CreatePosts />} />
          <Route path="/create-bookings" element={<CreateBooking />} />
          <Route path="/rewards" element={<Reward />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/update-profile/:id" element={<EditProfile />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  );
};

export default App;
