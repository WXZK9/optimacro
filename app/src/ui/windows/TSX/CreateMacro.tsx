import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/CreateMacro.css";

interface ButtonType {
  id: number;
  label: string;
  type: "web" | "console" | "system";
}

const CreateMacro: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // buttons
  const buttons: ButtonType[] = [
    { id: 1, label: "Option 1", type: "web" },
    { id: 2, label: "Option 2", type: "console" },
    { id: 3, label: "Option 3", type: "system" },
    { id: 4, label: "Option 4", type: "web" },
    { id: 5, label: "Option 5", type: "console" },
    { id: 6, label: "Option 6", type: "system" },
    { id: 7, label: "Option 7", type: "web" },
    { id: 8, label: "Option 8", type: "console" },
    { id: 9, label: "Option 9", type: "system" },
    { id: 10, label: "Option 10", type: "web" },
  ];

  const itemsPerPage = 8;

  // Pagination 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentButtons = buttons.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < Math.ceil(buttons.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getButtonColor = (type: string) => {
    switch (type) {
      case "web":
        return "blue";
      case "console":
        return "red";
      case "system":
        return "brown";
      default:
        return "gray";
    }
  };
  const handleNavigate = (type: string) => {
    switch (type) {
      case "web":
        navigate("/macro-web-temp");
        break;
      case "console":
        navigate("/macro-console-temp");
        break;
      case "system":
        navigate("/macro-system-temp");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="create-macro-container">
      <h1 className="header">Macro Tamplates</h1>
      <div className="button-grid">
        {currentButtons.map((button) => (
          <button
            key={button.id}
            onClick={() => handleNavigate(button.type)}
            style={{
              backgroundColor: getButtonColor(button.type),
              color: "white",
            }}
            className="grid-button"
          >
            {button.label} ({button.type})
          </button>
        ))}
      </div>
      <div className="pagination-controls">
        <button
          className="nav-button"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(buttons.length / itemsPerPage)}
        </span>
        <button
          className="nav-button"
          onClick={nextPage}
          disabled={currentPage === Math.ceil(buttons.length / itemsPerPage)}
        >
          Next →
        </button>
      </div>
      <button className="back-button" onClick={() => navigate("/")}>
        Go Back
      </button>
    </div>
  );
};

export default CreateMacro;
