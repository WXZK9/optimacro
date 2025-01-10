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

  // Save data to a JSON file
  const saveToJson = () => {
    // Create a JSON blob from the form data
    const jsonData = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const link = document.createElement("a");
    
    // Set up the download link
    link.href = URL.createObjectURL(blob);
    link.download = "macroData.json"; // Filename for the downloaded JSON file
    
    // Programmatically click the link to trigger the download
    link.click();
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
          <button onClick={() => navigate("/createMacros")}>Back</button>
          <button onClick={saveToJson}>Save as JSON</button>
        </div>
      </div>
    </div>
  );
};

export default MacroWebTemp;
