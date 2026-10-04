import './App.css';
import { useState } from 'react';

function App() {
  const [code, setCode] = useState('');
  const [ranCode, setRanCode] = useState('');
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState('');
  const [current, setCurrent] = useState(0);

  const handleRun = async () => {
    const response = await fetch('http://localhost:5000/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code }),
    });

    const data = await response.json();
    if (data.success) {
      setError('');
      setSteps(data.steps);
      setRanCode(code);
      setCurrent(0);
    } else {
      setSteps([]);
      setError(data.error);
    }
  };

  return (
    <div className="App">
      <h1>DSA Code Visualizer</h1>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your C++ code here..."
        rows={12}
        cols={60}
      />
      <br />
      <button onClick={handleRun}>Run</button>
      {error && <pre style={{ color: 'red' }}>{error}</pre>}

      {steps.length > 0 && (
        <div>
          <p>Step {current + 1} of {steps.length}</p>
          <button onClick={() => setCurrent(current - 1)} disabled={current === 0}>Back</button>
          <button onClick={() => setCurrent(current + 1)} disabled={current === steps.length - 1}>Next</button>

          <div className="panels">
            <div className="panel">
              <h3>Code</h3>
              {ranCode.split('\n').map((text, i) => (
                <div
                  key={i}
                  className={i + 1 === steps[current].line ? 'code-line active' : 'code-line'}
                >
                  <span className="line-no">{i + 1}</span>
                  {text}
                </div>
              ))}
            </div>

            <div className="panel">
              <h3>Variables</h3>
              {Object.entries(steps[current].variables).map(([name, value]) => (
                <div key={name}><strong>{name}</strong> = {value}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;