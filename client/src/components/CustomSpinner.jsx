import { Spin } from "antd";
import React from "react";

export default function CustomSpinner() {
  const loadingMsgs = [
    "Successful peopler are simply those with successful habits",
    "If you want to change the world, start with cultivating good habits",
    "Your today's habits will determine your future",
  ];
  return (
    <div className="flex flex-col justify-center items-center h-[90vh] w-[100%]">
      <div className="text-gray-600 mb-4 text-center w-[80%] text-lg">

{loadingMsgs[Math.floor(Math.random() * loadingMsgs.length)]}
</div>
<div>
      <Spin size="large" />
      </div>
    </div>
  );
}
