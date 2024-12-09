import { useState } from 'react'
import snail from './img/snail.png';

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
   
        <a href="https://www.linkedin.com/in/bartek-smolibowski-4b2944299/" target="_blank">
          <img src={snail} className="snail" alt="snail logo" />

        </a>
      </div>
      <h1>OptiMacro</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        
      </div>
      
    </>
  )
}

export default App
