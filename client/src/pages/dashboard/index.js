import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import withAuth from "@/hoc/withAuth";
import LogoutButton from "@/components/LogoutButton";
import BottomNav from "@/components/BottomNav";
import { DatePicker, Progress } from "antd";
import dayjs from "dayjs";
import styled from "styled-components";
import axios from "axios";
import moment from "moment";
import {
  FETCH_FILTERED_HABITS_URL,
  FETCH_MIN_START_DATE_URL,
} from "@/constants";
import CustomSpinner from "@/components/CustomSpinner";
import { DateRangePicker } from "@nextui-org/react";
import { parseDate, getLocalTimeZone, today, CalendarDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";

const StyleWrapperDatePicker = styled.div`
  .ant-picker-panel {
    &:last-child {
      width: 0;
      .ant-picker-header {
        position: absolute;
        right: 0;
        .ant-picker-header-prev-btn,
        .ant-picker-header-view {
          visibility: hidden;
        }
      }

      .ant-picker-body {
        display: none;
      }

      @media (min-width: 768px) {
        width: 280px !important;
        .ant-picker-header {
          position: relative;
          .ant-picker-header-prev-btn,
          .ant-picker-header-view {
            visibility: initial;
          }
        }

        .ant-picker-body {
          display: block;
        }
      }
    }
  }
`;

function Dashboard({ user }) {
  const [dateRange, setDateRange] = useState({
    start: parseDate(dayjs().subtract(7, "days").format("YYYY-MM-DD")),
    end: parseDate(dayjs().format("YYYY-MM-DD")),
  });
  const [habitsData, setHabitsData] = useState([]);
  const [minStartDate, setMinStartDate] = useState("");
  const [loading, setLoading] = useState(false);
  const getMinStartDate = async () => {
    const response = await axios.get(
      FETCH_MIN_START_DATE_URL + `userId=${user.uid}`
    );
    let dateString = response.data.startDate
    if(dayjs().subtract(7, "days").isBefore(dayjs(dateString))){
      setDateRange({
        start: parseDate(dayjs(dateString).format("YYYY-MM-DD")),
        end: parseDate(dayjs().format("YYYY-MM-DD")),
      })
    }
    const arr = dateString.split('-').map((item)=>Number(item))
    setMinStartDate(arr);
  };

  const getUpdatedHabits = async () => {
    setLoading(true);
    const startDate = dayjs(dateRange.start).format("YYYY-MM-DD");
    const endDate = dayjs(dateRange.end).format("YYYY-MM-DD");
    localStorage.setItem("date-range", JSON.stringify([startDate, endDate]));
    const response = await axios.get(
      FETCH_FILTERED_HABITS_URL +
        `startDate=${startDate}&endDate=${endDate}&userId=${user.uid}`
    );
    setHabitsData(response.data);
    setLoading(false);
  };

  useEffect(() => {
    let dateRangeLocal = localStorage.getItem("date-range");
    if (dateRangeLocal) {
      dateRangeLocal = JSON.parse(dateRangeLocal);
      let tempArr = {
        start: parseDate(dayjs(dateRangeLocal[0]).format("YYYY-MM-DD")),
        end: parseDate(dayjs(dateRangeLocal[1]).format("YYYY-MM-DD")),
      };
      setDateRange(tempArr);
    }
    getMinStartDate();
  }, []);
  useEffect(() => {
    getUpdatedHabits();
  }, [dateRange]);
  const panelRender = (panelNode) => (
    <StyleWrapperDatePicker>{panelNode}</StyleWrapperDatePicker>
  );
  const computePercent = (habit)=>{
   return (habit.countOfDaysDone * 100) / habit.totalDaysToDo 
  }
  const getColor = (habit) =>{
    const percent = computePercent(habit)
    const green = "#4bf542"
    const yellow = "#f5dd40"
    const red = "#e32945"
    if(percent<=30){
      return red
    }
    else if(percent>30 && percent<60){
      return yellow
    }
    else{
      return green
    }
  }
  const calcualteNumDays = (dateRange)=>{
    const startDate = moment(new Date(dateRange.start))
    const endDate = moment(new Date(dateRange.end))
    return endDate.diff(startDate, 'days') + 1
  }
  return (
    <div className="maxContainer">
      {/* <LogoutButton /> */}
      {loading ? (
        <CustomSpinner />
      ) : (
        <div className="mt-6 ml-6">
          <div className="text-2xl font-bold">
          Summary
          </div>
          {habitsData.length ? (
            <>
          <div className="text-left pt-4">
          <I18nProvider locale="en-GB">
            <DateRangePicker
              label={`Select duration (${calcualteNumDays(dateRange)} days)`}
              className="w-max text-left"
              variant={"bordered"}
              maxValue={today(getLocalTimeZone())}
              defaultValue={dateRange}
              value={dateRange}
              onChange={setDateRange}
              visibleMonths={1}
              dateFormat = {'MMM DD'}
              pageBehavior="single"
              minValue={new CalendarDate(minStartDate[0], minStartDate[1], minStartDate[2])}
            />
            
            </I18nProvider>
            {/* <div className="mt-2 text-lg">
              ({calcualteNumDays(dateRange)} days)
            </div> */}

          </div>
            <div className="mt-8 -ml-2 w-[100%] h-max pb-20 !overflow-y-auto ">
              <div className="text-gray-500 mb-2 text-right">
                target / goal Days
              </div>
              {habitsData.map((habit) => (
                <div className="mb-4 bg-gray-100 rounded-lg p-4">
                  <div className="flex justify-between">
                    <div className="font-semibold text-lg">{habit.name}</div>
                    <div className="text-sm">
                      {habit.countOfDaysDone} / {habit.totalDaysToDo} Days
                    </div>
                  </div>
                  <div>
                    <Progress
                      percent={
                        computePercent(habit)
                      }
                      format={(percent) => parseInt(percent).toString() + "%"}
                      strokeColor={getColor(habit)}
                    />
                  </div>
                </div>
              ))}
            </div>
            </>
          ) : (
            <div className="pt-12 text-left text-xl text-gray-600 w-[90%]">
              Click on the 'Track' Tab in the bottom bar to start tracking...
              <br/>
              <br/>
              And you will see your tracked habits here.
            </div>

          )}
        </div>
      )}

      <BottomNav highlight={"home"} />
    </div>
  );
}

export default withAuth(Dashboard);
