/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCriminals, handleDelete } from "../services/api";

const Criminals = () => {
  const navigate = useNavigate();
  const handleEditRedirect = (criminal) => {
    navigate("/add-criminal", { state: { criminal } });
  };
  const [selectedCriminal, setSelectedCriminal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [data, setData] = useState(null);

  const [editForm, setEditForm] = useState({
    Name: "",
    contact: "",
    Address: "",
    crimes: [],
    IO_ID: null,
  });
  const openModal = (criminal) => {
    setSelectedCriminal(criminal);
    setEditForm({
      Name: criminal.Name || "",
      contact: criminal.contact || "",
      Address: criminal.Address || "",
      crimes: criminal.crimes || [],
      IO_ID: criminal.io?._id || null,
    });
  };
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
  }, [selectedCriminal]);

  const closeModal = () => {
    setSelectedCriminal(null);
    setEditForm({
      Name: "",
      contact: "",
      Address: "",
      crimes: [],
      IO_ID: null,
    });
  };

  // Handle delete product
  const handleDeletebtn = async (id) => {
    try {
      await handleDelete(id);
      navigate("/criminals");
      await getCriminals();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6">Criminals List</h2>
      <div className="flex justify-between  lg:flex-row flex-col gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded-md w-full max-w-sm shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />
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
              <th
                colSpan={2}
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data &&
              data
                .filter((criminal) =>
                  criminal.Name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((criminal) => (
                  <tr key={criminal.UniqueID} className="hover:bg-gray-50">
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
                    <td className="px-6  py-4 whitespace-nowrap text-gray-500">
                      <button
                        onClick={() => openModal(criminal)}
                        className="text-emerald-600 hover:text-emerald-800"
                      >
                        View Details
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      <button
                        onClick={() => handleDeletebtn(criminal.UniqueID)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Modal/Popup */}
      {selectedCriminal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">{selectedCriminal.Name}</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={`http://127.0.0.1:8000/image/${selectedCriminal.UniqueID}`}
                    alt={selectedCriminal.name}
                    className="w-full h-64 object-cover rounded-md border"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Contact:</h4>
                    <p className="text-gray-600">{selectedCriminal.contact}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Address:</h4>
                    <p className="text-gray-600">{selectedCriminal.Address}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Crimes:</h4>
                    <p className="text-gray-600">
                      {selectedCriminal?.crimes?.length
                        ? selectedCriminal.crimes.join(", ")
                        : "No crimes recorded"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Officers:</h4>
                    <p className="text-gray-600">
                      {selectedCriminal?.io?.Name}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Last Seen:</h4>
                    <p className="text-gray-600">
                      {selectedCriminal?.location_history &&
                      selectedCriminal.location_history.length > 0
                        ? (() => {
                            const latest = [
                              ...selectedCriminal.location_history,
                            ].sort(
                              (a, b) =>
                                new Date(b.timestamp) - new Date(a.timestamp)
                            )[0];
                            return `${latest.message} at ${new Date(
                              latest.timestamp
                            ).toLocaleString()}`;
                          })()
                        : "No location history available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-5  justify-end">
                <button
                  onClick={() => handleEditRedirect(selectedCriminal)}
                  className="px-4 py-2 bg-white-600 text-black rounded-md hover:bg-gray-950 border hover:text-white"
                >
                  Edit
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Criminals;
