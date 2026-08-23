const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');
console.log('File started running');
function instrumentCode(code){
  const lines =code.split('\n');
  let trackedVars =[];
  let output =[];
  for (let line of lines){
  output.push(line);
   const match = line.match(/^\s*(int|double|float|long long)\s+(\w+)\s*=/);
    if (match){
      const varName = match[2];
      trackedVars.push(varName);

      const printParts = trackedVars.map(v => `"${v}=" << ${v}`).join(' << "," << ');
      output.push(`cout << "STEP|" << ${printParts} << endl;`);
    }
  }
       return output.join('\n');
}

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Server is working!');
});

app.post('/compile', (req, res) => {
const code = req.body.code;
const instrumentedCode = instrumentCode(code);
fs.writeFileSync('temp.cpp', instrumentedCode);

  exec('g++ temp.cpp -o temp.exe', (error, stdout, stderr) => {
    if (error) {
      res.send({ success: false, error: stderr });
    } else {
      exec('temp.exe', (runError, runStdout, runStderr) => {
        res.send({ success: true, output: runStdout });
      });
    }
  });
});
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
