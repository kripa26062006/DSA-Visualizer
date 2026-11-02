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
// ---------- LeetCode mode: find the method to call and build main() for it ----------
const INCLUDES = '#include <iostream>\n#include <vector>\n#include <string>\n#include <sstream>\n#include <algorithm>\n#include <climits>\n#include <cmath>\n#include <map>\n#include <set>\n#include <unordered_map>\n#include <unordered_set>\n#include <queue>\n#include <stack>\n#include <numeric>\n#include <bitset>\n#include <cstring>\n#include <cstdlib>\n#include <cstdint>\n#include <deque>\n#include <list>\n#include <functional>\nusing namespace std;\n';
const TREE_STRUCT = 'struct TreeNode { int val; TreeNode *left; TreeNode *right; TreeNode() : val(0), left(nullptr), right(nullptr) {} TreeNode(int x) : val(x), left(nullptr), right(nullptr) {} TreeNode(int x, TreeNode *l, TreeNode *r) : val(x), left(l), right(r) {} };\n';
function splitParams(s) {
  const out = [];
  let depth = 0;
  let cur = '';
  for (const ch of s) {
    if (ch === '<') depth++;
    if (ch === '>') depth--;
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
}

function supportedType(t) {
  const k = t.replace(/\s+/g, '');
  return /^(int|long|longlong|unsigned|unsignedint|short|bool|char|double|float|string|ListNode\*|TreeNode\*)$/.test(k) ||
    /^vector<(int|long|longlong|double|string)>$/.test(k);
}

function bodyEnd(s, open) {
  let d = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === '{') d++;
    else if (s[i] === '}' && --d === 0) return i;
  }
  return s.length;
}

