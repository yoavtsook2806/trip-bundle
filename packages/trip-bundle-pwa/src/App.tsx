import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>🧳 Trip Bundle</h1>
        <p>Your travel companion PWA</p>
        
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            Trips planned: {count}
          </button>
          <p>
            Start planning your next adventure with Trip Bundle
          </p>
        </div>
        
        <div className="features">
          <div className="feature">
            <h3>📍 Plan Routes</h3>
            <p>Create and organize your travel itineraries</p>
          </div>
          <div className="feature">
            <h3>💰 Track Budget</h3>
            <p>Monitor your travel expenses</p>
          </div>
          <div className="feature">
            <h3>📱 Offline Ready</h3>
            <p>Access your trips even without internet</p>
          </div>
        </div>
      </header>
    </div>
  )
}

export default App
