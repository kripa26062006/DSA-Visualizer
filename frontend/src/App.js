import './App.css';
import { useState } from 'react';

function App() {
  const [code, setCode] = useState('');
  const [steps, setSteps] = useState([]);

  const handleRun = async () => {
    const response = await fetch('http://localhost:5000/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code }),
    });

    const data = await response.json();
    setSteps(data.steps);
  };

  return (
    <div className="App">
      <h1>DSA Code Visualizer</h1>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your C++ code here..."
        rows={15}
        cols={60}
      />
      <br />
      <button onClick={handleRun}>Run</button>

      <div>
        {steps.map((s) => (
          <div key={s.step}>
            <strong>Step {s.step}:</strong> {JSON.stringify(s.variables)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;