import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () =>{
    const navigate = useNavigate();
    return (
        <div>
            <h1>Home screen</h1>
            <button onClick={()=>navigate("/About")}>About</button>
        </div>
    );
};
export default Home;