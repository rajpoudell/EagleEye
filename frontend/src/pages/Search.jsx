import { useEffect, useState } from "react";
import { getCriminals } from "../services/api";
import crimes from "../utils/crimes";
const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await getCriminals();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    };
    getData();
  }, []);
  const filterData = data?.filter((item) =>
    item.crimes.some((crime) =>
      crime.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="">
      <div className="flex justify-between  lg:flex-row flex-col gap-4 mb-4">
        <select
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        >
          <option value="">Select Crime</option>
          {crimes.map((crime, i) => (
            <option key={i} value={crime}>
              {crime}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by Crime"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded-md w-full max-w-sm shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />
        <div className=" flex gap-4 ml-10">
          <span>Total Related Criminal:</span>
          {searchTerm.trim() && filterData?.length > 0 && (
            <div>{filterData.length}</div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Photo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
            </tr>
          </thead>
          {searchTerm.trim() &&
            filterData?.map((criminal) => {
              return (
                <tbody
                  key={criminal.UniqueID}
                  className="bg-white divide-y divide-gray-200"
                >
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={`http://127.0.0.1:8000/image/${criminal.UniqueID}`}
                        alt={criminal.Name}
                        className="w-12 h-12 rounded-md object-cover border"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {criminal.Name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {criminal.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {criminal.Address}
                    </td>
                  </tr>
                </tbody>
              );
            })}
        </table>
      </div>
    </div>
  );
};

export default Search;