function findSolutionMethod(bare) {
  const ci = bare.search(/class\s+Solution/);
  if (ci < 0) return null;
  let body = bare.slice(ci);
  body = body.slice(body.indexOf('{') + 1);
  const pub = body.search(/\bpublic\s*:/);
  if (pub >= 0) body = body.slice(pub);

  const re = /([\w:<>,\s*&]+?)\s+(\w+)\s*\(([^()]*)\)\s*(?:const\s*)?\{/g;
  const skip = /^(if|for|while|switch|return|else|catch|sizeof|new|delete)$/;
  const methods = [];
  let m;
  while ((m = re.exec(body))) {
    const before = body.slice(0, m.index);
    const depth = (before.match(/\{/g) || []).length - (before.match(/\}/g) || []).length;
    if (depth !== 0 || skip.test(m[2])) continue;
    const ret = m[1].replace(/\b(public|private|protected)\s*:/g, '')
      .replace(/\b(static|inline|virtual)\b/g, '').replace(/\s+/g, ' ').trim();
    if (!/\w/.test(ret)) continue;

    let params = [];
    for (const p of splitParams(m[3])) {
      const pm = p.replace(/=.*$/, '').trim().match(/^(.*?)\s*(\w+)$/);
      if (!pm) { params = null; break; }
      const type = pm[1].replace(/\bconst\b/g, '').replace(/&/g, '').replace(/\s+/g, ' ').trim();
      if (!supportedType(type)) { params = null; break; }
      params.push({ type, name: pm[2] });
    }
    const open = m.index + m[0].length - 1;
    methods.push({ name: m[2], ret, params, open, end: bodyEnd(body, open) });
  }
  const ok = methods.filter((x) => x.params);
  // prefer the method that no other method calls (so helpers like merge() are skipped)
  const called = (c) => methods.some((o) => o !== c && new RegExp('\\b' + c.name + '\\s*\\(').test(body.slice(o.open, o.end)));
  return ok.find((c) => !called(c)) || ok[0] || null;
}

function buildWrapper(method) {
  let w = '\n#line 100000\n' +
    'static string part_(const vector<string>& p, size_t i) { return i < p.size() ? p[i] : string(); }\n' +
    'int main() {\n' +
    'string all_, ln_; while (getline(cin, ln_)) { all_ += ln_; all_ += \' \'; }\n' +
    'vector<string> parts_; string cur_;\n' +
    'for (size_t i_ = 0; i_ < all_.size(); i_++) { if (all_[i_] == \'|\') { parts_.push_back(cur_); cur_.clear(); } else cur_ += all_[i_]; }\n' +
    'parts_.push_back(cur_);\n';
  const args = [];
  method.params.forEach((p, k) => {
    const a = 'arg' + k + '_';
    const key = p.type.replace(/\s+/g, '');
    const src = 'part_(parts_, ' + k + ')';
    args.push(a);
    if (key === 'TreeNode*') {
      w += 'TreeNode* ' + a + ' = NULL;\n' +
        '{ istringstream is_(' + src + '); string t_; vector<TreeNode*> nd_; while (is_ >> t_) { if (t_ == "null" || t_ == "N") nd_.push_back(NULL); else nd_.push_back(new TreeNode(atoi(t_.c_str()))); }\n' +
        'if (!nd_.empty()) { ' + a + ' = nd_[0]; size_t c_ = 1; for (size_t p_ = 0; p_ < nd_.size() && c_ < nd_.size(); p_++) { if (!nd_[p_]) continue; nd_[p_]->left = nd_[c_++]; if (c_ < nd_.size()) nd_[p_]->right = nd_[c_++]; } } }\n';
    } else if (key === 'ListNode*') {
      w += 'ListNode* ' + a + ' = NULL; ListNode* tail' + k + '_ = NULL;\n' +
        '{ istringstream is_(' + src + '); int x_; while (is_ >> x_) { ListNode* n_ = new ListNode(x_); if (' + a + ' == NULL) ' + a + ' = n_; else tail' + k + '_->next = n_; tail' + k + '_ = n_; } }\n';
    } else if (key === 'string') {
      w += 'string ' + a + ' = ' + src + ';\n' +
        '{ size_t b_ = ' + a + '.find_first_not_of(" "); size_t e_ = ' + a + '.find_last_not_of(" "); ' +
        a + ' = (b_ == string::npos) ? string() : ' + a + '.substr(b_, e_ - b_ + 1); ' +
        'if (' + a + '.size() >= 2 && ' + a + '[0] == \'"\' && ' + a + '.back() == \'"\') ' + a + ' = ' + a + '.substr(1, ' + a + '.size() - 2); }\n';
    } else if (key.startsWith('vector<')) {
      const inner = p.type.match(/vector<\s*(.*?)\s*>/)[1];
      w += p.type + ' ' + a + ';\n' +
        '{ istringstream is_(' + src + '); ' + inner + ' x_; while (is_ >> x_) ' + a + '.push_back(x_); }\n';
    } else {
      w += p.type + ' ' + a + '{}; { istringstream is_(' + src + '); is_ >> ' + a + '; }\n';
    }
  });
  w += 'Solution sol_;\n' + (method.ret === 'void' ? '' : 'auto result_ = ') +
    'sol_.' + method.name + '(' + args.join(', ') + ');\nreturn 0;\n}\n';
  return w;
}

function cleanArgs(a) {
  return a.replace(/(\w+)=(?:@0x[0-9a-f]+: )?(?:std::vector|\{<std::_Vector_base)[\s\S]*?(?=, \w+=|$)/g, '$1=[…]');
}
function parseGdb(stdout, source) {
  const steps = [];
  let cur = null;

  for (const raw of stdout.split('\n')) {
        if (raw.startsWith('@@VECS@@')) {
      if (cur) Object.assign(cur.variables, JSON.parse(raw.slice(8)));
      continue;
    }
if (raw.startsWith('@@TRIE@@')) {
      if (cur) cur.trie = JSON.parse(raw.slice(8));
      continue;
    }
    if (raw.startsWith('@@TREES@@')) {
      if (cur) cur.tree = JSON.parse(raw.slice(9));
      continue;
    }
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
   cur.stack.push(frameMatch[1] + '(' + cleanArgs(frameMatch[2]) + ')');
    } else if (cur && varMatch && varMatch[1] !== 'this') {
      let value = varMatch[2];
     if (value === '0x0') value = 'NULL';
      // std::string comes out of gdb as raw internals: show just "text"
      const sm = value.match(/^\{_M_dataplus = .*?_M_p = 0x[0-9a-f]+ ("(?:[^"\\]|\\.)*")(?:\.\.\.)?\}, _M_string_length = \d+/);
      if (sm) value = sm[1];
      // char comes out as: 89 'Y'  ->  'Y'
      const chm = value.match(/^-?\d+ ('.*')$/);
      if (chm) value = chm[1];
      
            if (/^\{(?:true|false)(?:,\s*(?:true|false))*\}$/.test(value)) {
        value = value.replace(/true/g, '1').replace(/false/g, '0');
      }
      if (/^\{[-\d.,\s]+\}$/.test(value)) {
        value = '[' + value.slice(1, -1).replace(/,\s*/g, ' ') + ']';
      }
      cur.variables[varMatch[1]] = value;
    }
  }

     function declLine(name) {
    const re = new RegExp('(\\b(int|double|float|long long|long|ll|int64_t|uint64_t|size_t|unsigned|char|bool|string)|(?:vector|unordered_map|unordered_set|map|set|multiset|multimap|stack|queue|deque|priority_queue|list|pair)<[^;()]*>|\\w+\\s*\\*+)\\s*&?\\s*' + name + '\\b');
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

  const shown = steps.filter(s =>
    s.line <= source.length && !(s.stack.length > 0 && /^(\w+)::~?\1\(/.test(s.stack[0]))
  );
  return shown.map((s, i) => ({ step: i + 1, line: s.line, variables: s.variables, stack: s.stack,chains: s.chains, tree: s.tree, trie: s.trie }));
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

async function followChain(ask, name, typeName, startAddr) {
  const nodes = [];
  let ptr = name;
  let addr = startAddr;
  for (let i = 0; i < 20; i++) {
    const out = await ask('print *' + ptr);
    const m = out.match(/\{val = (-?\d+), next = (0x[0-9a-f]+)\}/);
    if (!m) break;
    nodes.push({ v: Number(m[1]), a: addr });
    if (m[2] === '0x0') break;
    addr = m[2];
    ptr = '(' + typeName + '*)' + m[2];
  }
  return nodes;
}

// ---------- hash containers: unordered_map / map / unordered_set / set ----------
const KIND_SIZE = { i8: [1, 1], u8: [1, 1], i16: [2, 2], i32: [4, 4], u32: [4, 4], i64: [8, 8], u64: [8, 8], f64: [8, 8], str: [32, 8] };
const HASH_TAG = { unordered_map: 'umap', unordered_set: 'uset', map: 'omap', set: 'oset' };

function splitTop(s) {
  const out = [];
  let d = 0;
  let cur = '';
  for (const ch of s) {
    if (ch === '<') d++;
    if (ch === '>') d--;
    if (ch === ',' && d === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

function kindOf(t) {
  const x = t.replace(/\bconst\b/g, '').replace(/\s+/g, ' ').trim();
  if (/basic_string/.test(x)) return 'str';
  const table = { int: 'i32', 'unsigned int': 'u32', unsigned: 'u32', long: 'i64', 'long long': 'i64', 'unsigned long': 'u64', 'unsigned long long': 'u64', char: 'i8', 'signed char': 'i8', bool: 'u8', short: 'i16', double: 'f64' };
  return table[x] || null;
}

function parseHashType(wt) {
  const m = wt.match(/type = (?:const )?std::(?:__cxx11::)?(unordered_map|unordered_set|map|set)<([\s\S]*)>\s*$/);
  if (!m) return null;
  const a = splitTop(m[2]);
  const isMap = m[1].endsWith('map');
  const k = kindOf(a[0]);
  const v = isMap ? kindOf(a[1] || '') : 'ok';
  if (!k || !v) return null;
  return { tag: HASH_TAG[m[1]], ordered: m[1] === 'map' || m[1] === 'set', isMap, kinds: isMap ? [k, v] : [k] };
}

async function readBytes(ask, addr, n) {
  const out = await ask('x/' + n + 'xb ' + addr);
  const bytes = [];
  for (const line of out.split('\n')) {
    const i = line.indexOf(':');
    if (i < 0) continue;
    for (const t of line.slice(i + 1).match(/0x[0-9a-f]{1,2}\b/g) || []) bytes.push(parseInt(t, 16));
  }
  return bytes.length >= n ? bytes : null;
}

async function decodeHash(ask, kind, bytes, off) {
  const dv = new DataView(new Uint8Array(bytes).buffer);
  switch (kind) {
    case 'i8': return "'" + String.fromCharCode(dv.getUint8(off)) + "'";
    case 'u8': return dv.getUint8(off) ? 'true' : 'false';
    case 'i16': return String(dv.getInt16(off, true));
    case 'i32': return String(dv.getInt32(off, true));
    case 'u32': return String(dv.getUint32(off, true));
    case 'i64': return dv.getBigInt64(off, true).toString();
    case 'u64': return dv.getBigUint64(off, true).toString();
    case 'f64': return String(dv.getFloat64(off, true));
    case 'str': {
      const len = Number(dv.getBigUint64(off + 8, true));
      if (len > 40) return '"…"';
      if (len <= 15) return '"' + String.fromCharCode(...bytes.slice(off + 16, off + 16 + len)) + '"';
      const o = await ask('x/s 0x' + dv.getBigUint64(off, true).toString(16));
      const m = o.match(/"([\s\S]*)"/);
      return '"' + (m ? m[1] : '…') + '"';
    }
  }
  return '?';
}

// returns e.g.  umap/13{3: 30, 5: 50}   omap{1: 10}   uset/13{4, 9}   oset{6, 8}
async function readHash(ask, line, ti) {
  const count = Number((line.match(/_M_(?:element|node)_count = (\d+)/) || [])[1]);
  if (!(count >= 0)) return null;
  if (count > 40) return ti.tag + ' (' + count + ' items)';
  const buckets = ti.ordered ? 0 : Number((line.match(/_M_bucket_count = (\d+)/) || [])[1]);
  const up = (x, a) => Math.ceil(x / a) * a;
  const sk = KIND_SIZE[ti.kinds[0]];
  const sv = ti.isMap ? KIND_SIZE[ti.kinds[1]] : null;
  const vOff = ti.isMap ? up(sk[0], sv[1]) : 0;
  const pairSize = ti.isMap ? up(vOff + sv[0], Math.max(sk[1], sv[1])) : sk[0];
  const base = ti.ordered ? 32 : 8;
  const total = base + up(pairSize, 8);
  const items = [];
  const one = async (bytes) => {
    const k = await decodeHash(ask, ti.kinds[0], bytes, base);
    if (!ti.isMap) return k;
    return k + ': ' + (await decodeHash(ask, ti.kinds[1], bytes, base + vOff));
  };
  const ptrAt = (bytes, off) => '0x' + new DataView(new Uint8Array(bytes).buffer).getBigUint64(off, true).toString(16);
  let ok = true;
  if (ti.ordered) {
    const root = (line.match(/_M_header = \{[^}]*?_M_parent = (0x[0-9a-f]+)/) || [])[1];
    const walk = async (p, depth) => {
      if (!ok || !p || p === '0x0' || depth > 40 || items.length > 40) return;
      const bytes = await readBytes(ask, p, total);
      if (!bytes) { ok = false; return; }
      await walk(ptrAt(bytes, 16), depth + 1);
      items.push(await one(bytes));
      await walk(ptrAt(bytes, 24), depth + 1);
    };
    await walk(root, 0);
  } else {
    let p = (line.match(/_M_before_begin = \{_M_nxt = (0x[0-9a-f]+)\}/) || [])[1];
    while (ok && p && p !== '0x0' && items.length < count) {
      const bytes = await readBytes(ask, p, total);
      if (!bytes) { ok = false; break; }
      items.push(await one(bytes));
      p = ptrAt(bytes, 0);
    }
  }
  if (!ok || items.length !== count) return null;
  return ti.tag + (buckets ? '/' + buckets : '') + '{' + items.join(', ') + '}';
}
function splitTopQ(s) {
  const out = [];
  let cur = '';
  let d = 0;
  let q = false;
  for (let i = 0; i < s.length; i++) {
      const ch = s[i];
    if (!q && ch === "'") { const e = s.indexOf("'", i + (s[i + 1] === '\\' ? 3 : 2)); if (e > 0) { cur += s.slice(i, e + 1); i = e; continue; } }
    if (ch === '"' && s[i - 1] !== '\\') q = !q;   
    
    if (!q) {
      if (ch === '{') d++;
      if (ch === '}') d--;
    }
    if (ch === ',' && d === 0 && !q) { out.push(cur); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
}

// GDB with the libstdc++ printers prints  std::unordered_map with 2 elements = {[2] = 0, [7] = 1}
function prettyItems(body, isMap) {
  const inner = body.slice(1, -1).trim();
  if (!inner) return [];
  const fix = (x) => { const c = x.match(/^-?\d+ ('.*')$/); return c ? c[1] : x; };
  const out = [];
  for (const part of splitTopQ(inner)) {
    const p = part.trim();
    const e = isMap ? p.match(/^\[([\s\S]*?)\] = ([\s\S]*)$/) : p.match(/^\[\d+\] = ([\s\S]*)$/);
    if (!e) return null;
    const val = isMap ? e[2] : e[1];
    if (/^\{/.test(val) || /^std::/.test(val)) return null;
    out.push(isMap ? fix(e[1]) + ': ' + fix(e[2]) : fix(val));
  }
  return out;
}
// ---------- binary trees: read every node reachable from the pointers ----------
async function readTree(ask, type, roots) {
  const nodes = {};
  let level = [...new Set(roots)];
  for (let depth = 0; depth < 7 && level.length; depth++) {
    const todo = level.filter((a) => a && a !== '0x0' && !nodes[a]).slice(0, 40);
    if (!todo.length) break;
    const cmds = [];
    for (const a of todo) cmds.push('echo @@A:' + a + '\\n', 'print *(' + type + '*)' + a);
    const out = await ask(cmds.join('\n'));
    const next = [];
    for (const chunk of out.split('@@A:').slice(1)) {
      const addr = chunk.slice(0, chunk.indexOf('\n')).trim();
      const m = chunk.match(/= \{([^\n]*)\}/);
      if (!m) continue;
      const l = (m[1].match(/\bleft = (0x[0-9a-f]+)/) || [])[1];
      const r = (m[1].match(/\bright = (0x[0-9a-f]+)/) || [])[1];
      const v = (m[1].match(/(?:^|, )(?!left\b|right\b)\w+ = (-?\d+)/) || [])[1];
      if (l === undefined || r === undefined) continue;
      nodes[addr] = { v: v === undefined ? '?' : v, l, r };
      if (l !== '0x0') next.push(l);
      if (r !== '0x0') next.push(r);
    }
    level = next;
    if (Object.keys(nodes).length > 40) break;
  }
  return nodes;
}
// ---------- tries: a node with an array of child pointers ----------
function findTrieType(src) {
  const re = /(?:struct|class)\s+(\w+)\s*\{/g;
  let m;
  while ((m = re.exec(src))) {
    const open = m.index + m[0].length - 1;
    const body = src.slice(open + 1, bodyEnd(src, open));
    const f = body.match(new RegExp('\\b' + m[1] + '\\s*\\*\\s*(\\w+)\\s*\\[\\s*\\w+\\s*\\]'));
    if (f) return { type: m[1], field: f[1] };
  }
  return null;
}

// global pointers of the node type, e.g.  TrieNode* root = new TrieNode();
function globalPtrNames(bare, type) {
  const out = [];
  let depth = 0;
  for (const line of bare.split('\n')) {
    if (depth === 0) {
      const m = line.match(new RegExp('^\\s*(?:static\\s+)?' + type + '\\s*\\*\\s*(\\w+)\\s*(?:=|;)'));
      if (m) out.push(m[1]);
    }
    depth += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
  }
  return out;
}

function trieLabel(i, n) {
  if (n === 26) return String.fromCharCode(97 + i);
  if (n >= 128) return String.fromCharCode(i);
  return String(i);
}

async function readTrie(ask, trie, roots) {
  const nodes = {};
  let level = [...new Set(roots)];
  for (let depth = 0; depth < 14 && level.length; depth++) {
    const todo = level.filter((a) => a && a !== '0x0' && !nodes[a]).slice(0, 30);
    if (!todo.length) break;
    const cmds = [];
    for (const a of todo) cmds.push('echo @@A:' + a + '\\n', 'print *(' + trie.type + '*)' + a);
    const out = await ask(cmds.join('\n'));
    const next = [];
    for (const chunk of out.split('@@A:').slice(1)) {
      const addr = chunk.slice(0, chunk.indexOf('\n')).trim();
      const am = chunk.match(new RegExp('\\b' + trie.field + ' = \\{([^}]*)\\}'));
      if (!am) continue;
      const raw = am[1].replace(/(0x[0-9a-f]+) <repeats (\d+) times>/g, (mm, v, c) => Array(Number(c)).fill(v).join(', '));
      const slots = raw.split(',').map((s) => s.trim());
      const kids = [];
      slots.forEach((s, i) => {
        if (/^0x[0-9a-f]+$/.test(s) && s !== '0x0') {
          kids.push([trieLabel(i, slots.length), s]);
          next.push(s);
        }
      });
      const em = chunk.match(/\b(\w+) = (true|false)\b/);
      nodes[addr] = { k: kids, e: em ? em[2] === 'true' : null };
    }
    level = next;
    if (Object.keys(nodes).length > 60) break;
  }
  return nodes;
}
function prettyList(body) {
  const inner = body.slice(1, -1).trim();
  if (!inner) return [];
  const out = [];
  for (const part of splitTopQ(inner)) {
    const p = part.trim().replace(/^(-?\d+) ('.*')$/, '$2');
    if (/^\{/.test(p) || /^std::/.test(p)) return null;
    out.push(p);
  }
  return out;
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
  const userCode = req.body.code;
  const input = req.body.input || '';
  const bare = userCode.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

  let src = userCode;
  let startAt = 'main';
  let typeName = null;
  let treeType = null;
    let trie = null;
  let trieGlobals = [];
  const isLeet = /class\s+Solution/.test(bare) && !/\bmain\s*\(/.test(bare);

  if (isLeet) {
    const method = findSolutionMethod(bare);
    if (!method) {
      res.send({ success: false, error: 'Could not find a method I can call. Supported parameter types: int, long long, double, bool, char, string, vector<int>, vector<string>, ListNode*.' });
      return;
    }
    const hasNode = /struct\s+ListNode/.test(bare);
    const header = INCLUDES +
      (hasNode ? '' : 'struct ListNode { int val; ListNode* next; ListNode(int x) : val(x), next(NULL) {} };\n') +
(/struct\s+TreeNode/.test(bare) || !/TreeNode/.test(bare) ? '' : TREE_STRUCT) +
      '#line 1\n';
      src = header + userCode + buildWrapper(method);
    startAt = 'Solution::' + method.name;
if (/ListNode/.test(bare)) typeName = 'ListNode';
    if (/TreeNode/.test(bare)) { typeName = 'TreeNode'; treeType = 'TreeNode'; }
  } else {
    const typeMatch = userCode.match(/struct\s+(\w+)\s*\{/);
typeName = typeMatch ? typeMatch[1] : null;
    const sBody = userCode.match(/struct\s+\w+\s*\{([\s\S]*?)\n?\};/);
    if (typeName && sBody && /\bleft\b/.test(sBody[1]) && /\bright\b/.test(sBody[1])) treeType = typeName;
         if (!treeType) {
      trie = findTrieType(bare);
      if (trie) trieGlobals = globalPtrNames(bare, trie.type);
    }  
  }

  fs.writeFileSync('temp.cpp', src);
  fs.writeFileSync('input.txt', input);
  exec('g++ -std=c++17 -g -static temp.cpp -o temp.exe', async (error, stdout, stderr) => {
    if (error) {
      res.send({ success: false, error: stderr });
      return;
    }

    const g = startGdb('temp.exe');
    const timer = setTimeout(() => g.kill(), 60000);
    let all = '';

    await g.ask('set pagination off');
    await g.ask('set width 0');
    await g.ask('set print repeats unlimited');
    await g.ask('break ' + startAt);
    all += await g.ask('run < input.txt');

    let recorded = 0;
    for (let iter = 0; iter < 1500 && recorded < 300; iter++) {
      if (iter > 0) {
        let stepOut = await g.ask('step');
        let skipped = false;
        let guard = 0;
        // stepped into library code (std::vector::size, operator[] ...)? run it to the end
        const inLib = (t) => t.split('\n').some((l) =>
          !/^\d+\t/.test(l) && !/^Run till exit/.test(l) && / at (?!temp\.cpp:)\S+:\d+/.test(l));
        while (inLib(stepOut) && guard < 8) {
          stepOut = await g.ask('finish');
          skipped = true;
          guard++;
        }
        if (/@@CLOSED@@|exited|not being run/.test(stepOut)) break;
              if (skipped && /^0x[0-9a-f]+ in /m.test(stepOut)) continue;
        all += stepOut;
      }

      const bt = await g.ask('bt');
      if (isLeet && !bt.includes(startAt)) break;
      const args = await g.ask('info args');
      let locals = await g.ask('info locals');
      // global vectors (e.g. vector<vector<int>> res;) are not in info locals
      let dep0 = 0;
      for (const ln of userCode.split('\n')) {
        const gm = dep0 === 0 && ln.match(/^\s*(?:static\s+)?(?:(?:std::)?vector\s*<.*>|int|long long|long|bool|double|float|char|unsigned)\s+(\w+)\s*(?:\[[^\]]*\]\s*)*(?:=|;)/);
        dep0 += (ln.match(/\{/g) || []).length - (ln.match(/\}/g) || []).length;
        if (!gm || new RegExp('^' + gm[1] + ' = ', 'm').test(args + locals)) continue;
        const go = await g.ask('print ' + gm[1]);
        const gv = go.match(/\$\d+ = ([\s\S]*)/);
        if (gv) locals += gm[1] + ' = ' + gv[1].replace(/\s*\n\s*/g, ' ').trim() + '\n';
      }
      all += bt + args + locals;
      recorded++;

      // vectors: read the real elements out of memory
           const vecs = {};
      // arrays of vectors, e.g.  vector<int> adj[6];  (adjacency lists)
      const avNames = new Set();
      for (const m of (args + locals).matchAll(/^(\w+) = (\{(?:std::vector|<std::_Vector_base).*)$/gm)) {
        const wt = await g.ask('whatis ' + m[1]);
        const am = wt.match(/type = (?:std::)?vector<.*> \[(\d+)\]/);
        if (!am) continue;
        const cnt = Number(am[1]);
        avNames.add(m[1]);
        if (cnt > 40) { vecs[m[1]] = 'vector (' + cnt + ' items)'; continue; }
        const rc = [];
        for (let r = 0; r < cnt; r++) {
          const e = m[1] + '[' + r + ']._M_impl';
          rc.push('echo @@R\\n', 'print *' + e + '._M_start@(long)(' + e + '._M_finish - ' + e + '._M_start)');
        }
        const rOut = await g.ask(rc.join('\n'));
        const rows = rOut.split('@@R').slice(1).map((c) => { const mm = c.match(/=\s*\{([^}]*)\}/); return mm ? mm[1].trim() : ''; });
        if (rows.length === cnt && rows.every((r) => /^[-\d.,\s]*$/.test(r))) {
          vecs[m[1]] = 'res{' + rows.map((r) => '[' + r.replace(/,\s*/g, ' ') + ']').join(', ') + '}';
        }
      }
      for (const m of (args + locals).matchAll(/^(\w+) = (.*(?:std::vector|_Vector_base|_Bvector_base).*)$/gm)) {
        const nm = m[1];
        if (avNames.has(nm)) continue;
        // vector<bool> is stored as packed bits, so it is read differently
        if (/_Bvector_base|vector<bool/.test(m[2])) {
          const st = nm + '._M_impl._M_start';
          const fi = nm + '._M_impl._M_finish';
          const wOut = await g.ask('print (int)(sizeof(*' + st + '._M_p) * 8)');
          const wm = wOut.match(/=\s*(\d+)/);
          if (!wm) continue;
          const wb = Number(wm[1]);
          const cOut = await g.ask('print (long)(' + fi + '._M_p - ' + st + '._M_p) * ' + wb + ' + (long)' + fi + '._M_offset - (long)' + st + '._M_offset');
          const cm = cOut.match(/=\s*(-?\d+)/);
          if (!cm) continue;
          const cnt = Number(cm[1]);
          if (cnt === 0) { vecs[nm] = '[]'; continue; }
          if (cnt < 0 || cnt > 200) { vecs[nm] = 'vector<bool> (' + cnt + ' items)'; continue; }
          try {
            const wordsOut = await g.ask('print *' + st + '._M_p@' + Math.ceil(cnt / wb));
            const wmatch = wordsOut.match(/=\s*\{([^}]*)\}/);
            const ws = wmatch[1].split(',').map((x) => BigInt(x.trim()));
            const bits = [];
            for (let k = 0; k < cnt; k++) {
              bits.push(((ws[Math.floor(k / wb)] >> BigInt(k % wb)) & BigInt(1)) === BigInt(1) ? '1' : '0');
            }
            vecs[nm] = '[' + bits.join(' ') + ']';
          } catch (err) {
            vecs[nm] = 'vector<bool> (' + cnt + ' items)';
          }
          continue;
        }

        const lenOut = await g.ask('print (long)(' + nm + '._M_impl._M_finish - ' + nm + '._M_impl._M_start)');
        const lm = lenOut.match(/=\s*(-?\d+)/);
        if (!lm) continue;
        const n = Number(lm[1]);
        if (n === 0) { vecs[nm] = '[]'; continue; }
        if (n < 0 || n > 200) { vecs[nm] = 'vector (' + n + ' items)'; continue; }
        const elOut = await g.ask('print *' + nm + '._M_impl._M_start@' + n);
        const em = elOut.match(/=\s*\{([^}]*)\}/);
                if (em && /^[-\d.,\s]+$/.test(em[1])) { vecs[nm] = '[' + em[1].trim().replace(/,\s*/g, ' ') + ']'; continue; }
        vecs[nm] = 'vector (' + n + ' items)';
        if (n <= 40) {
          // vector of vectors: read every row
          const rc = [];
          for (let r = 0; r < n; r++) {
            const e = nm + '._M_impl._M_start[' + r + ']._M_impl';
            rc.push('echo @@R\\n', 'print *' + e + '._M_start@(long)(' + e + '._M_finish - ' + e + '._M_start)');
          }
          const rOut = await g.ask(rc.join('\n'));
          const rows = rOut.split('@@R').slice(1).map((c) => { const mm = c.match(/=\s*\{([^}]*)\}/); return mm ? mm[1].trim() : ''; });
          if (rows.length === n && rows.every((r) => /^[-\d.,\s]*$/.test(r))) {
            const isRes = new RegExp('\\b' + nm + '\\s*\\.\\s*(push_back|emplace_back)\\s*\\(').test(userCode);
            const ragged = rows.some((r) => r.split(',').length !== rows[0].split(',').length) || rows.some((r) => !r);
            vecs[nm] = (isRes || ragged)
              ? 'res{' + rows.map((r) => '[' + r.replace(/,\s*/g, ' ') + ']').join(', ') + '}'
              : '{' + rows.map((r) => '{' + r + '}').join(', ') + '}';
          }
        }
      }

      // int a[] parameters arrive as plain pointers: read n elements from memory
      if (!typeName) {
        let cnt = 0;
        for (const sn of ['n', 'size', 'len', 'length', 'N', 'sz']) {
          const mm = (args + locals).match(new RegExp('^' + sn + ' = (\\d+)\\s*$', 'm'));
          if (mm) { cnt = Number(mm[1]); break; }
        }
        if (cnt > 0 && cnt <= 200) {
          for (const m of args.matchAll(/^(\w+) = (0x[0-9a-f]+)\s*$/gm)) {
            if (m[1] === 'this') continue;
            const wt = await g.ask('whatis ' + m[1]);
            if (!/type = (?:const )?(?:unsigned )?(?:int|long|long long|short|double|float|bool) \*/.test(wt)) continue;
            const el = await g.ask('print *' + m[1] + '@' + cnt);
            const em = el.match(/=\s*\{([^}]*)\}/);
            if (em && /^[-\d.,\s]+$/.test(em[1])) vecs[m[1]] = '[' + em[1].trim().replace(/,\s*/g, ' ') + ']';
          }
        }
      }
      // hash containers: unordered_map / map / unordered_set / set
      const typeCache = (g.typeCache = g.typeCache || {});
      for (const m of (args + locals).matchAll(/^(\w+) = (?:@0x[0-9a-f]+: )?(\{_M_(?:h|t) = .*)$/gm)) {
        let ti = typeCache[m[1]];
        if (!ti) {
          ti = parseHashType(await g.ask('whatis ' + m[1]));
          if (ti) typeCache[m[1]] = ti;
        }
        if (!ti) continue;
        const txt = await readHash(g.ask, m[2], ti);
        if (txt) vecs[m[1]] = txt;
      }
            // same containers, when gdb prints them with the libstdc++ pretty printers
      for (const m of (args + locals).matchAll(/^(\w+) = (?:@0x[0-9a-f]+: )?std::(?:__cxx11::)?(unordered_map|unordered_set|map|set) with (\d+) elements?(?: = (\{.*\}))?\s*$/gm)) {
        const tag = HASH_TAG[m[2]];
        const n = Number(m[3]);
        const items = n > 40 ? null : prettyItems(m[4] || '{}', m[2].endsWith('map'));
        if (!items) { vecs[m[1]] = tag + ' (' + n + ' items)'; continue; }
        let b = '';
        if (m[2].startsWith('unordered')) {
          const bm = (await g.ask('print ' + m[1] + '._M_h._M_bucket_count')).match(/=\s*(\d+)/);
          if (bm) b = '/' + bm[1];
        }
        vecs[m[1]] = tag + b + '{' + items.join(', ') + '}';
      }
            // std::stack<T>  ->  stk{bottom, ..., top}  (read straight out of the deque's memory)
      for (const m of (args + locals).matchAll(/^(\w+) = (?:@0x[0-9a-f]+: )?(?:\{c = \{<std::_Deque_base)/gm)) {
        const nm = m[1];
        let kind = typeCache['stk:' + nm];
        if (kind === undefined) {
          const wt = await g.ask('whatis ' + nm);
          const tm = wt.match(/type = (?:const )?std::stack<([^,<>]+?)\s*(?:,|>)/);
          kind = tm ? kindOf(tm[1]) : null;
          if (kind === 'str') kind = null;
          typeCache['stk:' + nm] = kind;
        }
        if (!kind) continue;
        const D = nm + '.c._M_impl';
        const head = await g.ask([
          'print (long)(' + D + '._M_finish._M_node - ' + D + '._M_start._M_node) * (long)(' + D + '._M_start._M_last - ' + D + '._M_start._M_first) + (long)(' + D + '._M_finish._M_cur - ' + D + '._M_finish._M_first) - (long)(' + D + '._M_start._M_cur - ' + D + '._M_start._M_first)',
          'print (long)(' + D + '._M_start._M_last - ' + D + '._M_start._M_first)',
          'print (long)(' + D + '._M_start._M_cur - ' + D + '._M_start._M_first)',
        ].join('\n'));
        const hv = [...head.matchAll(/^\$\d+ = (-?\d+)\s*$/gm)].map((x) => Number(x[1]));
        if (hv.length !== 3) continue;
        const [cnt, per, first] = hv;
        if (cnt < 0 || per <= 0) continue;
        if (cnt === 0) { vecs[nm] = 'stk{}'; continue; }
        if (cnt > 40) { vecs[nm] = 'stack (' + cnt + ' items)'; continue; }
        const cmds = [];
        for (let k = 0; k < cnt; k++) {
          const gi = first + k;
          cmds.push('print ' + D + '._M_start._M_node[' + Math.floor(gi / per) + '][' + (gi % per) + ']');
        }
        const out = await g.ask(cmds.join('\n'));
        const vals = [...out.matchAll(/^\$\d+ = (.*)$/gm)].map((x) => {
          const t = x[1].trim();
          const c = t.match(/^-?\d+ ('.*')$/);
          return c ? c[1] : t;
        });
        if (vals.length === cnt) vecs[nm] = 'stk{' + vals.join(', ') + '}';
      }
            // stack / queue / priority_queue / deque (gdb pretty-printer format)
      for (const m of (args + locals).matchAll(/^(\w+) = (?:@0x[0-9a-f]+: )?std::(?:(stack|queue|priority_queue) wrapping: std::(?:deque with (\d+) elements?|vector of length (\d+), capacity \d+)|(deque) with (\d+) elements?)(?: = (\{.*\}))?\s*$/gm)) {
        const kind = m[2] || m[5];
        const tag = { stack: 'stk', queue: 'que', priority_queue: 'pq', deque: 'dq' }[kind];
        const n = Number(m[3] || m[4] || m[6]);
        const items = n > 40 ? null : prettyList(m[7] || '{}');
        vecs[m[1]] = items ? tag + '{' + items.join(', ') + '}' : tag + ' (' + n + ' items)';
      }
      all += '\n@@VECS@@' + JSON.stringify(vecs) + '\n';
      if (treeType) {
        const lineNow = Number((bt.match(/^#0\s.*? at [^\n]*?:(\d+)/m) || [])[1]);
        const srcLines = userCode.split('\n');
             const tp = [];
        const here = {}; // pointer variable -> address (or null) in this frame
        for (const part of [[args, true], [locals, false]]) {
          for (const m of part[0].matchAll(/^(\w+) = (?:@0x[0-9a-f]+: )?(0x[0-9a-f]+)\s*$/gm)) {
            if (m[1] === 'this') continue;
            if (!part[1]) {
              // a local: only trust it after the line that declares it has run
              const re = new RegExp('\\w+\\s*\\*+\\s*' + m[1] + '\\s*(?:=|;)');
              let d = 0;
              srcLines.forEach((l, i) => { if (i + 1 <= lineNow && re.test(l)) d = i + 1; });
              if (!d || !(lineNow > d)) continue;
            }
            if (typeCache['t:' + m[1]] === undefined) {
              const wt = await g.ask('whatis ' + m[1]);
              typeCache['t:' + m[1]] = new RegExp('type = (?:const )?' + treeType + ' \\*').test(wt);
            }
            if (!typeCache['t:' + m[1]]) continue;
            here[m[1]] = m[2] === '0x0' ? null : m[2];
            if (m[2] !== '0x0') tp.push(m[2]);
          }
        }
        const depthNow = (bt.match(/^#\d+/gm) || []).length;
        if (g.minDepth === undefined || depthNow < g.minDepth) { g.minDepth = depthNow; g.rootVars = {}; }
        if (depthNow === g.minDepth) Object.assign(g.rootVars, here);
        const rootsNow = Object.values(g.rootVars).filter(Boolean);
        const nodes = await readTree(g.ask, treeType, [...rootsNow, ...tp]);
        const isChild = new Set();
        Object.values(nodes).forEach((n) => { isChild.add(n.l); isChild.add(n.r); });
        const roots = Object.keys(nodes).filter((a) => !isChild.has(a));
        all += '\n@@TREES@@' + JSON.stringify({ nodes, roots }) + '\n';
              console.log('tree nodes:', Object.keys(nodes).length, 'line', lineNow);
      }
            if (trie) {
        const lineNow = Number((bt.match(/^#0\s.*? at [^\n]*?:(\d+)/m) || [])[1]);
        const srcLines = userCode.split('\n');
        const tp = [];
        const here = {};
        const members = {};
        const isNodePtr = async (expr, key) => {
          if (key && typeCache[key] !== undefined) return typeCache[key];
          const wt = await g.ask('whatis ' + expr);
          const ok = new RegExp('type = (?:const )?' + trie.type + ' \\*').test(wt);
          if (key) typeCache[key] = ok;
          return ok;
        };
        // pointer variables of this frame (a local only counts after its declaration has run)
        for (const part of [[args, true], [locals, false]]) {
          for (const m of part[0].matchAll(/^(\w+) = (?:@0x[0-9a-f]+: )?(0x[0-9a-f]+)\s*$/gm)) {
            if (m[1] === 'this' || m[2] === '0x0') continue;
            if (!part[1]) {
              const re = new RegExp('\\w+\\s*\\*+\\s*' + m[1] + '\\s*(?:=|;)');
              let d = 0;
              srcLines.forEach((l, i) => { if (i + 1 <= lineNow && re.test(l)) d = i + 1; });
              if (!d || !(lineNow > d)) continue;
            }
            if (await isNodePtr(m[1], 'tt:' + m[1])) { here[m[1]] = m[2]; tp.push(m[2]); }
          }
        }
        // inside a method: this is a node, or an object that holds the root (class Trie { Node* root; })
        const tm = args.match(/^this = (0x[0-9a-f]+)/m);
        if (tm) {
          if (await isNodePtr('this', null)) { members.this = tm[1]; tp.push(tm[1]); }
          else {
            const so = await g.ask('print *this');
            for (const mm of so.matchAll(/\b(\w+) = (0x[0-9a-f]+)\b/g)) {
              if (mm[2] === '0x0') continue;
              if (await isNodePtr('this->' + mm[1], 'tm:' + mm[1])) { members[mm[1]] = mm[2]; tp.push(mm[2]); }
            }
          }
        }
        // global root pointers
        for (const gname of trieGlobals) {
          const go = await g.ask('print ' + gname);
          const gm = go.match(/=\s*(?:\([^)]*\)\s*)?(0x[0-9a-f]+)/);
          if (gm && gm[1] !== '0x0') { members[gname] = gm[1]; tp.push(gm[1]); }
        }
        const keep = Object.assign({}, members);
        delete keep.this;
        if (Object.keys(keep).length) g.trieMembers = keep;
        const memNow = Object.assign({}, g.trieMembers || {}, members);
        const depthNow = (bt.match(/^#\d+/gm) || []).length;
        if (g.minDepth === undefined || depthNow < g.minDepth) { g.minDepth = depthNow; g.rootVars = {}; }
        if (depthNow === g.minDepth) Object.assign(g.rootVars, here);
        const rootsNow = Object.values(g.rootVars).concat(Object.values(memNow));
        const nodes = await readTrie(g.ask, trie, [...rootsNow, ...tp]);
        const isChild = new Set();
        Object.values(nodes).forEach((n) => n.k.forEach((kv) => isChild.add(kv[1])));
        const roots = Object.keys(nodes).filter((a) => !isChild.has(a));
        all += '\n@@TRIE@@' + JSON.stringify({ nodes, roots, members: memNow }) + '\n';
      }
      if (typeName && !treeType && !trie) {
        const chains = {};
      for (const m of (args + locals).matchAll(/^(\w+) = (0x[0-9a-f]+)\s*$/gm)) {
          if (m[1] === 'this' || m[2] === '0x0') continue;
          const nodes = await followChain(g.ask, m[1], typeName, m[2]);
          if (nodes.length) chains[m[1]] = nodes;
        }
        all += '\n@@CHAINS@@' + JSON.stringify(chains) + '\n';
      }
    }

    clearTimeout(timer);
    g.kill();
    res.send({ success: true, steps: parseGdb(all, userCode.split('\n')) });
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000 - hashing version');
});