import { useEffect, useState } from "react";
import axios from "axios";
import { List, Typography, Button } from "antd";
import withAuth from "@/hoc/withAuth";
import LogoutButton from "@/components/LogoutButton";
import moment from "moment";
import BottomNav from "@/components/BottomNav";
import { useRouter } from "next/router";
import { FETCH_USER_HABITS_URL } from "@/constants";
import CustomSpinner from "@/components/CustomSpinner";

const Profile = ({ user }) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchHabits = async () => {
      setLoading(true);
      try {
        const response = await axios.get(FETCH_USER_HABITS_URL + `${user.uid}`);
        setHabits(response.data);
      } catch (error) {
        console.error("Error fetching habits:", error);
      }
      setLoading(false);
    };

    fetchHabits();
  }, [user.uid]);

  return (
    <div className="maxContainer">
      {/* <LogoutButton /> */}
      {loading ? (
        <CustomSpinner />
      ) : (
        <div className="flex flex-col text-center justify-center items-center h-max pt-8 w-[100%]">
          <div className="text-2xl font-bold mt-8 mb-2">
            {" "}
            {user.displayName}
          </div>
          <div className="text-md mb-8"> {user.email}</div>
          <LogoutButton />
          {habits.map((habit) => (
            <div className="rounded-lg p-6 shadow-lg w-[90%] flex flex-row justify-between my-2">
              <div className="text-left">
                <div className="text-lg ">{habit.name}</div>
                <div className="text-xs">
                  {moment(habit.startDate).format("DD MMM YY")}-{" "}
                  {moment(habit.endDate).format("DD MMM YY") != "Invalid date"
                    ? moment(habit.endDate).format("DD MMM YY")
                    : "No End Date"}
                </div>
              </div>
              <div>
                <a href={`/edit/${habit._id}`}>Edit</a>
              </div>
            </div>
          ))}
          <Button
            onClick={() => router.push("create")}
            className="w-[90%] bg-gray-700 text-white  p-4 text-lg py-6 mb-20"
          >
            Create New Habit
          </Button>
        </div>
      )}
      <BottomNav highlight={"profile"} />
    </div>
  );
};

export default withAuth(Profile);
