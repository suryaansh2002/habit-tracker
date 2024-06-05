import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import withAuth from "@/hoc/withAuth";
import LogoutButton from "@/components/LogoutButton";
import { Button, Card } from "antd";

function Welcome({ user }) {
  const habitOptions = [
    "Exercise",
    "Drink 3 lts water",
    "Walk 10K Steps",
    "Sleep 8 Hours",
  ];
  const router = useRouter();

  const addHabit = (setHabit) => {
    if (setHabit) {
      localStorage.setItem("setHabit", setHabit);
    }
    router.push("/add-habit");
  };
  
  return (
    <div>
      <LogoutButton />
      <div className="flex flex-col text-center justify-center items-center h-[100vh] w-[100vw]">
        <div className="text-2xl font-bold  border-b-2 border-gray mb-4">
          Welcome {user.displayName.split(" ")[0]}
        </div>
        <div className="text-xl font-semibold text-left ml-8  text-gray-900 border-gray mb-4">
          Let's get you started with building habits that matter.
          <br />
          <br />
          Pick from Popular Habits-
        </div>
        {habitOptions.map((habit) => (
          <div className="text-lg mb-4  bg-yellow-200 flex justify-between w-[80%] p-2 rounded-md">
            {habit}{" "}
            <Button
              className="bg-red-500 text-white rounded-lg"
              onClick={() => addHabit(habit)}
            >
              Add +
            </Button>
          </div>
        ))}
        <Button
          onClick={() => addHabit()}
          className="w-[80%] bg-gray-700 text-white  p-4 text-lg py-6"
        >
          Create New Habit
        </Button>
      </div>
    </div>
  );
}

export default withAuth(Welcome);
