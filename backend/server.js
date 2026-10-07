const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');
console.log('File started running');

function instrumentCode(code) {
  const lines = code.split('\n');
  let trackedVars = [];
  let output = [];
  let depth = 0;

   function report(lineNo) {
    const parts = trackedVars.map(v => {
      if (v.isArray) {
        const len = `(int)(sizeof(${v.name}) / sizeof(${v.name}[0]))`;
        return `cout << "${v.name}=["; for (int ai_ = 0; ai_ < ${len}; ai_++) { cout << ${v.name}[ai_] << (ai_ + 1 < ${len} ? " " : ""); } cout << "]";`;
      }
      return `cout << "${v.name}=" << ${v.name};`;
    });
    output.push(`cout << "STEP|" << ${lineNo} << "|"; ` + parts.join(' cout << ","; ') + ` cout << endl;`);
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    output.push(line);

    const decl = line.match(/^\s*(int|double|float|long long)\s+(\w+)\s*=/);
    const forDecl = line.match(/^\s*for\s*\(\s*(int|double|float|long long)\s+(\w+)\s*=.*\{\s*$/);
    const whileLoop = /^\s*while\s*\(.*\{\s*$/.test(line);
    const assign = line.match(/^\s*(\w+)(\[[^\]]*\])?\s*([+\-*\/%]?=(?!=)|\+\+|--)/);
    const arrayDecl = line.match(/^\s*(int|double|float|long long)\s+(\w+)\s*\[[^\]]*\]\s*=/);
    const names = trackedVars.map(v => v.name);
 

    if (forDecl) {
      trackedVars.push({ name: forDecl[2], depth: depth + 1 });
      report(i + 1);
    } else if (whileLoop && trackedVars.length > 0) {
      report(i + 1);
     } else if (arrayDecl) {
      trackedVars.push({ name: arrayDecl[2], depth: depth, isArray: true });
      report(i + 1);
    } else if (decl) {
      trackedVars.push({ name: decl[2], depth: depth });
      report(i + 1);
    } else if (assign && names.includes(assign[1])) {
      report(i + 1);
    } else if (/^\s*cin\s*>>/.test(line) && trackedVars.length > 0) {
      report(i + 1);
    }

    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    depth += opens - closes;
    trackedVars = trackedVars.filter(v => v.depth <= depth);
  }

  return output.join('\n');
}
function parseOutput(rawOutput) {
  const lines = rawOutput.split('\n');
  const steps = [];

  for (let line of lines) {
    if (line.startsWith('STEP|')) {
      const parts = line.split('|');
      const lineNo = parseInt(parts[1]);
      const data = parts[2].trim();
      const variables = {};

      for (let pair of data.split(',')) {
        const [name, value] = pair.split('=');
        variables[name] = value;
      }

      steps.push({ step: steps.length + 1, line: lineNo, variables: variables });
    }
  }

  return steps;
}

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Server is working!');
});

app.post('/compile', (req, res) => {
  const code = req.body.code;
  const input = req.body.input || '';
  const instrumentedCode = instrumentCode(code);
  fs.writeFileSync('temp.cpp', instrumentedCode);
  fs.writeFileSync('input.txt', input);

  exec('g++ temp.cpp -o temp.exe', (error, stdout, stderr) => {
    if (error) {
      res.send({ success: false, error: stderr });
    } else {
      exec('temp.exe < input.txt', { timeout: 5000 }, (runError, runStdout, runStderr) => {
        if (runError && runError.killed) {
          res.send({ success: false, error: 'Time limit exceeded (5 seconds). Check for an infinite loop.' });
          return;
        }
        const steps = parseOutput(runStdout);
        res.send({ success: true, steps: steps });
      });
    }
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});