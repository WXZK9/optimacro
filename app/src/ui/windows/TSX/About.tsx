import React from "react";

import '../CSS/About.css'

const About: React.FC = () => {
   

    return (
        <div>
            <h1>Jak stworzyć swoje makro?</h1>
            <div className="grid-container">
                <div className="frame"><span>1</span>Przejdź do zakładki "Stwórz Makra"</div>
                <div className="frame"><span>2</span>Wybierz z listy odpowiedni dla Ciebie 'blok' kodu i wypełnij pola</div>
                <div className="frame"><span>3</span>Jeśli używasz bloków "If, For" nie zapomnij na końcu zakresu użyć bloku "End"</div>
                <div className="frame"><span>4</span>Zakres każdego bloku jest pokazany poprzez niebieskie linie</div>
                <div className="frame"><span>5</span>Zakres każdego statementu 'if' jest przedstawiony zieloną linią</div>
                <div className="frame"><span>6</span>Wygeneruj kod, żeby sprawdzić czy nie zrobiłeś żadnego błędu</div>
                <div className="frame"><span>7</span>......</div>
            </div>
            
        </div>
    );
};

export default About;