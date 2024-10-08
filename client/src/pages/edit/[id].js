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
import { useRouter } from "next/router";
import dayjs from "dayjs";
import BottomNav from "@/components/BottomNav";
import { FETCH_SIGNLE_HABIT_URL, UPDATE_USER_HABIT_URL } from "@/constants";
import CustomSpinner from "@/components/CustomSpinner";

const AddHabit = ({ user }) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState("");
  const [numDays, setNumDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const arr = window.location.href.split("/");
    const id = arr[arr.length - 1];

    if (id) {
      const fetchHabit = async () => {
        try {
          setLoading2(true);
          const response = await axios.get(FETCH_SIGNLE_HABIT_URL + `${id}`);
          const habitObj = response.data;
          setName(habitObj.name);
          setStartDate(habitObj.startDate);
          setEndDate(habitObj.endDate);
          setNumDays(habitObj.numDays);
          setLoading2(false);
        } catch (error) {
          console.error("Error fetching habit:", error);
          setLoading2(false);
        }
      };

      fetchHabit();
    }
  }, []);
  const days = [1, 2, 3, 4, 5, 6, 7];
  const items = days.map((item) => {
    return {
      label: <div onClick={() => setNumDays(item)}>{item}</div>,
      key: `${item}`,
    };
  });

  const handleUpdateHabit = async () => {
    setLoading(true);
    try {
      const values = {
        name,
        startDate,
        endDate,
        numDays,
      };
      const arr = window.location.href.split("/");
      const id = arr[arr.length - 1];

      const response = await axios.put(UPDATE_USER_HABIT_URL + `${id}`, values);
      message.success("Habit updated successfully!");
      setTimeout(() => {
        window.location.href = "../profile";
      }, 1000);
    } catch (error) {
      console.error("Error updating habit:", error);
      message.error("Failed to update habit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="maxContainer">
      {/* <LogoutButton /> */}
      {loading2 ? (
        <CustomSpinner />
      ) : (
        <div className="flex flex-col text-center justify-center items-center h-[100vh] w-[100%]">
          <div className="text-2xl font-bold  border-b-2 border-gray mb-4">
            Update Habit
          </div>
          {name && startDate && (
            <Form className="text-center w-[70%]">
              <Form.Item>
                <div className="text-left">Title:</div>
                <Input
                  value={name}
                  defaultValue={name}
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
                  defaultValue={dayjs(startDate)}
                  className="p-2 w-[100%] my-2 mb-6"
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
                  onClick={() => handleUpdateHabit()}
                  className="w-[100%] bg-gray-700 text-white  p-4 text-lg py-6"
                  loading={loading}
                >
                  Update Habit
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>
      )}
      <BottomNav highlight={"profile"} />
    </div>
  );
};

export default withAuth(AddHabit);
