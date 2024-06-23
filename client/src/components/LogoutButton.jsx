// client/components/LogoutButton.js

import { Button } from "antd";
import { useRouter } from "next/router";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("user");
        router.push("/");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <div
      type=""
      className="text-xl text-left w-[90%]"
      onClick={handleLogout}
    >
      Logout
    </div>
  );
};

export default LogoutButton;
