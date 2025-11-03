import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createIO } from "../services/api";

const AddIo = () => {
  const [formData, setFormData] = useState({
    Name: "",
    contact_number: "",
    Gmail: "",
    Station: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createIO(formData);
      navigate("/io");
      toast.success("IO added successfully!", {
        position: "top-right",
        duration: 2000,
      });
    } catch (err) {
      console.error("Failed to add IO:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-4 p-6 backdrop-blur-sm bg-transparent  rounded shadow "
    >
      <h2 className="text-xl font-bold mb-4 text-center">
        Officer Registration Form
      </h2>

      <div>
        <label className="block font-medium">Name</label>
        <input
          type="text"
          name="Name"
          value={formData.Name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Contact Number</label>
        <input
          type="text"
          name="contact_number"
          value={formData.contact_number}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Gmail</label>
        <input
          type="email"
          name="Gmail"
          value={formData.Gmail}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Station</label>
        <input
          type="text"
          name="Station"
          value={formData.Station}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="px-2 py-2 w-full text-center gap-2 bg-red-600 text-white rounded-md  max-w-sm hover:bg-red-700 "
      >
        Submit
      </button>
    </form>
  );
};

export default AddIo;
