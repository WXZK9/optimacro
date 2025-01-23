import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

    //@ts-ignore
    window.electron.fetchMacros()
      .then((data: Macro[]) => {
        setMacros(data);
        setFilteredMacros(data);
      })
      .catch((error: Error) => {
        console.error("Error loading macros:", error);
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

  const deleteMacro = async (index: number,LuaPath:string) => {
    const updatedMacros = [...macros];
    updatedMacros.splice(index, 1);

    
    //@ts-ignore
    const result = await  window.electron.deleteMacro(
        "./src/electron/MacroData/savedCodes.json",
        JSON.stringify(updatedMacros, null, 2),LuaPath
      );
    if (result.success) {
      setMacros(updatedMacros);
      setFilteredMacros(updatedMacros);
    } else {
      console.error("Failed to delete macro:", result.error);
    }
  };

  return (
    <div>
      <h2>Your Macros</h2>

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
            <button className={styles.deleteButton} onClick={() => deleteMacro(index,macro.filePath)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <button onClick={() => navigate("/")}>Go Back</button>
    </div>
  );
};

export default Macros;
