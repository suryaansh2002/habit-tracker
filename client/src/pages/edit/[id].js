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
import { useRouter } from 'next/router';
import dayjs from "dayjs";
import BottomNav from "@/components/BottomNav";

const AddHabit = ({ user }) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState("");
  const [numDays, setNumDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const arr = window.location.href.split('/')
    const id = arr[arr.length - 1]
    let url = "http://localhost:5000/"
    url = "https://habit-tracker-server.vercel.app/"
  
    if (id) {
        const fetchHabit = async () => {
          try {
            const response = await axios.get(url + `api/habit/single/${id}`);
            const habitObj = response.data
            setName(habitObj.name)
            setStartDate(habitObj.startDate)
            setEndDate(habitObj.endDate)
            setNumDays(habitObj.numDays)

          } catch (error) {
            console.error('Error fetching habit:', error);
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
      const values ={
        name,
        startDate,
        endDate,
        numDays
      }
      const arr = window.location.href.split('/')
      const id = arr[arr.length - 1]
      let url = "http://localhost:5000/"
      url = "https://habit-tracker-server.vercel.app/"
  
      const response = await axios.put(url + `api/habit/${id}`, values);
      message.success('Habit updated successfully!');
      setTimeout(()=>{
        window.location.href='../profile'
      },1000)
    } catch (error) {
      console.error('Error updating habit:', error);
      message.error('Failed to update habit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="maxContainer">
      <LogoutButton />
      <div className="flex flex-col text-center justify-center items-center h-[100vh] w-[100%]">
        <div className="text-2xl font-bold  border-b-2 border-gray mb-4">
          Update Habit
        </div>
        {name && startDate &&
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
            <div  className="text-left">Start Date:</div>
            <DatePicker
              format={"DD-MM-YYYY"}
              onChange={(val) => {
                setStartDate(dayjs(val.$d).format("YYYY-MM-DD"));
              }}
              defaultValue={dayjs(startDate)}
              className="p-2 w-[100%] my-2 mb-6"
              minDate={dayjs()}
              allowClear={false}
            />
          </div>
          <div>
            <div  className="text-left">End Date:</div>
            <DatePicker
              format={"DD-MM-YYYY"}
              onChange={(val) => {
                val ? 
                setEndDate(dayjs(val.$d).format("YYYY-MM-DD"))
                : setEndDate("")
                ;
              }}
              className="p-2 w-[100%] my-2 mb-6"
              minDate={dayjs(startDate)}
              allowClear={true}
              value={endDate ? dayjs(endDate) : ""}
            />
          </div>
          <div>
            <div  className="text-left">No. of Days Weekly:</div>
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
            onClick={()=>handleUpdateHabit()}
              className="w-[100%] bg-gray-700 text-white  p-4 text-lg py-6"
              loading={loading}
            >
              Update Habit
            </Button>
          </Form.Item>
        </Form>}
      </div>
      <BottomNav highlight={'profile'}/>
    </div>
  );
};

export default withAuth(AddHabit);
