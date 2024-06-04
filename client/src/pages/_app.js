import "@/styles/globals.css";
// import 'antd/dist/antd.css';
import "../styles/globals.css";
import Head from "next/head";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Habit Tracker</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
