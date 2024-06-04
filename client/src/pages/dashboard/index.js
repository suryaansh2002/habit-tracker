import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import withAuth from "@/hoc/withAuth";
import LogoutButton from "@/components/LogoutButton";

function Dashboard() {
  return (
    <div>
      <LogoutButton />
      <div>Welcome, to dashboard</div>
    </div>
  );
}

export default withAuth(Dashboard);
