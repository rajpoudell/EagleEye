import { Trash } from "lucide-react";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { CameraContext } from "../context/CameraContext";
import { deleteCamera } from "../services/api";
const LiveFeed = () => {
  const {
    cameras,
    loadingIds,
    startCameras,
    stopCameras,
    stopSingleCamera,
    fetchCameras,
    addCamera,
  } = useContext(CameraContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    camera_location: "",
    camera_ip: "",
    StationID: "",
    is_active: true,
  });

  const handleAddCamera = async (e) => {
    e.preventDefault();
    try {
      await addCamera(form);
      toast.success("Camera added");
      setForm({
        camera_location: "",
        camera_ip: "",
        StationID: "",
        is_active: true,
      });
      setIsModalOpen(false);
      fetchCameras();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCamera(id);
      toast.success("Camera deleted successfully");

      fetchCameras();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-5 p-2">
      <h2 className="text-3xl font-bold text-start mb-6">Camera Feeds</h2>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-50 shadow-lg rounded p-6 w-[400px] relative">
            <h3 className="text-xl font-bold mb-4">Add Camera</h3>

            <form onSubmit={handleAddCamera} className="flex flex-col gap-3">
              <input
                className="border border-gray-200 p-2 rounded"
                placeholder="Camera Location"
                value={form.camera_location}
                onChange={(e) =>
                  setForm({ ...form, camera_location: e.target.value })
                }
              />
              <input
                className="border border-gray-200 p-2 rounded"
                placeholder="Stream URL / IP"
                value={form.camera_ip}
                onChange={(e) =>
                  setForm({ ...form, camera_ip: e.target.value })
                }
              />
              <input
                className="border border-gray-200 p-2 rounded"
                placeholder="Station ID"
                value={form.StationID}
                onChange={(e) =>
                  setForm({ ...form, StationID: e.target.value })
                }
              />

              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-red-400 text-white py-2 rounded hover:bg-red-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Control buttons */}
      <div className="flex justify-start gap-4 mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2 border border-gray-400 tran rounded cursor-pointer hover:bg-gray-100"
        >
          + Add Camera
        </button>
        <button
          onClick={startCameras}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Start Cameras
        </button>
        <button
          onClick={stopCameras}
          className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Stop All
        </button>
      </div>

      {cameras.length === 0 ? (
        <p className="text-center text-gray-500">No cameras found</p>
      ) : (
        <div className="flex flex-wrap justify-start gap-6">
          {cameras.map((cam) => (
            <div
              key={cam.UniqueID}
              className="w-[300px] h-auto rounded-lg shadow-lg p-4 bg-white flex flex-col items-center"
            >
              <div className="flex justify-between px-2">
                <p className="mb-1">
                  Location: {cam.camera_location} <br />
                  Near Police Station: {cam.station_Address}
                </p>
                <Trash
                  onClick={() => handleDelete(cam.UniqueID)}
                  color="red"
                  className="cursor-pointer"
                  size={24}
                />
              </div>
              <p className="text-sm text-gray-500 mb-2">Src: {cam.camera_ip}</p>

              <div className="w-full h-[200px] bg-gray-100 rounded flex items-center justify-center overflow-hidden mb-3">
                {cam.is_active ? (
                  <img
                    src={"http://" + cam.camera_ip}
                    alt="Live Feed"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-red-500 font-semibold">Inactive</p>
                )}
              </div>

              <p
                className={`text-sm mb-2 font-medium ${
                  cam.is_active ? "text-green-600" : "text-red-400"
                }`}
              >
                {cam.is_active ? "Status: Active" : "Status: Inactive"}
              </p>

              {cam.is_active && (
                <button
                  onClick={() => stopSingleCamera(cam.UniqueID)}
                  disabled={loadingIds.includes(cam.UniqueID)}
                  className="mt-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
                >
                  {loadingIds.includes(cam.UniqueID) ? "Stopping..." : "Stop"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveFeed;
