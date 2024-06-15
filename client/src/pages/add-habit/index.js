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

const AddHabit = ({ user }) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState("");
  const [numDays, setNumDays] = useState("Select...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("setHabit")) {
      setName(localStorage.getItem("setHabit"));
      localStorage.removeItem("setHabit");
    }
  }, []);
  const days = ["Select...", 1, 2, 3, 4, 5, 6, 7];
  const items = days.map((item) => {
    return {
      label: <div onClick={() => setNumDays(item)}>{item}</div>,
      key: `${item}`,
    };
  });

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
    if (numDays === "Select...") {
      message.error("Select number of days!");
      return;
    }

    const data = {
      name,
      userId: user.uid,
      startDate,
      endDate: endDate == "Invalid Date" ? "" : endDate,
      numDays,
    };

    try {
      const userId = user.uid;
      await axios.post(ADD_HABIT_URL, data);
      setName("");
      message.success("Habit added successfully!");
      setTimeout(() => {
        window.location.href = "./profile";
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
      {/* <LogoutButton /> */}
      <div className="flex flex-col text-center justify-center items-center h-[100vh] w-[100%]">
        <div className="text-2xl font-bold  border-b-2 border-gray mb-4">
          Create a new Habit
        </div>
        <Form className="text-center w-[70%]">
          <Form.Item>
            <div className="text-left">Title:</div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Habit Title"
              required
              className="p-2 w-[100%] my-2"
            />
          </Form.Item>
          <div>
            <div className="text-left">Start Date:</div>
            <DatePicker
              format={"DD-MM-YYYY"}
              onChange={(val) => {
                setStartDate(dayjs(val.$d).format("YYYY-MM-DD"));
              }}
              defaultValue={dayjs()}
              className="p-2 w-[100%] my-2 mb-6"
              minDate={dayjs()}
              allowClear={false}
            />
          </div>
          <div>
            <div className="text-left">End Date:</div>
            <DatePicker
              format={"DD-MM-YYYY"}
              onChange={(val) => {
                setEndDate(dayjs(val.$d).format("YYYY-MM-DD"));
              }}
              className="p-2 w-[100%] my-2 mb-6"
              minDate={dayjs(startDate)}
              allowClear={false}
            />
          </div>
          <div>
            <div className="text-left">No. of Days Weekly:</div>
            <Dropdown menu={{ items }} className="w-[100%] mb-4 ">
              <Button className="text-left">
                <Space className="absolute left-4 w-[90%] flex justify-between">
                  {numDays}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>
          <Form.Item>
            <Button
              onClick={() => handleAddHabit()}
              className="w-[100%] bg-gray-700 text-white  p-4 text-lg py-6"
              loading={loading}
            >
              Add Habit
            </Button>
          </Form.Item>
        </Form>
      </div>
      <BottomNav />
    </div>
  );
};

export default withAuth(AddHabit);
