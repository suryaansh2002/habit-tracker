import withAuth from "@/hoc/withAuth";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, DatePicker, Switch } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import BottomNav from "@/components/BottomNav";

const Home = ({ user }) => {
  const [habits, setHabits] = useState([]);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [openHabits, setOpenHabits] = useState([]);
  let url = "http://localhost:5000/"
  url = "https://habit-tracker-server.vercel.app/"

  const fetchHabits = async () => {
    try {
      const response = await axios.get(
        `api/habit/${user.uid}`
      );
      setHabits(response.data);
      const openHabits = response.data.filter((habit) => {
        let isOpen = false;
        if (moment(date).isSameOrAfter(moment(habit.startDate))) {
          console.log(habit.name)
          if (habit.endDate) {
            if (moment(date).isSameOrBefore(moment(habit.endDate))) {
              isOpen = true;
            }
          } else {
            isOpen = true;
          }
        }
        return isOpen;
      });
      console.log(openHabits);
      setOpenHabits(openHabits);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [date]);

  const handleChange = async (checked, id) => {
    console.log(checked, id);
    const selectedHabit = habits.find((item) => item._id == id);
    console.log(selectedHabit);
    let tempDaysDone = selectedHabit.daysDone;
    if (checked) {
      tempDaysDone.push(date);
    } else {
      tempDaysDone = tempDaysDone.filter((d) => d != date);
    }
    const response = await axios.put(url + `api/habit/${id}`, {
      daysDone: tempDaysDone,
    });
    console.log(response.data);
    fetchHabits();
  };
  return (
    <div>
      <Card className="w-[100vw] absolute top-0 text-right">
        <DatePicker
          value={dayjs(date)}
          onChange={(val) => {
            val
              ? setDate(dayjs(val.$d).format("YYYY-MM-DD"))
              : setDate(dayjs().format("YYYY-MM-DD"));
          }}
          maxDate={dayjs()}
          allowClear={false}
        />

        <div className="text-center font-semibold mt-4 -mb-4">
          Make Entries for {date}
        </div>
        <div className="flex flex-col text-center justify-center items-center h-[100vh] w-[100vw]">
          {openHabits.map((habit) => (
            <Card className="w-[90%] -ml-8 my-2 text-md text-left font-semibold flex flex-row justify-between">
              <div className="inline-block w-[60vw]">{habit.name}</div>
              <div className="inline-block">
                <Switch
                  checked={habit.daysDone.includes(date)}
                  onChange={(checked) => handleChange(checked, habit._id)}
                />
              </div>
            </Card>
          ))}
        </div>
      </Card>
      <BottomNav/>
    </div>
  );
};

export default withAuth(Home);
