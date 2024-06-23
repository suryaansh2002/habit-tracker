import React from "react";

export default function BottomNav({ highlight }) {
  return (
    <div className="fixed bottom-0  w-[100%] flex bg-white justify-around border-t-4  h-[4rem] text-black">
      <a href="/dashboard">
        <div
          className={`text-sm w-[33vw] md:w-[166px] text-center p-2 py-4 my-2 rounded-lg`}
          style={
            highlight == "home" ? { fontWeight:'bold', fontSize:'1.05rem' } : {}
          }
        >
          Home
        </div>
      </a>
      <a href="/track">
        <div
          className={`text-sm w-[33vw] md:w-[166px] text-center p-2 py-4 my-2 rounded-lg`}
          style={
            highlight == "track" ? { fontWeight:'bold', fontSize:'1.05rem' } : {}
          }
        >
          Track
        </div>
      </a>
      <a href="/profile">
        <div
          className={`text-sm w-[33vw] md:w-[166px] text-center p-2 py-4 my-2 rounded-lg`}
          style={
            highlight == "profile"
              ? { fontWeight:'bold', fontSize:'1.05rem' }
              : {}
          }
        >
          Profile
        </div>
      </a>
    </div>
  );
}
