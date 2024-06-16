import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import withAuth from "@/hoc/withAuth";
import LogoutButton from "@/components/LogoutButton";
import { Button, Card, Spin } from "antd";
import axios from "axios";
import { FETCH_CATEGORY_HABITS_URL, FETCH_MASTER_CATEGORIES_URL, FETCH_USER_HABITS_URL } from "@/constants";
import BottomNav from "@/components/BottomNav";
import CustomSpinner from "@/components/CustomSpinner";
function Create({ user }) {
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

  const [habits, setHabits] = useState([]);
  const [habitsData, setHabitsData] = useState([])
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchCategories();
    fetchHabits();
  }, []);
  const fetchHabits = async () => {
    try {
      setLoading(true);
      const response = await axios.get(FETCH_USER_HABITS_URL + `${user.uid}`);
      setHabits(response.data.map((item) => item.name));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const getCategoryHabits = async(category) => {
    setLoading(true)
    const response = await axios.post(FETCH_CATEGORY_HABITS_URL,{categoryName: category})
    setHabitsData(response.data)
    setLoading(false)
  }


  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log(FETCH_MASTER_CATEGORIES_URL)
      const response = await axios.get(FETCH_MASTER_CATEGORIES_URL);
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };
  return (
    <div className="maxContainer">
      {loading ? (
        <CustomSpinner />
      ) : (
        <div className="flex flex-col text-center justify-center items-center h-[100vh] w-[100%]">
{habitsData.length ? <>
          <div className="text-xl font-semibold text-center text-gray-900 border-gray mb-4">
            Create Your next habit now!
            <br />
            <br />
            Pick from Popular Habits-
          </div>
          {
            habitsData.map((habit)=>
              !habits.includes(habit.habitName) &&
              <div className="text-md mb-4  bg-yellow-200 flex justify-between w-[80%] p-2 rounded-md">
                {habit.habitName}{" "}
                <Button
                  className="bg-red-500 text-white rounded-lg"
                  onClick={() => addHabit(habit.habitName)}
                >
                  Add
                </Button>
              </div>
              )
          }

</>
:
<>
          <div className="text-xl font-semibold text-center text-gray-900 border-gray mb-4">
            Create Your next habit now!
            <br />
            <br />
            Explore our categories-
          </div>
          {
            categories.map((category)=>
              <div className="text-md mb-4  bg-yellow-200 flex justify-between w-[80%] p-2 rounded-md">
                {category}{" "}
                <Button
                  className="bg-red-500 text-white rounded-lg"
                  onClick={() => getCategoryHabits(category)}
                >
                  Explore
                </Button>
              </div>
              )
          }

</>
}


          <Button
            onClick={() => addHabit()}
            className="w-[80%] bg-gray-700 text-white  p-4 text-lg py-6"
          >
            Create New Habit
          </Button>
        </div>
      )}
      <BottomNav />
    </div>
  );
}

export default withAuth(Create);
