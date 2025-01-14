import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MacroWebTemp: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    link: "",
    search: "",
    combination: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const saveJsonFile = async () => {
    try {
      // Send data to the main process using IPC
      const savedFilePath = await window.electron.saveJsonToFile(formData);
      if (savedFilePath) {
        alert(`File saved successfully to: ${savedFilePath}`);
      } else {
        alert("Failed to save file.");
      }
    } catch (error) {
      console.error('Error saving JSON:', error);
      alert("An error occurred while saving the file.");
    }
  };

  return (
    <div className="Application">
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h1>Web Macro Screen</h1>
        {/* Input Fields */}
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Link:{" "}
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="Enter link"
            />
          </label>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>
            Search:{" "}
            <input
              type="text"
              name="search"
              value={formData.search}
              onChange={handleInputChange}
              placeholder="Enter search term"
            />
          </label>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>
            Combination:{" "}
            <input
              type="text"
              name="combination"
              value={formData.combination}
              onChange={handleInputChange}
              placeholder="Enter combination"
            />
          </label>
        </div>

        {/* Buttons */}
        <div>
          <button onClick={saveJsonFile} style={{ marginRight: "1rem" }}>
            Save to JSON
          </button>
          <button onClick={() => navigate("/createMacros")}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default MacroWebTemp;
