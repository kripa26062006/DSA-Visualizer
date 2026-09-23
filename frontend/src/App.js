import './App.css';
import { useState } from 'react';

function App() {
  const [code, setCode] = useState('');

  const handleRun = () => {
    console.log('Code to run:', code);
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
    </div>
  );
}

export default App;