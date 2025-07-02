import React from "react";
import { LuNotebookPen } from "react-icons/lu";

const Dashboard = () => {

  return (
    <div className="">

      <h1 className="mb-6 text-2xl font-bold   ">Dashboard</h1>
      <div className=" rounded-lg   p-6   ">
        <p>Welcome to your dashboard!</p>
        <div className="p-4 flex flex-wrap justify-between gap-4   rounded-lg">
          <div className="flex items-center gap-3 p-4 rounded flex-1 min-w-[250px]">
            <div>
              <p className="text-sm ">Total Criminals:</p>
              <p className="text-lg font-semibold ">209</p>
              <LuNotebookPen className="h-6 w-6 text-blue-500" />
            </div>
          </div>

          <div className="p-4  rounded flex-1 min-w-[250px]">
            <p className="text-sm ">Total Caught Criminals:</p>
            <p className="text-lg font-semibold ">120</p>
            <LuNotebookPen className="h-6 w-6 text-green-600" />
          </div>

          <div className="p-4  rounded flex-1 min-w-[250px]">
            <p className="text-sm ">Most Wanted Criminals:</p>
            <p className="text-lg font-semibold ">08</p>
            <LuNotebookPen className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
