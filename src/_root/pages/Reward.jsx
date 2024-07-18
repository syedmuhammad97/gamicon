import { useUserContext } from "@/context/AuthContext";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { updateUserPointsAfterRedeem } from "@/lib/appwrite/api";

const rewards = [
  { id: 1, name: "Reward 1", cost: 100 },
  { id: 2, name: "Reward 2", cost: 200 },
  { id: 3, name: "Reward 3", cost: 300 },
];

const Reward = () => {
  const { user, updateUserPoints } = useUserContext();
  const [points, setPoints] = useState(user.points);
  const { toast } = useToast();

  const getStarColor = (stars) => {
    if(stars < 299) return "#cd7f32"; //change color to bronze
    if(stars >= 299 && points < 600) return "#c0c0c0"; //change color to silver
    if(stars >= 600) return "#ffd700"; //change color to gold
  };

  const starColor = getStarColor(user.stars);

  const handleRedeem = async (reward) => {
    if (points >= reward.cost) {
      const newPoints = points - reward.cost;
      try {
        await updateUserPointsAfterRedeem(user.id, newPoints);
        setPoints(newPoints);
        toast({
          description: `You have redeemed ${reward.name}`
        })
      } catch (error) {
        console.log(error)
        toast({
          description: "Failed to redeem reward. Please try again."
        })
      }
    } else {
      toast({
        description: "Not enough points to redeem this reward."
      })
    }
  };

  document.title = 'Rewards'
  
  return (
    <div className="flex flex-col flex-1 items-center overflow-scroll py-10 px-5 md:p-14 bg-slate-800">
      <div className="max-w-5xl flex flex-col items-center w-full gap-6 md:gap-9">
        <h2 className="text-[24px] text-white font-bold leading-[140%] 
          tracking-tighter md:text-[30px] md:font-bold md:leading-[140%] 
          md:tracking-tighter text-left w-full">
          Rewards
        </h2>
        <div className="flex gap-1 w-full px-4 py-5 rounded-lg bg-slate-600 justify-between">
          <Link to={`/update-profile/${user.id}`} className="flex gap-3 items-center">
            <img src={user.imageURL} alt="profile" className="h-14 w-14 rounded-full" />
            <div className="flex flex-col">
              <p className="text-[18px] font-bold leading-[140%] text-white">
                {user.name}
              </p>
              <div className="flex gap-2">
                <p className="text-[14px] font-normal leading-[140%] text-white">
                  @{user.username}
                </p>
                <Badge variant="default">{user.roleType}</Badge> {/* Display roleType here */}
              </div>
            </div>
          </Link>
          <div className="py-1 flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <FaStar size={25} fill={starColor} />
              <p className="text-lg font-semibold text-white">{user.points}</p>
            </div>
            <p className="text-sm text-white">points</p>
          </div>
        </div>

        <h3 className="text-[20px] text-white font-bold leading-[140%] 
          tracking-tighter md:text-[26px] md:font-bold md:leading-[140%] 
          md:tracking-tighter text-center w-full">
          Available Rewards
        </h3>

        <Carousel>
          <CarouselContent>
            {rewards.map((reward) => (
              <CarouselItem key={reward.id}>
                <div className="bg-slate-600 p-4 rounded-lg shadow-lg flex flex-col items-center">
                  <p className="text-xl font-bold text-white">{reward.name}</p>
                  <p className="text-lg text-white">Cost: {reward.cost} points</p>
                  <Button
                    className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={() => handleRedeem(reward)}
                    disabled={points < reward.cost}
                  >
                    Redeem
                  </Button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

      </div>
    </div>
  );
};

export default Reward;
