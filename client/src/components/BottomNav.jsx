import Image from "next/image";
import React from "react";

export default function BottomNav({ highlight }) {
  return (
    <div className="fixed bottom-0  w-[100%] flex bg-white justify-around border-t-4  h-[4rem] text-black">
      <a href="/dashboard">
        <div
          className={`text-sm w-[33vw] md:w-[166px] text-center p-2 py-4 my-2 rounded-lg`}
          style={
            highlight == "home"
              ? { fontWeight: "bold", fontSize: "1.05rem" }
              : {}
          }
        >
          <div className="text-center">
            <Image
              src={highlight == "home" ? "/home.svg" : "/home_light.svg"}
              alt="Description of the image"
              width={40}
              height={40}
              className="ml-[50%] -translate-x-[50%] -translate-y-4 -mb-4"
            />
          </div>
          Home
        </div>
      </a>
      <a href="/track">
        <div
          className={`text-sm w-[33vw] md:w-[166px] text-center p-2 py-4 my-2 rounded-lg`}
          style={
            highlight == "track"
              ? { fontWeight: "bold", fontSize: "1.05rem" }
              : {}
          }
        >
          <div>
          <Image
              src={highlight == "track" ? "/track.svg" : "/track_light.svg"}
              alt="Description of the image"
              width={40}
              height={40}
              className="ml-[50%] -translate-x-[50%] -translate-y-4 -mb-4"
            />

          </div>
          Track
        </div>
      </a>
      <a href="/profile">
        <div
          className={`text-sm w-[33vw] md:w-[166px] text-center p-2 py-4 my-2 rounded-lg`}
          style={
            highlight == "profile"
              ? { fontWeight: "bold", fontSize: "1.05rem" }
              : {}
          }
        >
             <div>
          <Image
              src={highlight == "profile" ? "/habits.svg" : "/habits_light.svg"}
              alt="Description of the image"
              width={40}
              height={40}
              className="ml-[50%] -translate-x-[50%] -translate-y-4 -mb-4"
            />

          </div>
          Habits
        </div>
      </a>
    </div>
  );
}
