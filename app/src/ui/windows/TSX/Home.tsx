import React from "react";
import { useNavigate } from "react-router-dom";
import '../CSS/Home.css'; // Make sure to import the CSS

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="sentence top">
                <h2>OPTIMACRO</h2>
            </div>
            <div className="sentence middle">
                <p>Program do low codowego tworzenia makr używając skryptów lua.</p>
            </div>
            <div className="sentence middle">
                <p>Dodawaj tylko bloczki, a kod zostanie dla Ciebie automatycznie wygenerowany i gotowy do działania.</p>
            </div>
            <div className="sentence bottom">
                <p>Nie bądź jak ślimak i przyśpiesz sobie robotę....</p>
            </div>
            <button onClick={() => navigate("/About")}>About</button>
        </div>
    );
};

export default Home;
