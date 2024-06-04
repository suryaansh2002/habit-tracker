import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth, provider } from "../firebaseConfig";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { Button } from "antd";

export default function Home() {
  const router = useRouter();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        localStorage.setItem("user", JSON.stringify(user));

        const { uid, displayName, email } = user;
        await axios.post("http://localhost:5000/api/user", {
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
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      }
    });
  }, []);

  return (
    <div className="flex text-center justify-center items-center h-[100vh] w-[100vw]">
      <Button
        type="primary"
        className="py-6 px-8 text-lg"
        onClick={signInWithGoogle}
      >
        Sign in with Google
      </Button>
    </div>
  );
}
