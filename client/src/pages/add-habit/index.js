import { useEffect, useState } from "react";
import axios from "axios";
import {
  Input,
  Button,
  Form,
  DatePicker,
  Dropdown,
  Space,
  message,
} from "antd";
import withAuth from "@/hoc/withAuth";
import LogoutButton from "@/components/LogoutButton";
import moment from "moment";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import BottomNav from "@/components/BottomNav";
import { ADD_HABIT_URL } from "@/constants";
import AddHabitForm from "@/components/AddHabitForm";

const AddHabit = ({ user }) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState("");
  const [numDays, setNumDays] = useState(null);
  const [loading, setLoading] = useState(false);
  const [habitId, setHabitId] = useState("");
  useEffect(() => {
    if (localStorage.getItem("setHabit")) {
      setName(localStorage.getItem("setHabit"));
      localStorage.removeItem("setHabit");
    }
    if (localStorage.getItem("habitId")) {
      setHabitId(localStorage.getItem("habitId"));
      localStorage.removeItem("habitId");
    }
  }, []);

  const handleAddHabit = async () => {
    // setLoading(true);
    if (!name) {
      message.error("Enter Title");
      return;
    }
    if (moment(startDate).format("YYYY-MM-DD") == "Invalid date") {
      message.error("Enter Start Date");
      return;
    }
    if (!numDays) {
      message.error("Select number of days!");
      return;
    }

    const data = {
      name,
      userId: user.uid,
      startDate,
      endDate: endDate == "Invalid Date" ? "" : endDate,
      numDays,
      habitId,
    };

    try {
      const userId = user.uid;
      await axios.post(ADD_HABIT_URL, data);
      setName("");
      message.success("Habit added successfully!");
      setTimeout(() => {
        if (window.location.href.includes("new=true")) {
          window.location.href = "./welcome";
        } else {
          window.location.href = "./profile";
        }
      }, 1000);
    } catch (error) {
      console.error("Error adding habit:", error);
      message.error("Failed to add habit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="maxContainer">
        <div className="flex flex-col text-left ml-4 mt-4 h-[100vh] w-[100%]">
      <div className="text-xl font-bold !text-left mt-4 mb-4">
        Hello {user.displayName.split(" ")[0]},
      </div>
      <div className="text-xl font-semibold text-left mr-16 text-gray-900 border-gray mb-8">
        Let's get you started with building habits that matter.
        <br />
        <br />
        Pick from popular habits OR Create a new habit
      </div>
     <AddHabitForm
     user={user}
     name={name}
     setName={setName}
     startDate={startDate}
     setStartDate={setStartDate}
     endDate={endDate}
     setEndDate={setEndDate}
     numDays={numDays}
     setNumDays={setNumDays}
     handleAddHabit={handleAddHabit}
     loading={loading}
     />
     </div>
      <BottomNav />
    </div>
  );
};

export default withAuth(AddHabit);
