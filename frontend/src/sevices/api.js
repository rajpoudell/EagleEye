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
export const geCriminals = async () => {
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

export const handleUpdate = async (formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/criminal/${formData.UniqueID}`,
      formData
    );
    return response;
    // Optionally refresh your criminal list here
  } catch (err) {
    console.error(err);
    alert("Failed to update criminal");
  }
};

export const handleDelete= async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/criminal/${id}`
    );
    return response;
  } catch (err) {
    console.error(err);
    alert("Failed to update criminal");
  }
};
