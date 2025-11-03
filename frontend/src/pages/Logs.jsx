import { useEffect, useState } from "react";
import { getLogs } from "../services/api";

const Logs = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const logsPerPage = 10;

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

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = data.slice(indexOfFirstLog, indexOfLastLog);

  const totalPages = Math.ceil(data.length / logsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-6">
        Latest Detected logs
      </h2>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Index
              </th>
              <th scope="col" className="px-6 py-3">
                CriminalID
              </th>
              <th scope="col" className="px-6 py-3">
                CameraID
              </th>
              <th scope="col" className="px-6 py-3">
                FullTexts
              </th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.map((item, index) => (
              <tr className="border-b border-gray-200" key={item.ID}>
                <td className="px-6 py-4">{indexOfFirstLog + index + 1}</td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {item.CriminalID}
                </td>
                <td className="px-6 py-4">{item.CameraID}</td>
                <td className="px-6 py-4">{item.FullTexts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {data.length > logsPerPage && (
        <div className="flex justify-center items-center mt-4 space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-700"
            }`}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Logs;
