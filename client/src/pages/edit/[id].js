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

    if (id) {
        const fetchHabit = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/api/habit/single/${id}`);
            console.log(response.data)
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
      console.log(values)
      const arr = window.location.href.split('/')
      const id = arr[arr.length - 1]
    
      const response = await axios.put(`http://localhost:5000/api/habit/${id}`, values);
      console.log(response.data)
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
    <div className="container mx-auto p-4">
      <LogoutButton />
      <div className="flex flex-col text-center justify-center items-center h-[100vh] w-[100vw]">
        <div className="text-2xl font-bold  border-b-2 border-gray mb-4">
          Update Habit
        </div>
        {name && startDate && endDate && <Form className="text-left ml-[10vw]  w-[90vw]">
          <Form.Item>
            <div>Title:</div>
            <Input
              value={name}
              defaultValue={name}
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
                setStartDate(moment(val.$d).format("YYYY-MM-DD"));
              }}
              defaultValue={moment(startDate)}
              className="p-2 w-[80%] my-2 mb-6"
            />
          </div>
          <div>
            <div>End Date:</div>
            <DatePicker
              format={"DD-MM-YYYY"}
              onChange={(val) => {
                console.log(val)
                console.log(moment(val.$d).format("YYYY-MM-DD"))
                setEndDate(moment(val.$d).format("YYYY-MM-DD"));
              }}
              defaultValue={moment(endDate)}
              className="p-2 w-[80%] my-2 mb-6"
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
            onClick={()=>handleUpdateHabit()}
              className="w-[80%] bg-gray-700 text-white  p-4 text-lg py-6"
              loading={loading}
            >
              Update Habit
            </Button>
          </Form.Item>
        </Form>}
      </div>
    </div>
  );
};

export default withAuth(AddHabit);
