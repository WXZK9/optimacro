import React from "react";
import { useNavigate } from "react-router-dom";

const CreateMacro: React.FC = () =>{
    const navigate = useNavigate();
    return (
        <div>
            <h1>Create Macro screen</h1>
            <button onClick={()=>navigate("/")}>Go Back</button>
        </div>
    );
};
export default CreateMacro;