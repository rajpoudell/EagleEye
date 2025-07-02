import React, { useEffect, useState } from "react";
import Button from "../components/common/Button";
import { addCriminal, getIO } from "../sevices/api";

const AddCriminals = () => {
  const [officersList, setOfficersList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [criminal, setCriminal] = useState({
    Name: "",
    photo: null, // store actual File object here
    crimes: "",
    IO_ID: "",
    Address: "",
    contact: "",
  });

  useEffect(() => {
    async function fetchOfficers() {
      try {
        const data = await getIO(); // Assume this returns array of officers
        setOfficersList(data);
      } catch (error) {
        console.error("Failed to fetch officers:", error);
      }
    }
    fetchOfficers();
  }, []);

  const onChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      const file = files[0];
      setCriminal((prev) => ({
        ...prev,
        [name]: file || null, // store actual File object
      }));
    } else {
      setCriminal((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!criminal.photo) {
      alert("Please select a photo file.");
      return;
    }

    // Prepare formData for multipart/form-data POST
    setLoading(true);
    const formData = new FormData();
    formData.append("Name", criminal.Name);
    formData.append("contact", criminal.contact);
    formData.append("Address", criminal.Address);
    formData.append("crimes", criminal.crimes);
    formData.append("IO_ID", criminal.IO_ID);
    formData.append("photo", criminal.photo); // actual File object

    try {
      const response = await addCriminal(formData);
      console.log(response.status);
      // Optionally reset form after submission
      setCriminal({
        Name: "",
        photo: null,
        crimes: "",
        IO_ID: "",
        Address: "",
        contact: "",
      });
      alert(response.message)
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to add criminal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-xl text-center font-semibold mb-4">Add Criminal</div>
      <form onSubmit={onSubmit} className="flex flex-col items-center">
        <div className="my-10 flex flex-wrap gap-5 justify-center">
          <div className="flex flex-col w-[300px] gap-2">
            <label>Name:</label>
            <input
              type="text"
              name="Name"
              value={criminal.Name}
              onChange={onChange}
              placeholder="Enter full name"
              className="px-2 py-2 outline rounded-sm"
              required
            />
          </div>

          <div className="flex flex-col w-[300px] gap-2">
            <label>Contact:</label>
            <input
              type="text"
              name="contact"
              value={criminal.contact}
              onChange={onChange}
              placeholder="Enter contact"
              className="px-2 py-2 outline rounded-sm"
              required
            />
          </div>

          <div className="flex flex-col w-[300px] gap-2">
            <label>Address:</label>
            <input
              type="text"
              name="Address"
              value={criminal.Address}
              onChange={onChange}
              placeholder="Enter address"
              className="px-2 py-2 outline rounded-sm"
              required
            />
          </div>

          <div className="flex flex-col w-[300px] gap-2">
            <label>Crimes:</label>
            <input
              type="text"
              name="crimes"
              value={criminal.crimes}
              onChange={onChange}
              placeholder="Enter crimes (comma-separated)"
              className="px-2 py-2 outline rounded-sm"
              required
            />
          </div>

          <div className="flex flex-col w-[300px] gap-2">
            <label>Officer:</label>
            <select
              name="IO_ID"
              value={criminal.IO_ID}
              onChange={onChange}
              className="px-2 py-2 outline rounded-sm"
              required
            >
              <option value="">Select Officer</option>
              {officersList.map((officer) => (
                <option key={officer.UniqueID} value={officer.UniqueID}>
                  {officer.Name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-[300px] gap-2">
            <label>Photo:</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={onChange}
              className="px-2 py-2 outline rounded-sm"
              required
            />
            {criminal.photo && (
              <img
                src={URL.createObjectURL(criminal.photo)}
                alt="Preview"
                className="mt-2 w-40 h-40 mx-auto object-cover rounded shadow"
              />
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded bg-black cursor-pointer hover:bg-gray-800 text-white ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Add Criminal"}
        </button>
        {/* <Button disabled={loading} name={loading ? "Submitting..." : "Add Criminal"} /> */}
      </form>
    </>
  );
};

export default AddCriminals;
