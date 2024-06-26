import React, { useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { BsPlusSquareFill, BsFillCheckSquareFill } from "react-icons/bs";
import { Button, Modal, message } from "antd";
import AddHabitForm from "./AddHabitForm";
import moment from "moment";
import { ADD_HABIT_URL, UPDATE_USER_HABIT_URL } from "@/constants";
import axios from "axios";
import EditHabitForm from "./editHabitForm";
const CustomModal = ({
  loading,
  open,
  userHabits,
  masterHabits,
  user,
  setOpen,
  currentPage,
  setCurrentPage,
  singleHabit
}) => {
  const [habitsObj, setHabitsObj] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState("");
  const [numDays, setNumDays] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [habitId, setHabitId] = useState("");  

  useEffect(() => {
    if (masterHabits.length) {
      const obj = {};
      masterHabits.map((item) => {
        if (obj[item["categoryName"]]) {
          obj[item["categoryName"]].push(item["habitName"]);
        } else {
          obj[item["categoryName"]] = [item["habitName"]];
        }
      });
      console.log(obj);
      setHabitsObj(obj);
    }
  }, [masterHabits]);

  useEffect(()=>{
    console.log(singleHabit)
    if(currentPage==2 && Object.keys(singleHabit).length){
        setName(singleHabit.name)
        setStartDate(singleHabit.startDate)
        setEndDate(singleHabit.endDate)
        setNumDays(singleHabit.numDays)
    }

  },[singleHabit, currentPage])


  const showMessage = () => {
    message.info("This habit has already been added.");
  };
  const addMasterHabit = (habit) => {
    setCurrentPage(1);
    setName(habit);
    setHabitId(habit._id)
  };
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
    if (!numDays) {
      message.error("Select number of days!");
      return;
    }

    const data = {
      name,
      userId: user.uid,
      startDate,
      endDate: endDate == "Invalid Date" ? "" : endDate,
      numDays,
      habitId
    };

    try {
      const userId = user.uid;
      await axios.post(ADD_HABIT_URL, data);
      setName("");
      message.success("Habit added successfully!");
      setTimeout(() => {
        window.location.reload()
      }, 1000);
    } catch (error) {
      console.error("Error adding habit:", error);
      message.error("Failed to add habit");
    } finally {
    //   setLoading(false);
    }
  };
  const handleEditHabit = async () => {
    setFormLoading(true);
    try {
      const values = {
        name,
        startDate,
        endDate,
        numDays,
      };
      const id = singleHabit._id;

      const response = await axios.put(UPDATE_USER_HABIT_URL + `${id}`, values);
      message.success("Habit updated successfully!");
      setTimeout(() => {
        window.location.reload()
      }, 1000);
    } catch (error) {
      console.error("Error updating habit:", error);
      message.error("Failed to update habit");
    } finally {
      setFormLoading(false);
    }
  };

const handleModalClose = ()=>{
    setCurrentPage(0)
    setName("")
    setStartDate(moment().format("YYYY-MM-DD"))
    setEndDate("")
    setNumDays(null)
}
  return (
    <>
      <Modal
        title={<></>}
        loading={loading}
        open={open}
        className="h-[100vh] overflow-y-auto  top-0 -translate-y-2 bottom-0 w-[95vw] rounded-md"
        footer={<></>}
        onCancel={() => setOpen(false)}
        afterClose={()=>handleModalClose()}
      >
        {currentPage == 0 ? (
          <div className="flex flex-col text-left ml-2 mt-4 h-[100vh] w-[100%] maxContainer">
            <div className="text-xl font-bold !text-left mt-4 mb-4">
              Hello {user.displayName.split(" ")[0]},
            </div>
            <div className="text-lg text-left mr-16 text-gray-900 border-gray mb-8">
              Pick from popular habits OR Create a new habit
            </div>
            {Object.keys(habitsObj).map((category) => (
              <>
                <div
                  className="text-lg mt-4  flex justify-between w-[95%] p-2 rounded-md bg-[#F4F4F4]"
                  onClick={() => {
                    selectedCategory == category
                      ? setSelectedCategory(null)
                      : setSelectedCategory(category);
                  }}
                >
                  {category}{" "}
                  {selectedCategory == category ? (
                    <FaAngleUp className="translate-y-1" />
                  ) : (
                    <FaAngleDown className="translate-y-1" />
                  )}
                </div>
                {selectedCategory == category &&
                  habitsObj[category].map((habit) => (
                    <div className="text-lg   flex justify-between w-[95%] p-2  bg-[#F4F4F4]">
                      {habit}
                      {userHabits.includes(habit) ? (
                        <button onClick={() => showMessage()}>
                          <BsFillCheckSquareFill className="text-2xl mr-2 text-[#FFE11D] bg-gray-800" />
                        </button>
                      ) : (
                        <button onClick={() => addMasterHabit(habit)}>
                          <BsPlusSquareFill className="text-2xl mr-2" />
                        </button>
                      )}
                    </div>
                  ))}
              </>
            ))}
            <button
              onClick={() => setCurrentPage(1)}
              className="w-[50%] rounded-md bg-[#FFE11D] text-gray-800 font-bold text-lg p-2 mt-2"
              >
              Create New Habit
            </button>
          </div>
        ) : currentPage == 1 ? (
          <div>
            <div className="flex flex-col text-left ml-4 mt-4 h-[100vh] w-[100%]">
              <div className="text-xl font-bold !text-left mt-12 mb-4">
               Create a Habit
              </div>
             
              <AddHabitForm
                user={user}
                name={name}
                setName={setName}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                numDays={numDays}
                setNumDays={setNumDays}
                handleAddHabit={handleAddHabit}
                loading={formLoading}
                Form
              />
            </div>
          </div>
        ) : currentPage == 2 ? (
            <div>
              <div className="flex flex-col text-left ml-4 mt-4 h-[100vh] w-[100%]">
                <div className="text-xl font-bold !text-left mt-12 mb-4">
                 Update Habit
                </div>
               
                <EditHabitForm
                  user={user}
                  name={name}
                  setName={setName}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  numDays={numDays}
                  setNumDays={setNumDays}
                  handleAddHabit={handleAddHabit}
                  loading={formLoading}
                  handleEditHabit={handleEditHabit}
                />
              </div>
            </div>
          ) : null}
      </Modal>
    </>
  );
};
export default CustomModal;
