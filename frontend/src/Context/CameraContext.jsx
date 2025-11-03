import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createCamera } from "../services/api";

export const CameraContext = createContext();

export const CameraProvider = ({ children }) => {
  const [cameras, setCameras] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [loadingIds, setLoadingIds] = useState([]);

  // Fetch camera list
  const fetchCameras = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/cameras/");
      setCameras(res.data);
    } catch (err) {
      console.error("Failed to fetch cameras:", err);
    }
  };

  useEffect(() => {
    fetchCameras();

    // Optional: auto-refresh every 3s for live updates
    const interval = setInterval(fetchCameras, 3000);
    return () => clearInterval(interval);
  }, []);

  // Start all cameras
  const startCameras = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/start-cameras/");
      localStorage.setItem("cameras", true);
      setIsRunning(true);
      await fetchCameras(); // Refresh UI
    } catch (err) {
      console.error("Error starting cameras:", err);
    }
  };

  // Stop all cameras
  const stopCameras = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/stop-cameras/");
      toast.success("All cameras stopped", {
        position: "top-right",
      });
      setIsRunning(false);
      await fetchCameras();
    } catch (err) {
      console.error("Error stopping cameras:", err);
    }
  };
  const addCamera = async (camData) => {
    await createCamera(camData);
    fetchCameras();
  };
  // Stop individual camera
  const stopSingleCamera = async (id) => {
    setLoadingIds((prev) => [...prev, id]);
    try {
      await axios.post(`http://127.0.0.1:8000/stop-camera/${id}`);

      toast.success(`Camera ${id} stopped`, {
        position: "top-right",
      });

      await fetchCameras();
    } catch (err) {
      console.error("Error stopping camera:", err);
    } finally {
      setLoadingIds((prev) => prev.filter((camId) => camId !== id));
    }
  };

  return (
    <CameraContext.Provider
      value={{
        cameras,
        isRunning,
        loadingIds,
        startCameras,
        stopCameras,
        stopSingleCamera,
        addCamera,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
};
