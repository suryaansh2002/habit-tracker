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

const AddHabit = ({ user }) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState("");
  const [numDays, setNumDays] = useState(1);
  const [loading, setLoading] = useState(false);
  let url = "http://localhost:5000/"
  url = "https://habit-tracker-server.vercel.app/"

  useEffect(() => {
    if (localStorage.getItem("setHabit")) {
      setName(localStorage.getItem("setHabit"));
      localStorage.removeItem("setHabit");
    }
  }, []);
  const days = [1, 2, 3, 4, 5, 6, 7];
  const items = days.map((item) => {
    return {
      label: <div onClick={() => setNumDays(item)}>{item}</div>,
      key: `${item}`,
    };
  });

  const handleAddHabit = async () => {
    // setLoading(true);
    if(!name){
      message.error("Enter Title");
      return;
    
    }
    if (startDate == "Invalid Date") {
      message.error("Enter Start Date");
      return;
    }
    const data = {
      name,
      userId: user.uid,
      startDate,
      endDate: endDate=="Invalid Date" ? "":endDate,
      numDays
    }

    try {
      const userId = user.uid;
      await axios.post(url+"api/habit", data);
      setName("");
      message.success("Habit added successfully!");
    } catch (error) {
      console.error("Error adding habit:", error);
      message.error("Failed to add habit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <LogoutButton />
      <div className="flex flex-col text-center justify-center items-center h-[100vh] w-[100vw]">
        <div className="text-2xl font-bold  border-b-2 border-gray mb-4">
          Create a new Habit
        </div>
        <Form className="text-left ml-[10vw]  w-[90vw]">
          <Form.Item>
            <div>Title:</div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Habit Title"
              required
              className="p-2 w-[80%] my-2"
            />
          </Form.Item>
          <div>
            <div>Start Date:</div>
            <DatePicker
              format={"DD-MM-YYYY"}
              onChange={(val) => {
                setStartDate(dayjs(val.$d).format("YYYY-MM-DD"));
              }}
              defaultValue={dayjs()}
              className="p-2 w-[80%] my-2 mb-6"
              minDate={dayjs()}
              allowClear={false}
            />
          </div>
          <div>
            <div>End Date:</div>
            <DatePicker
              format={"DD-MM-YYYY"}
              onChange={(val) => {
                setEndDate(dayjs(val.$d).format("YYYY-MM-DD"));
              }}
              className="p-2 w-[80%] my-2 mb-6"
              minDate={dayjs(startDate)}
              allowClear={false}
            />
          </div>
          <div>
            <div>No. of Days Weekly:</div>
            <Dropdown menu={{ items }} className="w-[80%] mb-4 ">
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
            onClick={()=>handleAddHabit()}
              className="w-[80%] bg-gray-700 text-white  p-4 text-lg py-6"
              loading={loading}
            >
              Add Habit
            </Button>
          </Form.Item>
        </Form>
      </div>
      <BottomNav/>
    </div>
  );
};

export default withAuth(AddHabit);
