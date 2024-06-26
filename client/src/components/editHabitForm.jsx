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
export default function EditHabitForm({
  user,
  name,
  setName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  numDays,
  setNumDays,
  handleEditHabit,
  loading,
}) {
  const days = [1, 2, 3, 4, 5, 6, 7];

  return (
    <Form
      className={
        window.location.href.includes("profile")
          ? "text-center -ml-[5%] w-[100%] bg-[#F4F4F4] p-4"
          : "text-center w-[80%] bg-[#F4F4F4] p-4"
      }
    >
      <Form.Item>
        {/* <div className="text-left">Title:</div> */}
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Habit Title"
          required
          className="p-2 text-base w-[100%] my-2"
        />
      </Form.Item>
      <div>
        <div className="text-left">Start Date:</div>
        <DatePicker
          onChange={(val) => {
            setStartDate(dayjs(val.$d).format("YYYY-MM-DD"));
          }}
          defaultValue={dayjs(startDate)}
          className="p-2 w-[100%] my-2 mb-6 text-base"
          minDate={dayjs()}
          allowClear={false}
          disabled={dayjs(startDate).isBefore(dayjs())}
        />
      </div>
      <div>
        <div className="text-left">End Date:</div>
        <DatePicker
          format={"DD-MM-YYYY"}
          onChange={(val) => {
            val
              ? setEndDate(dayjs(val.$d).format("YYYY-MM-DD"))
              : setEndDate("");
          }}
          className="p-2 w-[100%] my-2 mb-6"
          minDate={dayjs(startDate)}
          allowClear={true}
          value={endDate ? dayjs(endDate) : ""}
        />
      </div>
      <div>
        <div className="text-left"># of Days Weekly:</div>
        <div className="flex justify-between mt-2 mb-4">
          {days.map((day) => (
            <button
              className={
                numDays == day
                  ? `bg-black rounded-full text-white w-[2rem] h-[2rem] scale-125 duration-250`
                  : `bg-gray-400  duration-250 rounded-full text-white w-[2rem] h-[2rem]`
              }
              onClick={() => {
                numDays == day ? setNumDays(null) : setNumDays(day);
              }}
            >
              {day}
            </button>
          ))}
        </div>
        {/* <Dropdown menu={{ items }} className="w-[100%] mb-4 ">
      <Button className="text-left">
        <Space className="absolute left-4 w-[90%] flex justify-between">
          {numDays}
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown> */}
      </div>
      <Form.Item className="text-left my-8">
        <button
          onClick={() => handleEditHabit()}
          className="w-[50%] rounded-md bg-[#FFE11D] text-gray-800 font-semibold text-lg p-2 mt-2"
          loading={loading}
        >
          Update
        </button>
      </Form.Item>
    </Form>
  );
}
