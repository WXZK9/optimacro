import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styles from "../CSS/AllMacro.module.css";

interface Macro {
  name: string;
  shortcut: string;
  filePath: string;
}

const Macros: React.FC = () => {
  const navigate = useNavigate();
  const [macros, setMacros] = useState<Macro[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); 
  const [filteredMacros, setFilteredMacros] = useState<Macro[]>([]);

  useEffect(() => {
    import("/home/bary/Desktop/Opti/optimacro/app/src/electron/MacroData/savedCodes.json")
      .then((data) => {
        setMacros(data.default);
        setFilteredMacros(data.default); 
      })
      .catch((error) => {
        console.error("Error loading savedCodes.json", error);
      });
  }, []);

  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase(); 
    setSearchTerm(term);
    const filtered = macros.filter((macro) =>
      macro.name.toLowerCase().includes(term) 
    );
    setFilteredMacros(filtered);
  };

  return (
    <div>
      <h1>TWOJE MAKRA</h1>
      
      <input
        type="text"
        placeholder="Search macros..."
        value={searchTerm}
        onChange={handleSearch}
        className={styles.searchBox} 
      />
      
      <div className={styles.container}>
        {filteredMacros.map((macro, index) => (
          <div key={index} className={styles.macro}>
            <div className={styles.name}>{macro.name}</div>
            <div className={styles.shortcut}>{macro.shortcut}</div>
          </div>
        ))}
      </div>
      
      <button onClick={() => navigate("/")}>Go Back</button>
    </div>
  );
};

export default Macros;
