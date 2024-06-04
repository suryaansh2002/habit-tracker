import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import withAuth from "@/hoc/withAuth";
import LogoutButton from "@/components/LogoutButton";
import { Button, Card } from "antd";

function Welcome({user}) {
    const habitOptions = [
        'Drink Water',
        'Go For a Jog',
        'Eat Healthy'
    ]
    const router = useRouter();

    const addHabit = (setHabit) =>{
        if(setHabit){
            localStorage.setItem('setHabit', setHabit)
        }
        router.push('/add-habit')
    }
  return (
    <div>
      <LogoutButton />
      <div className="flex flex-col text-center justify-center items-center h-[100vh] w-[100vw]">
            <div className="text-xl font-semibold  border-b-2 border-gray mb-4">
                Welcome {user.displayName.split(' ')[0]}
            </div>
            <div className="mb-4">
                Add Habit Your First Habit!
            </div>
            {
                habitOptions.map((habit)=>
                    <Card className="text-lg mb-4 w-[15rem]" onClick={()=>addHabit(habit)}>
                       {habit}
                    </Card>
                )
            }
            <Button onClick={()=>addHabit()} className="w-[15rem] p-4 text-lg py-6">
                Add a Custom Habit
            </Button>
      </div>
    </div>
  );
}

export default withAuth(Welcome);
