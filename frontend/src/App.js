import './App.css';
import { useState } from 'react';

const examples = [
  {
    name: 'Add two numbers',
    code: `#include <iostream>
using namespace std;
int main() {
int x = 5;
int y = 10;
int sum = x + y;
return 0;
}`,
    input: '',
  },
  {
    name: 'Swap two numbers',
    code: `#include <iostream>
using namespace std;
int main() {
int a = 3;
int b = 7;
int temp = a;
a = b;
b = temp;
return 0;
}`,
    input: '',
  },
  {
    name: 'Add two numbers from input',
    code: `#include <iostream>
using namespace std;
int main() {
int a = 0;
int b = 0;
cin >> a;
cin >> b;
int sum = a + b;
return 0;
}`,
    input: '4 9',
  },
    {
    name: 'Sum loop (for)',
    code: `#include <iostream>
using namespace std;
int main() {
int sum = 0;
for (int i = 1; i <= 3; i++) {
sum += i;
}
return 0;
}`,
    input: '',
  },
  {
    name: 'Countdown (while)',
    code: `#include <iostream>
using namespace std;
int main() {
int n = 3;
int total = 0;
while (n > 0) {
total += n;
n--;
}
return 0;
}`,
    input: '',
  },
    {
    name: 'Find the biggest (array)',
    code: `#include <iostream>
using namespace std;
int main() {
int arr[5] = {3, 8, 2, 9, 4};
int big = arr[0];
for (int i = 1; i < 5; i++) {
if (arr[i] > big) {
big = arr[i];
}
}
return 0;
}`,
    input: '',
  },
  {
    name: 'Bubble sort',
    code: `#include <iostream>
using namespace std;
int main() {
int arr[4] = {4, 2, 3, 1};
int n = 4;
for (int i = 0; i < n - 1; i++) {
for (int j = 0; j < n - i - 1; j++) {
if (arr[j] > arr[j + 1]) {
int temp = arr[j];
arr[j] = arr[j + 1];
arr[j + 1] = temp;
}
}
}
return 0;
}`,
    input: '',
  },
];

function App() {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [ranCode, setRanCode] = useState('');
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState('');
  const [current, setCurrent] = useState(0);

  const loadExample = (e) => {
    const chosen = examples[e.target.value];
    if (chosen) {
      setCode(chosen.code);
      setInput(chosen.input);
    }
  };

  const handleRun = async () => {
    const response = await fetch('http://localhost:5000/trace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code, input: input }),
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
      <select onChange={loadExample} defaultValue="">
        <option value="" disabled>Load an example...</option>
        {examples.map((ex, i) => (
          <option key={i} value={i}>{ex.name}</option>
        ))}
      </select>
      <br />
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your C++ code here..."
        rows={12}
        cols={60}
      />
      <br />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Input for cin (optional), e.g. 4 9"
        rows={2}
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
              {Object.entries(steps[current].variables).map(([name, value]) => {
  if (value.startsWith('[')) {
    const cells = value.slice(1, -1).split(' ');
    const before = current > 0 && steps[current - 1].variables[name]
      ? steps[current - 1].variables[name].slice(1, -1).split(' ')
      : [];
    return (
      <div key={name}>
        <strong>{name}</strong>
        <div className="array">
          {cells.map((c, idx) => (
            <div key={idx} className="cell-wrap">
              <div className={before.length && before[idx] !== c ? 'cell changed' : 'cell'}>{c}</div>
              <div className="idx">{idx}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return <div key={name}><strong>{name}</strong> = {value}</div>;
})}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;