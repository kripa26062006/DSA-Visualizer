const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
console.log('File started running');
const { exec, spawn } = require('child_process');
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
function parseGdb(stdout, source) {
  const steps = [];
  let cur = null;

  for (const raw of stdout.split('\n')) {
        if (raw.startsWith('@@CHAINS@@')) {
      if (cur) cur.chains = JSON.parse(raw.slice(10));
      continue;
    }
    const line = raw.trim();
    const lineMatch = raw.match(/^(\d+)\t/);
    const frameMatch = line.match(/^#\d+\s+(?:0x[0-9a-f]+ in )?([\w:~]+) \((.*?)\) at /);
    const varMatch = line.match(/^(\w+) = (.*)$/);

    if (lineMatch) {
          cur = { line: Number(lineMatch[1]), variables: {}, stack: [], chains: {} };
      steps.push(cur);
    } else if (cur && frameMatch) {
      cur.stack.push(frameMatch[1] + '(' + frameMatch[2] + ')');
        } else if (cur && varMatch && varMatch[1] !== 'this') {
      let value = varMatch[2];
            if (value === '0x0') value = 'NULL';
      if (/^\{[-\d.,\s]+\}$/.test(value)) {
        value = '[' + value.slice(1, -1).replace(/,\s*/g, ' ') + ']';
      }
      cur.variables[varMatch[1]] = value;
    }
  }

  function declLine(name) {
    const re = new RegExp('(\\b(int|double|float|long long|char|bool)|\\w+\\s*\\*+)\\s*' + name + '\\b');
    return source.findIndex(l => re.test(l)) + 1;
  }

  const visible = new Set();
    let prev = null;
  for (const s of steps) {
    const d = s.stack.length;

    for (const key of [...visible]) {
      if (Number(key.split(':')[0]) > d) visible.delete(key);
    }
    for (const name of Object.keys(s.variables)) {
      if (s.line > declLine(name)) visible.add(d + ':' + name);
    }
    for (const name of Object.keys(s.variables)) {
      if (!visible.has(d + ':' + name)) delete s.variables[name];
    }
    for (const key of [...visible]) {
      const parts = key.split(':');
      if (Number(parts[0]) === d && !(parts[1] in s.variables)) visible.delete(key); 
    }
        for (const name of Object.keys(s.chains)) {
      if (!(name in s.variables)) delete s.chains[name];
    }
        if (prev) {
      for (const name of Object.keys(prev.chains)) {
        if (name in s.variables && !(name in s.chains) && s.variables[name] !== 'NULL') {
          s.chains[name] = prev.chains[name];
        }
      }
    }
    prev = s;
  }

    const shown = steps.filter(s => !(s.stack.length > 0 && /::/.test(s.stack[0])));
  return shown.map((s, i) => ({ step: i + 1, line: s.line, variables: s.variables, stack: s.stack, chains: s.chains }));
}
function startGdb(exe) {
  const gdb = spawn('gdb', ['-q', exe]);
  let buffer = '';
  let waiting = null;
  let closed = false;
  function onData(chunk) {
    buffer += chunk.toString();
    if (waiting && buffer.includes('@@END@@')) {
      const answer = buffer.split('@@END@@')[0].replace(/\(gdb\) /g, '');
      buffer = '';
      const done = waiting;
      waiting = null;
      done(answer);
    }
  }

  gdb.stdout.on('data', onData);
  gdb.stderr.on('data', onData);
  gdb.stdin.on('error', () => {});
    gdb.on('close', () => {
    closed = true;
    if (waiting) {
      const done = waiting;
      waiting = null;
      done('@@CLOSED@@');
    }
  });
 function ask(cmd) {
    return new Promise((resolve) => {
      if (closed) {
        resolve('@@CLOSED@@');
        return;
      }
      waiting = resolve;
      gdb.stdin.write(cmd + '\n');
      gdb.stdin.write('echo @@END@@\\n\n');
    });
  }
    return { ask, kill: () => gdb.kill() };
}
async function followChain(ask, name, typeName) {
  const nodes = [];
  let ptr = name;
  for (let i = 0; i < 20; i++) {
    const out = await ask('print *' + ptr);
    const m = out.match(/\{val = (-?\d+), next = (0x[0-9a-f]+)\}/);
    if (!m) break;
    nodes.push(Number(m[1]));
    if (m[2] === '0x0') break;
    ptr = '(' + typeName + '*)' + m[2];
  }
  return nodes;
}

app.post('/trace', (req, res) => {
  const code = req.body.code;
  const input = req.body.input || '';
  fs.writeFileSync('temp.cpp', code);
  fs.writeFileSync('input.txt', input);

  exec('g++ -g temp.cpp -o temp.exe', (error, stdout, stderr) => {
    if (error) {
      res.send({ success: false, error: stderr });
      return;
    }
    const show = 'bt\ninfo args\ninfo locals\n';
    let cmds = 'break main\nrun < input.txt\n' + show;
    for (let i = 0; i < 200; i++) {
      cmds += 'step\n' + show;
    }
    fs.writeFileSync('cmds.txt', cmds);

    exec('gdb -batch -x cmds.txt temp.exe', { timeout: 15000 }, (gdbError, gdbOut) => {
      if (gdbError && gdbError.killed) {
        res.send({ success: false, error: 'Time limit exceeded. Check for an infinite loop.' });
        return;
      }
      res.send({ success: true, steps: parseGdb(gdbOut, code.split('\n')) });
    });
  });
});
app.post('/tracelist', (req, res) => {
  const code = req.body.code;
  const input = req.body.input || '';
  fs.writeFileSync('temp.cpp', code);
  fs.writeFileSync('input.txt', input);

  const typeMatch = code.match(/struct\s+(\w+)\s*\{/);
  const typeName = typeMatch ? typeMatch[1] : null;

  exec('g++ -g -static temp.cpp -o temp.exe', async (error, stdout, stderr) => {
    if (error) {
      res.send({ success: false, error: stderr });
      return;
    }

    const g = startGdb('temp.exe');
    const timer = setTimeout(() => g.kill(), 20000);
    let all = '';

    await g.ask('set pagination off');
    await g.ask('break main');
    all += await g.ask('run < input.txt');

    for (let i = 0; i < 200; i++) {
      if (i > 0) {
        const stepOut = await g.ask('step');
        all += stepOut;
        if (/@@CLOSED@@|exited|not being run/.test(stepOut)) break;
      }

      const bt = await g.ask('bt');
      const args = await g.ask('info args');
      const locals = await g.ask('info locals');
      all += bt + args + locals;

      if (typeName) {
        const chains = {};
        for (const m of (args + locals).matchAll(/^(\w+) = (0x[0-9a-f]+)\s*$/gm)) {
          if (m[1] === 'this' || m[2] === '0x0') continue;
          const nodes = await followChain(g.ask, m[1], typeName);
          if (nodes.length) chains[m[1]] = nodes;
        }
                all += '\n@@CHAINS@@' + JSON.stringify(chains) + '\n';
      }
    }

    clearTimeout(timer);
    g.kill();
    res.send({ success: true, steps: parseGdb(all, code.split('\n')) });
  });
});
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
