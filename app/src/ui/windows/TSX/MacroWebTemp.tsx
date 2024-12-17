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

  const saveJsonFile = () => {
    const fileData = JSON.stringify(formData, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "macro-data.json"; 
    a.click();
    URL.revokeObjectURL(url);
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
