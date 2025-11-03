import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export const getIO = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/io/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const createIO = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/io/`, data);
  return res.data;
};

export const deleteIO = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/io/${id}`);
  return res.data;
};

export const getStation = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/station/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getCriminals = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/criminal/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addCriminal = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/criminal/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const getLogs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/logs/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const handleUpdate = async (id, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/criminal/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
    // Optionally refresh your criminal list here
  } catch (err) {
    console.error(err);
    alert("Failed to update criminal");
  }
};

export const handleDelete = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/criminal/${id}`);
    return response;
  } catch (err) {
    console.error(err);
    alert("Failed to update criminal");
  }
};

export const createCamera = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/cameras/`, data);
  return res.data;
};

export const deleteCamera = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/cameras/${id}`);
  return res.data;
};
