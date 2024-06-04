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
    <Button
      type="primary"
      className="absolute top-4 right-4 text-lg p-4"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
