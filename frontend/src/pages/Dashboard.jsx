import { useEffect, useState } from "react";
import { GiPoliceOfficerHead } from "react-icons/gi";
import { IoPersonSharp } from "react-icons/io5";
import { LuCamera } from "react-icons/lu";
import { MdLocalPolice } from "react-icons/md";
import { Link } from "react-router-dom";
import { getLogs } from "../services/api";

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await getLogs();
        const sortedLogs = result.logs.sort(
          (a, b) => new Date(b.DateTime) - new Date(a.DateTime)
        );
        setData(sortedLogs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

  const statCards = [
    {
      label: "Criminals",
      value: 5,
      icon: IoPersonSharp,
      color: "text-blue-500",
    },
    {
      label: "Investigating Officers",
      value: 15,
      icon: GiPoliceOfficerHead,
      color: "text-green-600",
    },
    { label: "Cameras", value: 2, icon: LuCamera, color: "text-red-600" },
    {
      label: "Stations",
      value: 6,
      icon: MdLocalPolice,
      color: "text-purple-700",
    },
  ];

  return (
    <div className="w-full">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((item, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-xl px-5 py-6 flex items-center justify-between  hover:shadow-xl transition-all"
          >
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-2xl font-bold mt-1">{item.value}</p>
            </div>
            <item.icon className={`h-10 w-10 opacity-80 ${item.color}`} />
          </div>
        ))}
      </div>

      {/* Logs */}
      <div className=" rounded-xl shadow-md  p-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Latest Logs
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-600 font-medium border-b">
              <tr>
                <th className="py-3 px-2">Log</th>
                <th className="py-3 px-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-b-gray-400 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-2 text-gray-800">{item.FullTexts}</td>
                  <td className="py-3 px-2 text-gray-500 text-sm">
                    {new Date(item.DateTime).toLocaleString()}
                  </td>
                </tr>
              ))}

              {data.length === 0 && (
                <tr>
                  <td colSpan="2" className="text-center py-4 text-gray-500">
                    No logs available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button className=" bg-blue-500 text-white px-4 py-2 rounded mt-3 ">
          <Link to="/logs" className="hover:underline ">
            More Logs&rarr;
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
