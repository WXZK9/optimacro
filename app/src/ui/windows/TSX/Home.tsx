import React from "react";
import { useNavigate } from "react-router-dom";
import '../CSS/Home.css'; // Make sure to import the CSS

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h1>Home screen</h1>
            <button onClick={() => navigate("/About")}>About</button>
        </div>
    );
};

export default Home;