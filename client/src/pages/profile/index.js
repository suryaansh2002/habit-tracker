import { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Typography } from 'antd';
import withAuth from '@/hoc/withAuth';
import LogoutButton from '@/components/LogoutButton';
import moment from 'moment';

const Profile = ({ user }) => {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/habit/${user.uid}`);
        setHabits(response.data);
      } catch (error) {
        console.error('Error fetching habits:', error);
      }
    };

    fetchHabits();
  }, [user.uid]);

  return (
    <div className="container mx-auto p-4">
      <LogoutButton />
      <div className="flex flex-col text-center justify-center items-center h-[100vh] w-[100vw]">

      <div className='text-2xl font-bold mb-8'> {user.displayName}</div>
      {
        habits.map((habit)=>
        <div className='rounded-lg p-6 shadow-lg w-[90vw] flex flex-row justify-between my-2'>
            <div className='text-left'>
                <div className='text-lg '>
                    {habit.name}
                    </div>
                    <div className='text-xs'>
                        {moment(habit.startDate).format('DD MMM YY')}- {moment(habit.endDate).format('DD MMM YY')}
                        </div>
            </div>
            <div>
                <a href={`/edit/${habit._id}`}>

                Edit
                </a>
            </div>
        </div>
        )
      }
    </div>
    </div>

  );
};

export default withAuth(Profile);
