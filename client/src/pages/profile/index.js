import { useEffect, useState } from "react";
import axios from "axios";
import { List, Typography, Button } from "antd";
import withAuth from "@/hoc/withAuth";
import LogoutButton from "@/components/LogoutButton";
import moment from "moment";
import BottomNav from "@/components/BottomNav";
import { useRouter } from "next/router";
import { FETCH_ALL_MASTER_HABITS_URL, FETCH_USER_HABITS_URL } from "@/constants";
import CustomSpinner from "@/components/CustomSpinner";
import CustomModal from "@/components/CustomModal";

const Profile = ({ user }) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [masterHabits, setMasterHabits] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [singleHabit, setSingleHabit]=useState({})
 
  
  const router = useRouter();
  
  const fetchMasterHabits = async () => {
    try {
      setModalLoading(true);
      const response = await axios.get(FETCH_ALL_MASTER_HABITS_URL);
      setMasterHabits(response.data);
      setModalLoading(false);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const handleEdit = (h)=>{
    setSingleHabit(h)
    setCurrentPage(2)
    setOpen(true)
  }


const addNewHabit=()=>{
  setOpen(true)
  fetchMasterHabits();
}
  useEffect(() => {
    const fetchHabits = async () => {
      setLoading(true);
      try {
        const response = await axios.get(FETCH_USER_HABITS_URL + `${user.uid}`);
        setHabits(response.data);
      } catch (error) {
        console.error("Error fetching habits:", error);
      }
      setLoading(false);
    };

    fetchHabits();
  }, [user.uid]);

  return (
    <div className="maxContainer">
      {/* <LogoutButton /> */}
      {loading ? (
        <CustomSpinner />
      ) : (
        <div className="flex flex-col text-left ml-6 h-max pt-8 w-[100%]">
          <div className="text-2xl !text-left font-bold mb-2 text-gray-600">
            {" "}
            Hello {user.displayName.split(" ")[0]},
          </div>

          <div className="text-xl font-bold mt-8 mb-2 text-gray-800">
          My Habits
          </div>
          {habits.map((habit) => (
            <div className="rounded-lg p-4 bg-gray-100 w-[90%] flex flex-row justify-between my-1">
              <div className="text-left">
                <div className="text-lg ">{habit.name}</div>
                {/* <div className="text-xs">
                  {moment(habit.startDate).format("DD MMM YY")}-{" "}
                  {moment(habit.endDate).format("DD MMM YY") != "Invalid date"
                    ? moment(habit.endDate).format("DD MMM YY")
                    : "No End Date"}
                </div> */}
                {/* <div className="text-xs mt-2">
                  {habit.numDays} days per week
                  </div> */}
              </div>

              <div>
                <a className="text-sm mb-3" onClick={()=>handleEdit(habit)}>Edit</a> <br/>
              </div>
            </div>
          ))}
          <button
            onClick={() => addNewHabit()}
            className="w-[50%] rounded-md bg-[#FFE11D] text-gray-800 font-bold text-lg p-2 mt-2"
          >
            Add More Habits
          </button>
          <div className="border-t-4 border-gray-100 my-4 mr-6">
            </div>
            <div className="font-bold text-xl">
              My Email:
              </div>
          <div className="text-xl mb-8"> {user.email}</div>
          <LogoutButton />
          <div className="mb-20">
            </div>
        </div>
      )}
      <CustomModal
      loading={modalLoading}
      userHabits={habits.map((h)=>h.name)}
      masterHabits={masterHabits}
      user={user}
      open={open}
      setOpen={setOpen}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      singleHabit={singleHabit}
      />
      <BottomNav highlight={"profile"} />
    </div>
  );
};

export default withAuth(Profile);
