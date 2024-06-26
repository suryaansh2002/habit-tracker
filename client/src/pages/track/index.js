import withAuth from "@/hoc/withAuth";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Switch } from "antd";
import moment, { min } from "moment";
import dayjs from "dayjs";
import BottomNav from "@/components/BottomNav";
import LogoutButton from "@/components/LogoutButton";
import { analytics, logEvent } from "../../firebaseConfig";
import {
  FETCH_MIN_START_DATE_URL,
  FETCH_USER_HABITS_URL,
  UPDATE_USER_HABIT_URL,
} from "@/constants";
import CustomSpinner from "@/components/CustomSpinner";
import {DatePicker} from "@nextui-org/react";
import { parseDate, getLocalTimeZone, today, CalendarDate } from "@internationalized/date";
import {useDateFormatter} from "@react-aria/i18n";
import { I18nProvider } from "@react-aria/i18n";

const Home = ({ user }) => {
  const [habits, setHabits] = useState([]);
  const [date, setDate] = React.useState(parseDate(dayjs().format("YYYY-MM-DD")));
  const [openHabits, setOpenHabits] = useState([]);
  const [activeHabits, setActiveHabits] = useState([]);
  const [minStartDate, setMinStartDate] = useState("");
  const [loading, setLoading] = useState(false);
  const getMinStartDate = async () => {
    const response = await axios.get(
      FETCH_MIN_START_DATE_URL + `userId=${user.uid}`,
    );
    let dateString = response.data.startDate
    const arr = dateString.split('-').map((item)=>Number(item))
    setMinStartDate(arr);
  };
  const fetchInitialHabits = async () => {
    setLoading(true);
    let formattedDate  =  moment(new Date(date)).format('YYYY-MM-DD')
    try {
      const response = await axios.get(FETCH_USER_HABITS_URL + `${user.uid}`);
      setHabits(response.data);
      const openHabits = response.data.filter((habit) => {
        let isOpen = false;
        if (moment(new Date(date)).isSameOrAfter(moment(habit.startDate))) {
          if (habit.endDate) {
            if (moment(new Date(date)).isSameOrBefore(moment(habit.endDate))) {
              isOpen = true;
            }
          } else {
            isOpen = true;
          }
        }
        return isOpen;
      });
      console.log(openHabits)
      const tempActiveHabits = openHabits
        .filter((item) => item.daysDone.includes(moment(new Date(date)).format('YYYY-MM-DD')))
        .map((item) => item._id);
      setActiveHabits(tempActiveHabits);
      setOpenHabits(openHabits);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
    setLoading(false);
  };

  const fetchHabits = async () => {
    try {
      const response = await axios.get(FETCH_USER_HABITS_URL + `${user.uid}`);
      setHabits(response.data);
      const openHabits = response.data.filter((habit) => {
        let isOpen = false;
        if (moment(new Date(date)).isSameOrAfter(moment(habit.startDate))) {
          if (habit.endDate) {
            if (moment(new Date(date)).isSameOrBefore(moment(habit.endDate))) {
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
    let tempActiveHabits = [...activeHabits];
    let formattedDate = moment(new Date(date)).format('YYYY-MM-DD')
    if (checked) {
      tempActiveHabits.push(id);
      tempDaysDone.push(formattedDate);
    } else {
      tempActiveHabits = tempActiveHabits.filter((item) => item != id);
      tempDaysDone = tempDaysDone.filter((d) => d != formattedDate);
    }
    setActiveHabits(tempActiveHabits);
    const response = await axios.put(UPDATE_USER_HABIT_URL + `${id}`, {
      daysDone: tempDaysDone,
    });
    console.log(response.data)
    fetchHabits();
  };
  return (
    <div className="maxContainer">
      {/* <LogoutButton/> */}
      {loading ? (
        <CustomSpinner />
      ) : (
        <Card className="w-[100%] pb-20 text-left border-0">
           <div className="text-2xl font-bold text-gray-600">
          Track
          </div>
          <div className="text-left text-lg  mt-8 -mb-4">
          <I18nProvider locale="en-GB">
            <DatePicker
                          label={"Select Date"} 
            className="w-max"
            value={date} onChange={setDate}
            maxValue={today(getLocalTimeZone())}
            minValue={new CalendarDate(minStartDate[0], minStartDate[1], minStartDate[2])}

            />
            </I18nProvider>
            {/* <DatePicker
              value={dayjs(date)}
              onChange={(val) => {
                val
                  ? setDate(dayjs(val.$d).format("YYYY-MM-DD"))
                  : setDate(dayjs().format("YYYY-MM-DD"));
              }}
              className="w-max text-xl"
              maxDate={dayjs()}
              allowClear={false}
              minDate={dayjs(minStartDate)}
              format={'DD MMM'}
            /> */}
          </div>
          {openHabits.length ? (
            <div className="flex flex-col text-center mt-12 justify-center align-middle w-[100%]">
              {openHabits.map((habit) => (
                <Card className="w-[100%] my-1 bg-gray-100 text-lg text-left">
                  <div className="flex flex-row justify-between">
                    <div className="">{habit.name}</div>
                    <div className="">
                      <Switch
                        checked={activeHabits.includes(habit._id)}
                        className="w-[3rem] text-green-400"
                        onChange={(checked) => handleChange(checked, habit._id)}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="pt-12 text-lf text-center">
              No habits for this date! Select a different date or add new habits
              to track here:{" "}
              <a href="/profile" className="font-bold">
                Profile
              </a>
            </div>
          )}
        </Card>
      )}
      <BottomNav highlight={"track"} />
    </div>
  );
};

export default withAuth(Home);
