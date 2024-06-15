import withAuth from "@/hoc/withAuth";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, DatePicker, Switch } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import BottomNav from "@/components/BottomNav";
import LogoutButton from "@/components/LogoutButton";
import { analytics, logEvent } from '../../firebaseConfig';

const Home = ({ user }) => {
  const [habits, setHabits] = useState([]);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [openHabits, setOpenHabits] = useState([]);
  const [activeHabits, setActiveHabits] = useState([])
  const [minStartDate, setMinStartDate] = useState('')

  let url = "http://localhost:5000/"
  url = "https://habit-tracker-server.vercel.app/"

  const getMinStartDate = async() =>{
    const response = await axios.get(url + `api/habit/startDate?userId=${user.uid}`)
    setMinStartDate(response.data.startDate)
  }
  const fetchInitialHabits = async () => {
    try {
      const response = await axios.get(
        url + 
        `api/habit/${user.uid}`
      );
      setHabits(response.data);
      const openHabits = response.data.filter((habit) => {
        let isOpen = false;
        if (moment(date).isSameOrAfter(moment(habit.startDate))) {
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
      const tempActiveHabits = openHabits.filter((item)=>item.daysDone.includes(date)).map((item)=>item._id)
      setActiveHabits(tempActiveHabits)
      setOpenHabits(openHabits);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };


  const fetchHabits = async () => {
    try {
      const response = await axios.get(
        url + 
        `api/habit/${user.uid}`
      );
      setHabits(response.data);
      const openHabits = response.data.filter((habit) => {
        let isOpen = false;
        if (moment(date).isSameOrAfter(moment(habit.startDate))) {
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
      setOpenHabits(openHabits);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  useEffect(() => {
    fetchInitialHabits();
    getMinStartDate();
  }, []);

  useEffect(() => {
    fetchInitialHabits();
  }, [date]);

  const handleChange = async (checked, id) => {
    const selectedHabit = habits.find((item) => item._id == id);
    let tempDaysDone = selectedHabit.daysDone;
    let tempActiveHabits = [...activeHabits]
    if (checked) {
      tempActiveHabits.push(id)
      tempDaysDone.push(date);
    } else {
      tempActiveHabits = tempActiveHabits.filter((item)=>item!=id)
      tempDaysDone = tempDaysDone.filter((d) => d != date);
    }
    setActiveHabits(tempActiveHabits)
    const response = await axios.put(url + `api/habit/${id}`, {
      daysDone: tempDaysDone,
    });
    if (typeof window !== 'undefined' && analytics) {
      console.log("HERE")
      console.log({ habit_name: selectedHabit.name, done: checked, habit_id: id })
      const response = logEvent(analytics, 'track_habit', { habit_name: selectedHabit.name, done: checked, habit_id: id });
      console.log(response)
    }
  
    fetchHabits();
  };
  return (
    <div className="maxContainer">
      {/* <LogoutButton/> */}
      <Card className="w-[100%] text-left">
      
        <div className="text-center text-lg  mt-16 -mb-4">
          Make Entries for  &nbsp; <DatePicker
          value={dayjs(date)}
          onChange={(val) => {
            val
              ? setDate(dayjs(val.$d).format("YYYY-MM-DD"))
              : setDate(dayjs().format("YYYY-MM-DD"));
          }}
          maxDate={dayjs()}
          allowClear={false}
          minDate={dayjs(minStartDate)}
        />

        </div>
        {openHabits.length ? <div className="flex flex-col text-center mt-12 justify-center align-middle w-[100%]">
          {openHabits.map((habit) => (
            <Card className="w-[90%] ml-[5%] my-2 text-md text-left font-semibold">
              <div className="flex flex-row justify-between">

              <div className="">{habit.name}</div>
              <div className="">
                <Switch
                  checked={activeHabits.includes(habit._id)}
                  onChange={(checked) => handleChange(checked, habit._id)}
                />
              </div>
              </div>
            </Card>
          ))}
        </div>: 
        <div className="pt-12 text-lf text-center">
        No habits for this date! Select a different date or add new habits to track here: <a href="/profile" className="font-bold">Profile</a>
        </div>
        }
      </Card>
      <BottomNav highlight={'track'}/>
    </div>
  );
};

export default withAuth(Home);
