import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, provider } from "../firebaseConfig";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { Button, Spin } from "antd";
import { SIGNUP_URL } from "@/constants";
import logo from '@/images/logo.png'
import Image from "next/image";
export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        localStorage.setItem("user", JSON.stringify(user));

        const { uid, displayName, email } = user;
        await axios.post(SIGNUP_URL, {
          uid,
          name: displayName,
          email,
        });

        router.push("/welcome");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        router.push("/dashboard");
      }
    });
  }, []);

  return (
    <div className="flex flex-col text-center justify-center items-center h-[100vh] w-[100%] maxContainer">
      <div>
        <Image
        src={logo}
        className="w-[8rem] mb-4"
        />
      </div>
      <div className="text-xl mb-6">
        Build Habits Towards <br/>
        A Better Life
      </div>
      <button
        type=""
        className="py-2 px-8 text-lg bg-[#FFE11D] w-[100%] mx-2"
        onClick={signInWithGoogle}
        disabled={loading}
      >
        {loading ? <Spin size="large" /> : "SIGN IN WITH GMAIL"}
      </button>
    </div>
  );
}
