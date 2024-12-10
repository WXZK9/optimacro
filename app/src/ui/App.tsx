import React from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
// Import screens
import About from './windows/About';
import Home from './windows/Home';
import Macros from './windows/ShowAllMacro';
import CreateMacro from './windows/CreateMacro';
// Import CSS
import './App.css';
// Import image
import snailImage from './img/snail.png';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        {/* Top navigation menu */}
        <nav className="top-menu">
          <div className="nav-links">
            <Link className="nav-button" to="/">Home</Link>
            <Link className="nav-button" to="/about">About</Link>
            <Link className='nav-button' to="/macros">Wszystkie Makra</Link>
            <Link className='nav-button' to="/createMacros">Stworz Makra</Link>
          </div>
          <img src={snailImage} alt="Snail" className="snail-icon" />
        </nav>
        {/* Page content */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/macros" element={<Macros />} />
            <Route path="/createMacros" element={<CreateMacro />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
