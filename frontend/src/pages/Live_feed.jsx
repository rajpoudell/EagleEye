import React, { useContext } from "react";
import { CameraContext } from "../Context/CameraContext";

const Live_feed = () => {
  const { cameras, loadingIds, stopSingleCamera } = useContext(CameraContext);

  return (
    <div className="flex flex-col gap-5 p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Camera Feeds</h2>

      {cameras.length === 0 ? (
        <p className="text-center text-gray-500">No cameras found</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {cameras.map((cam) => (
            <div
              key={cam.UniqueID}
              className="w-[300px] h-auto rounded-lg shadow-lg p-4 bg-white flex flex-col items-center"
            >
              <p className="text-lg font-semibold mb-1">{cam.camera_location}</p>
              <p className="text-sm text-gray-500 mb-2">Src:{cam.camera_ip}</p>

              <div className="w-full h-[200px] bg-gray-100 rounded flex items-center justify-center overflow-hidden mb-3">
                {cam.is_active ? (
                  <img
                    src={cam.camera_ip}
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

export default Live_feed;
