import React, { useEffect, useState } from "react";
import { getIO } from "../sevices/api";
import { Link } from "react-router-dom";
import { MdAdd } from "react-icons/md";

const IO = () => {
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await getIO();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    };

    getData();
  }, []);
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-6">
        Investigating Police Officer
      </h2>
      <div className="flex justify-between mb-4">
      <Link to="/io/add">
        <button className="px-2 py-2 flex items-center gap-2 bg-red-600 text-white rounded-md  max-w-sm hover:bg-red-700 ">  <MdAdd className="h-5 w-5" /> Add IO</button>
        </Link>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded-md w-full max-w-sm shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                UniqueID:
              </th>
              <th scope="col" className="px-6 py-3">
                Officer Name:
              </th>
              <th scope="col" className="px-6 py-3">
                Station
              </th>
              <th scope="col" className="px-6 py-3">
                Gmail
              </th>
              <th scope="col" className="px-6 py-3">
                contact number
              </th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data
                .filter((item) =>
                  item.Name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((item) => (
                  <tr
                    className=" border-b  border-gray-200"
                    key={item.UniqueID}
                  >
                    <td className="px-6 py-4">{item.UniqueID}</td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                    >
                      {item.Name}
                    </th>
                    <td className="px-6 py-4">{item.Station}</td>
                    <td className="px-6 py-4">{item.Gmail}</td>
                    <td className="px-6 py-4">{item.contact_number}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IO;
