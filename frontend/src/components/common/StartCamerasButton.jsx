import React, { useContext, useState } from "react";
import { CameraContext } from "../../Context/CameraContext";

const StartCamerasButton = () => {
  const { isRunning, startCameras, stopCameras } = useContext(CameraContext);
  const [loading, setLoading] = useState(false);
  const localStorageStatus =  localStorage.getItem("cameras")
  const handleStart = async () => {
    setLoading(true);
    await startCameras();
    setLoading(false);
  };

  const handleStop = async () => {
    setLoading(true);
    await stopCameras();
    setLoading(false);
  };

  return (
    <div className="mb-4">
      {isRunning||localStorageStatus ? (
        <button
          className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded"
          onClick={handleStop}
          disabled={loading}
        >
          {loading ? "Stopping..." : "Stop all Cameras"}
        </button>
      ) : (
        <button
          className="bg-green-600 hover:bg-green-500 px-3 py-2 rounded"
          onClick={handleStart}
          disabled={loading}
        >
          {loading ? "Starting..." : "Start all Cameras"}
        </button>
      )}
    </div>
  );
};

export default StartCamerasButton;
