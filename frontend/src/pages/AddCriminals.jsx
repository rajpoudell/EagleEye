import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { addCriminal, getIO, handleUpdate } from "../services/api";
import crimes from "../utils/crimes";

const AddCriminals = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editingCriminal = location.state?.criminal || null;

  const [officersList, setOfficersList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [criminal, setCriminal] = useState({
    Name: "",
    photo: null,
    crimes: "",
    IO_ID: "",
    Address: "",
    contact: "",
  });

  useEffect(() => {
    async function fetchOfficers() {
      try {
        const data = await getIO();
        setOfficersList(data);
      } catch (error) {
        console.error("Failed to fetch officers:", error);
      }
    }
    fetchOfficers();
  }, []);
  useEffect(() => {
    if (editingCriminal) {
      setCriminal({
        Name: editingCriminal.Name || "",
        photo: editingCriminal.photo || "",
        crimes: editingCriminal.crimes?.join(", ") || "",
        IO_ID: editingCriminal.IO_ID || editingCriminal.io?.UniqueID || "",
        Address: editingCriminal.Address || "",
        contact: editingCriminal.contact || "",
      });
    }
  }, [editingCriminal]);

  const onChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      const file = files[0];
      setCriminal((prev) => ({
        ...prev,
        [name]: file || null,
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

    setLoading(true);

    try {
      if (editingCriminal) {
        const updateData = {
          Name: criminal.Name,
          contact: criminal.contact,
          Address: criminal.Address,
          IO_ID: Number(criminal.IO_ID),
          crimes: criminal.crimes
            ? criminal.crimes.split(",").map((c) => c.trim())
            : [],
        };

        await handleUpdate(editingCriminal.UniqueID, updateData);
        toast.success("Criminal updated successfully!", {
          position: "top-right",
        });
      } else {
        if (!criminal.photo) {
          toast.error("Please select a photo file.", {
            position: "top-right",
          });
          setLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append("Name", criminal.Name);
        formData.append("contact", criminal.contact);
        formData.append("Address", criminal.Address);
        formData.append("crimes", criminal.crimes);
        formData.append("IO_ID", criminal.IO_ID);
        formData.append("photo", criminal.photo);

        await addCriminal(formData); // multipart/form-data
        toast.success("Criminal added successfully!", {
          position: "bottom-center",
        });
      }

      navigate("/criminals"); // redirect after success
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to submit criminal data", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-xl text-center font-semibold mb-4">
        {editingCriminal ? "Edit Criminal" : "Add Criminal"}
      </div>{" "}
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
            <label>
              Crimes: <span className="text-xs">(comma-separated)</span>
            </label>
            <input
              type="text"
              name="crimes"
              value={criminal.crimes}
              onChange={onChange}
              placeholder="Enter crimes"
              className="px-2 py-2 outline rounded-sm"
              list="crimes-list"
            />
            <datalist id="crimes-list">
              {crimes.map((crime, index) => (
                <option key={index} value={crime} />
              ))}
            </datalist>
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

            {editingCriminal ? (
              <img
                src={`http://127.0.0.1:8000/image/${editingCriminal.UniqueID}`} // or UniqueID
                alt="Criminal"
                className="mt-2 w-40 h-40 mx-auto object-cover rounded shadow"
              />
            ) : (
              <>
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
                    src={
                      typeof criminal.photo === "string"
                        ? criminal.photo // existing URL if string
                        : URL.createObjectURL(criminal.photo) // uploaded file preview
                    }
                    alt="Preview"
                    className="mt-2 w-40 h-40 mx-auto object-cover rounded shadow"
                  />
                )}
              </>
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
          {loading
            ? "Submitting..."
            : editingCriminal
            ? "Update Criminal"
            : "Add Criminal"}
        </button>
      </form>
    </>
  );
};

export default AddCriminals;
