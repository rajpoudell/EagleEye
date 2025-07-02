// src/context/CameraContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CameraContext = createContext();

export const CameraProvider = ({ children }) => {
  const [cameras, setCameras] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [loadingIds, setLoadingIds] = useState([]);

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
  }, []);

  const startCameras = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/start-cameras/");
      localStorage.setItem("cameras", true);
      setIsRunning(true);
    } catch (err) {
      console.error("Error starting cameras:", err);
    }
  };

  const stopCameras = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/stop-cameras/");
      localStorage.removeItem("cameras");

      setIsRunning(false);
    } catch (err) {
      console.error("Error stopping cameras:", err);
    }
  };

  const stopSingleCamera = async (id) => {
    setLoadingIds((prev) => [...prev, id]);
    try {
      await axios.post(`http://127.0.0.1:8000/stop-camera/${id}`);
      alert(`Camera ${id} stopped`);
      await fetchCameras(); // 🔁 Refresh the camera list
    } catch (err) {
      console.error("Error stopping camera:", err);
    } finally {
      setLoadingIds((prev) => prev.filter((camId) => camId !== id));
    }
  };

  const toggleLoading = (id, isLoading) => {
    setLoadingIds((prev) =>
      isLoading ? [...prev, id] : prev.filter((camId) => camId !== id)
    );
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
        toggleLoading,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
};
