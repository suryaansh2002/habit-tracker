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
  return (
    <div className="maxContainer">
      {/* <LogoutButton /> */}
      {loading ? (
        <CustomSpinner />
      ) : (
        <div>
          <div className="text-center pt-16">
            {/* <DatePicker.RangePicker
              // panelRender={panelRender}
              defaultValue={dateRange}
              onChange={(e) => setDateRange(e)}
              allowClear={false}
              maxDate={dayjs()}
              minDate={dayjs(minStartDate)}
            /> */}

            <DateRangePicker
              label="Select duration"
              className="max-w-xs text-left ml-[50%] -translate-x-[50%]"
              variant={"faded"}
              maxValue={today(getLocalTimeZone())}
              defaultValue={dateRange}
              value={dateRange}
              onChange={setDateRange}
              visibleMonths={1}
              pageBehavior="single"
              minValue={new CalendarDate(minStartDate[0], minStartDate[1], minStartDate[2])}
              // disabledDates={(date) => {
              //   return [
              //     [parseDate("0001-01-01"), parseDate(minStartDate).add({ days: -1 })], // Disables all days before the specific date
              //   ].some(
              //     ([start, end]) =>
              //       date.compare(start) >= 0 && date.compare(end) <= 0
              //   );
              // }}
            />
          </div>
          {habitsData.length ? (
            <div className="mt-8 mx-6 h-max pb-12 !overflow-y-auto ">
              {habitsData.map((habit) => (
                <div className="mb-8 bg-yellow-100 rounded-lg p-4">
                  <div className="flex justify-between">
                    <div className="font-semibold text-xl">{habit.name}</div>
                    <div>
                      {habit.countOfDaysDone} / {habit.totalDaysToDo} Days
                    </div>
                  </div>
                  <div>
                    <Progress
                      percent={
                        (habit.countOfDaysDone * 100) / habit.totalDaysToDo
                      }
                      format={(percent) => parseInt(percent).toString() + "%"}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="pt-12 text-lf text-center">
              No data yet! Begin Tracking your habits here:{" "}
              <a href="/track" className="font-bold">
                Track
              </a>{" "}
              and add new habits to track here:{" "}
              <a href="/profile" className="font-bold">
                Profile
              </a>
            </div>
          )}
        </div>
      )}

      <BottomNav highlight={"home"} />
    </div>
  );
}

export default withAuth(Dashboard);
