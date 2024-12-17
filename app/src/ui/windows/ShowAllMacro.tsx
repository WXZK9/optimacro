import React from "react";
import { useNavigate } from "react-router-dom";

const Macros: React.FC = () =>{
    const navigate = useNavigate();
    return (
        <div>
            <h1>Macros screen</h1>
            <button onClick={()=>navigate("/")}>Macros</button>
        </div>
    );
};
export default Macros;