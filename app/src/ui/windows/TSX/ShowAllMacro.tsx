
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

interface Macro {
    name:string;
    shortcut: string;
    filePath:string;
}

const Macros: React.FC = () =>{
    const navigate = useNavigate();
    const [macros,setMacros] = useState<Macro[]>([]);
    useEffect(()=>{
        import("/home/bary/Desktop/Opti/optimacro/app/src/electron/MacroData/savedCodes.json")
        .then((data)=>{
            setMacros(data.default);
        }).catch((error)=>{
            console.error("Error loading savedCodes.json",error);
        })
    })
    
    return (
        <div>
          <h1>Macros Screen</h1>
          
          <ul>
            {macros.map((macro, index) => (
              <li key={index}>
                <strong>{macro.name}</strong> - {macro.shortcut}
              </li>
            ))}
          </ul>
          <button onClick={() => navigate("/")}>Go Back</button>
        </div>
      );
};
export default Macros;