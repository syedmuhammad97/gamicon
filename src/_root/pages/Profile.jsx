import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import React, { useCallback, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"; // Adjust the import path as needed
import {
  UseDeleteBooking,
  useGetUserBookings,
  useUpdateBookingAttendees,
} from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";
import { getUserProfile } from "@/lib/appwrite/api";
import { FiDelete } from "react-icons/fi";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { id } = useParams(); // Get userId from URL params
  const { user } = useUserContext(); // Current logged-in user
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const { data: bookings, isLoading, error } = useGetUserBookings(id); // Fetch bookings for the user from URL params
  const { mutate: attendBooking } = useUpdateBookingAttendees();
  const { mutate: deleteBooking } = UseDeleteBooking();
  const [currentBookingIndex, setCurrentBookingIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserProfile(id); // Fetch user profile data based on URL params
        setUserProfile(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [id]); // Re-fetch user profile when URL id changes

  const getStarColor = (stars) => {
    if (stars < 299) return "#cd7f32"; // Change color to bronze
    if (stars >= 299 && stars < 600) return "#c0c0c0"; // Change color to silver
    if (stars >= 600) return "#ffd700"; // Change color to gold
  };

  const starColor = userProfile ? getStarColor(userProfile.stars) : "#ffffff"; // Default to white if userProfile is null

  const totalBookings = bookings ? bookings.length : 0;

  const handleAttend = (bookingId) => {
    attendBooking({ bookingId, userId: user.name });
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await deleteBooking({ bookingId }); // Call the deleteBooking mutation with the correct bookingId
      navigate("/feed");
      toast({
        description: "You have successfully delete the booking!.",
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast({
        description: "Failed to delete booking. Please try again.",
      });
    }
  };

  if (!userProfile) {
    return <Loader />; // Loading state
  }

  return (
    <div className="flex flex-1 bg-slate-800">
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14">
        <div className="max-w-5xl flex flex-col items-center w-full gap-6 md:gap-9">
          <h2 className="text-[24px] text-white font-bold leading-[140%] tracking-tighter md:text-[30px] md:font-bold md:leading-[140%] md:tracking-tighter text-left w-full">
            Profile
          </h2>
          <div className="flex gap-1 w-full px-4 py-5 rounded-lg bg-slate-600 justify-between">
            <div className="flex gap-4">
              <img
                src={userProfile.imageURL}
                alt="profile"
                className="h-14 w-14 rounded-full"
              />
              <div className="flex flex-col">
                <p className="text-[18px] font-bold leading-[140%] text-white">
                  {userProfile.name}
                </p>
                <div className="flex gap-2">
                  <p className="text-[14px] font-normal leading-[140%] text-white">
                    @{userProfile.username}
                  </p>
                  <Badge variant="default">{userProfile.roleType}</Badge>
                </div>
              </div>
            </div>
            <div className="py-1 flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <FaStar size={25} fill={starColor} />
                <p className="text-lg font-semibold text-white">
                  {userProfile.points}
                </p>
              </div>
              <p className="text-sm text-white">points</p>
            </div>
          </div>

          {/* Carousel for User Bookings */}
          <div className="mt-8">
            {isLoading ? (
              <Loader />
            ) : bookings && bookings.length > 0 ? (
              <div>
                <Carousel>
                  <CarouselContent>
                    {bookings.map((booking, index) => (
                      <CarouselItem key={booking.$id}>
                        <div className="bg-slate-500 p-4 rounded-lg">
                          <div className="flex flex-row justify-between items-center">
                            {/* Centered Date & Time */}
                            <p className="text-white text-center flex-grow">
                              Date & Time:{" "}
                              {new Date(booking.dateAndTime).toLocaleString()}
                            </p>
                            {/* Right-aligned Delete Button */}
                            <Button
                              onClick={() => handleDeleteBooking(booking.$id)}
                              variant="ghost"
                              className={`post_details-delete_btn ${
                                user.id !== booking?.creator.$id && "hidden"
                              } ml-auto`} // Add ml-auto to push the button to the right
                            >
                              <FiDelete size={20} color="red" />
                            </Button>
                          </div>

                          <p className="text-white text-center">
                            User Limit: {booking.userLimit}
                          </p>
                          <p className="text-white">
                            Attendees: {booking.attendees.join(", ")}
                          </p>
                          {/* Conditional rendering based on attendee status */}
                          {booking.attendees.includes(user.name) ? (
                            <p className="text-green-500 text-center">
                              You are attending
                            </p>
                          ) : (
                            <div className="flex justify-center items-center gap-2">
                              {/* Attend Button */}
                              <Button onClick={() => handleAttend(booking.$id)}>
                                Attend
                              </Button>
                            </div>
                          )}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
                <p className="text-white mt-2 text-center">
                  {totalBookings} Booking Slots Available
                </p>
              </div>
            ) : (
              <p className="text-white">No bookings found</p>
            )}

            {error && <p className="text-red-500">{error.message}</p>}
          </div>
        </div>

        {/* Update Profile Button */}
        <div className="w-full flex justify-end mt-2">
          {id === user.id && (
            <Link to={`/update-profile/${user.id}`}>
              <Button className="mt-2 bg-blue-500 text-white py-2 px-4 rounded">
                Update Profile
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
