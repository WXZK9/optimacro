import React from "react";
import { useNavigate } from "react-router-dom";

const About: React.FC = () =>{
    const navigate = useNavigate();
    return (
        <div>
            <h1>About screen</h1>
            <button onClick={()=>navigate("/")}>Go Back</button>
        </div>
    );
};
export default About;