import "@/styles/globals.css";
// import 'antd/dist/antd.css';
import "../styles/globals.css";
import Head from "next/head";
// pages/_app.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { analytics, logEvent } from "../firebaseConfig";
import { NextUIProvider } from "@nextui-org/react";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && analytics) {
      router.events.on("routeChangeComplete", (url) => {
        logEvent(analytics, "page_view", { page_path: url });
      });
    }
  }, [router.events]);

  return (
    <>
      <NextUIProvider>
        <Head>
          <title>Habit Tracker</title>
        </Head>
        <Component {...pageProps} />
      </NextUIProvider>
    </>
  );
}

export default MyApp;
