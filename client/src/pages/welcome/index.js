import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import withAuth from "@/hoc/withAuth";
import LogoutButton from "@/components/LogoutButton";
import { Button, Card, message } from "antd";
import axios from "axios";
import {
  FETCH_ALL_MASTER_HABITS_URL,
  FETCH_MASTER_CATEGORIES_URL,
  FETCH_USER_HABITS_URL,
} from "@/constants";
import CustomSpinner from "@/components/CustomSpinner";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { BsPlusSquareFill, BsFillCheckSquareFill } from "react-icons/bs";

function Welcome({ user }) {
  const habitOptions = [
    "Exercise",
    "Drink 3 lts water",
    "Walk 10K Steps",
    "Sleep 8 Hours",
  ];
  const [categories, setCategories] = useState([]);
  const [masterHabits, setMasterHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [habitsObj, setHabitsObj] = useState({});
  const router = useRouter();
  const [userHabits, setUserHabits] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const addHabit = (setHabit) => {
    if (setHabit) {
      localStorage.setItem("setHabit", setHabit);
      let masterHabitId = null;
      masterHabits.map((item) => {
        if (item.habitName == setHabit) {
          masterHabitId = item._id;
        }
      });
      if (masterHabitId) {
        localStorage.setItem("habitId", masterHabitId);
      }
    }
    router.push("/add-habit?new=true");
  };

  const fetchHabits = async () => {
    try {
      const response = await axios.get(FETCH_USER_HABITS_URL + `${user.uid}`);
      setUserHabits(response.data.map((item) => item.name));
      if (response.data.length > 0) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const fetchMasterHabits = async () => {
    try {
      setLoading(true);
      const response = await axios.get(FETCH_ALL_MASTER_HABITS_URL);
      setMasterHabits(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log(FETCH_MASTER_CATEGORIES_URL);
      const response = await axios.get(FETCH_MASTER_CATEGORIES_URL);
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  useEffect(() => {
    if (masterHabits.length) {
      const obj = {};
      masterHabits.map((item) => {
        if (obj[item["categoryName"]]) {
          obj[item["categoryName"]].push(item["habitName"]);
        } else {
          obj[item["categoryName"]] = [item["habitName"]];
        }
      });
      console.log(obj);
      setHabitsObj(obj);
    }
  }, [categories, masterHabits]);
  const showMessage = () => {
    message.info("This habit has already been added.");
  };
  useEffect(() => {
    fetchHabits();
    fetchCategories();
    fetchMasterHabits();
  }, []);
  return (
    <div>
      {/* <LogouwtButton /> */}
      {Object.keys(habitsObj).length == 0 ? (
        <CustomSpinner />
      ) : (
        <div className="flex flex-col text-left ml-4 mt-4 h-[100vh] w-[100%] maxContainer">
          <div className="text-xl font-bold !text-left mt-4 mb-4">
            Hello {user.displayName.split(" ")[0]},
          </div>
          <div className="text-xl font-semibold text-left mr-16 text-gray-900 border-gray mb-8">
            Let's get you started with building habits that matter.
            <br />
            <br />
            Pick from popular habits OR Create a new habit
          </div>
          {Object.keys(habitsObj).map((category) => (
            <>
              <div
                className="text-lg mt-4  flex justify-between w-[95%] p-2 rounded-md bg-[#F4F4F4]"
                onClick={() => {
                  selectedCategory == category
                    ? setSelectedCategory(null)
                    : setSelectedCategory(category);
                }}
              >
                {category}{" "}
                {selectedCategory == category ? (
                  <FaAngleUp className="translate-y-1" />
                ) : (
                  <FaAngleDown className="translate-y-1" />
                )}
              </div>
              {selectedCategory == category &&
                habitsObj[category].map((habit) => (
                  <div className="text-lg   flex justify-between w-[95%] p-2  bg-[#F4F4F4]">
                    {habit}
                    {userHabits.includes(habit) ? (
                      <button onClick={() => showMessage()}>
                        <BsFillCheckSquareFill className="text-2xl mr-2 text-[#FFE11D] bg-gray-800" />
                      </button>
                    ) : (
                      <button onClick={() => addHabit(habit)}>
                        <BsPlusSquareFill className="text-2xl mr-2" />
                      </button>
                    )}
                  </div>
                ))}
            </>
          ))}
          <Button
            onClick={() => addHabit()}
            className="w-[50%] mt-4 text-gray-800 font-semibold bg-[#FFE11D] p-4 text-lg py-6 ml-[50%] -translate-x-[50%]"
          >
            Create New Habit
          </Button>
          <a href="/dashboard">
          <Button
            disabled={userHabits.length == 0}
            onClick={() => addHabit()}
            className={userHabits.length == 0 ? "w-[50%] font-semibold mt-4 text-white bg-gray-800 p-4 text-lg py-6 ml-[50%] -translate-x-[50%]" : 

              "w-[50%] mt-4 text-gray-800 bg-[#FFE11D] font-semibold p-4 text-lg py-6 ml-[50%] -translate-x-[50%]"
            }
          >
            Begin Tracking
          </Button>
          </a>
        </div>
      )}
    </div>
  );
}

export default withAuth(Welcome);
