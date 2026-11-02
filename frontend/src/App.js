/* global BigInt */
import './App.css';
import { useState, useEffect, useMemo } from 'react';

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
    name: 'Binary search',
    code: `#include <iostream>
using namespace std;
int main() {
int arr[8] = {2, 5, 8, 12, 16, 23, 38, 56};
int target = 23;
int lo = 0;
int hi = 7;
int found = -1;
while (lo <= hi) {
int mid = (lo + hi) / 2;
if (arr[mid] == target) {
found = mid;
break;
}
if (arr[mid] < target) {
lo = mid + 1;
} else {
hi = mid - 1;
}
}
return 0;
}`,
    input: '',
  },
  {
    name: '2D grid sum',
    code: `#include <iostream>
using namespace std;
int main() {
int grid[2][3] = {{1, 2, 3}, {4, 5, 6}};
int sum = 0;
for (int i = 0; i < 2; i++) {
for (int j = 0; j < 3; j++) {
sum += grid[i][j];
}
}
return 0;
}`,
    input: '',
  },
  {
    name: 'DP: grid paths (2D)',
    code: `#include <iostream>
using namespace std;
int main() {
int dp[3][4] = {{0, 0, 0, 0}, {0, 0, 0, 0}, {0, 0, 0, 0}};
for (int i = 0; i < 3; i++) {
for (int j = 0; j < 4; j++) {
if (i == 0 || j == 0) {
dp[i][j] = 1;
} else {
dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
}
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
   {
    name: 'Factorial (recursion)',
    code: `#include <iostream>
using namespace std;
int fact(int n) {
if (n <= 1) {
return 1;
}
int r = n * fact(n - 1);
return r;
}
int main() {
int result = fact(3);
return 0;
}`,
    input: '',
  },
    {
    name: 'Linked list walk',
    code: `#include <iostream>
using namespace std;
struct ListNode {
int val;
ListNode* next;
ListNode(int x) { val = x; next = NULL; }
};
int main() {
ListNode* head = new ListNode(1);
head->next = new ListNode(2);
head->next->next = new ListNode(3);
ListNode* cur = head;
while (cur != NULL) {
cur = cur->next;
}
return 0;
}`,
    input: '',
  },
    {
    name: 'Reverse linked list',
    code: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = NULL;
        ListNode* cur = head;
        while (cur != NULL) {
            ListNode* next = cur->next;
            cur->next = prev;
            prev = cur;
            cur = next;
        }
        return prev;
    }
};`,
    input: '1 2 3 4',
  },
    {
    name: 'Merge sort (linked list)',
    code: `class Solution {
public:
    ListNode* merge(ListNode* h1, ListNode* h2) {
        ListNode* h = new ListNode(0);
        ListNode* t = h;
        while (h1 != NULL && h2 != NULL) {
            if (h1->val < h2->val) {
                t->next = h1;
                h1 = h1->next;
            } else {
                t->next = h2;
                h2 = h2->next;
            }
            t = t->next;
        }
        if (h1 != NULL) t->next = h1;
        else t->next = h2;
        return h->next;
    }

    ListNode* sortList(ListNode* head) {
        if (head == NULL || head->next == NULL) return head;
        ListNode* s = head;
        ListNode* f = head->next;
        while (f != NULL && f->next != NULL) {
            s = s->next;
            f = f->next->next;
        }
        ListNode* second = s->next;
        s->next = NULL;
        ListNode* left = sortList(head);
        ListNode* right = sortList(second);
        return merge(left, right);
    }
};`,
    input: '4 2 1 3',
  },
    {
    name: 'Bits: count set bits',
    code: `#include <iostream>
using namespace std;
int main() {
int n = 13;
int count = 0;
while (n != 0) {
n = n & (n - 1);
count++;
}
return 0;
}`,
    input: '',
  },
  {
    name: 'Bits: swap with XOR',
    code: `#include <iostream>
using namespace std;
int main() {
int a = 5;
int b = 9;
a = a ^ b;
b = a ^ b;
a = a ^ b;
return 0;
}`,
    input: '',
  },
    {
    name: 'LeetCode: Single Number II (vector + bits)',
    code: `class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int n = nums.size();
        int result = 0;
        for (int i = 0; i < 32; i++) {
            int count = 0;
            for (int j = 0; j < n; j++) {
                if (nums[j] & (1 << i)) {
                    count++;
                }
            }
            if (count % 3 != 0) {
                result |= (1 << i);
            }
        }
        return result;
    }
};`,
    input: '2 2 3 2',
  },
    {
    name: 'Math: GCD (Euclid)',
    code: `#include <iostream>
using namespace std;
int main() {
int a = 48;
int b = 18;
while (b != 0) {
int r = a % b;
a = b;
b = r;
}
return 0;
}`,
    input: '',
  },
  {
    name: 'Math: is it prime? (trial division)',
    code: `#include <iostream>
using namespace std;
int main() {
int n = 29;
bool prime = true;
for (int i = 2; i * i <= n; i++) {
if (n % i == 0) {
prime = false;
break;
}
}
return 0;
}`,
    input: '',
  },
  {
    name: 'Math: Sieve of Eratosthenes',
    code: `#include <iostream>
using namespace std;
int main() {
int n = 30;
bool isPrime[31] = {};
for (int i = 2; i <= n; i++) {
isPrime[i] = true;
}
for (int i = 2; i * i <= n; i++) {
if (isPrime[i]) {
for (int j = i * i; j <= n; j += i) {
isPrime[j] = false;
}
}
}
return 0;
}`,
    input: '',
  },
  {
    name: 'Math: fast power mod (3^13 mod 7)',
    code: `#include <iostream>
using namespace std;
int main() {
long long base = 3;
long long p = 13;
long long mod = 7;
long long result = 1;
base = base % mod;
while (p > 0) {
if (p % 2 == 1) {
result = result * base % mod;
}
p = p / 2;
base = base * base % mod;
}
return 0;
}`,
    input: '',
  },
  {
    name: 'Math: big product mod 1e9+7',
    code: `#include <iostream>
using namespace std;
int main() {
long long MOD = 1000000007;
long long a = 123456789;
long long b = 987654321;
long long prod = a * b % MOD;
long long sum = (a + b) % MOD;
return 0;
}`,
    input: '',
  },
  {
    name: 'Math: Pascal triangle (nCr)',
    code: `#include <iostream>
using namespace std;
int main() {
int dp[6][6] = {};
for (int i = 0; i < 6; i++) {
dp[i][0] = 1;
for (int j = 1; j <= i; j++) {
dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
}
}
return 0;
}`,
    input: '',
  },
  {
    name: 'Hash: Two Sum (unordered_map)',
    code: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int,int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int need = target - nums[i];
            if (seen.count(need)) {
                return {seen[need], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
    input: '2 7 11 15|9',
  },
  {
    name: 'Hash: word count (string keys, map, set)',
    code: `#include <iostream>
#include <map>
#include <unordered_map>
#include <set>
#include <string>
using namespace std;
int main() {
unordered_map<string,int> freq;
freq["apple"] = 1;
freq["banana"] = 2;
freq["apple"] = 3;
map<int,int> m;
m[5] = 50;
m[2] = 20;
m[9] = 90;
set<int> s;
s.insert(4);
s.insert(1);
int x = 0;
return 0;
}`,
    input: '',
  },
  {
    name: 'Hash: unique count (unordered_set + erase)',
    code: `class Solution {
public:
    int countUnique(vector<int>& nums) {
        unordered_set<int> seen;
        for (int i = 0; i < nums.size(); i++) {
            seen.insert(nums[i]);
        }
        seen.erase(3);
        return seen.size();
    }
};`,
    input: '3 1 3 2 1',
  },
    {
    name: 'Tree: max depth (LeetCode, type the tree in stdin)',
    code: `class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (root == NULL) return 0;
        int l = maxDepth(root->left);
        int r = maxDepth(root->right);
        return 1 + max(l, r);
    }
};`,
    input: '3 9 20 null null 15 7',
  },
  {
    name: 'Tree: BST insert + inorder',
    code: `#include <iostream>
using namespace std;
struct Node {
    int val;
    Node* left;
    Node* right;
    Node(int v) : val(v), left(NULL), right(NULL) {}
};
Node* insert(Node* root, int x) {
    if (root == NULL) return new Node(x);
    if (x < root->val) root->left = insert(root->left, x);
    else root->right = insert(root->right, x);
    return root;
}
void inorder(Node* root) {
    if (root == NULL) return;
    inorder(root->left);
    cout << root->val << " ";
    inorder(root->right);
}
int main() {
    Node* root = NULL;
    root = insert(root, 5);
    root = insert(root, 3);
    root = insert(root, 8);
    root = insert(root, 1);
    inorder(root);
    return 0;
}`,
    input: '',
  },
  {
    name: 'Heap: priority_queue (max and min)',
    code: `#include <iostream>
#include <queue>
#include <vector>
using namespace std;
int main() {
priority_queue<int> mx;
mx.push(5);
mx.push(9);
mx.push(2);
mx.push(7);
mx.pop();
priority_queue<int, vector<int>, greater<int>> mn;
mn.push(5);
mn.push(9);
mn.push(2);
mn.push(7);
mn.pop();
return 0;
}`,
    input: '',
  },
  {
    name: 'Heap: build a min-heap by hand (sift up)',
    code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
void push(vector<int>& h, int x) {
h.push_back(x);
int i = h.size() - 1;
while (i > 0 && h[(i - 1) / 2] > h[i]) {
swap(h[(i - 1) / 2], h[i]);
i = (i - 1) / 2;
}
}
int main() {
vector<int> h;
push(h, 5);
push(h, 8);
push(h, 3);
push(h, 1);
push(h, 6);
return 0;
}`,
    input: '',
  },
  {
    name: 'Stack: push, top, pop',
    code: `#include <iostream>
#include <stack>
using namespace std;
int main() {
stack<int> st;
st.push(10);
st.push(20);
st.push(30);
int a = st.top();
st.pop();
st.push(40);
st.pop();
st.pop();
int left = st.size();
return 0;
}`,
    input: '',
  },
  {
    name: 'Stack: balanced brackets',
    code: `#include <iostream>
#include <stack>
#include <string>
using namespace std;
int main() {
string s = "({[]})";
stack<char> st;
bool ok = true;
for (int i = 0; i < s.size(); i++) {
char c = s[i];
if (c == '(' || c == '{' || c == '[') {
st.push(c);
} else {
if (st.empty()) {
ok = false;
break;
}
char t = st.top();
st.pop();
if ((c == ')' && t != '(') || (c == '}' && t != '{') || (c == ']' && t != '[')) {
ok = false;
break;
}
}
}
if (!st.empty()) {
ok = false;
}
return 0;
}`,
    input: '',
  },
  {
    name: 'Stack: next greater element',
    code: `class Solution {
public:
    vector<int> nextGreater(vector<int>& nums) {
        int n = nums.size();
        vector<int> res(n, -1);
        stack<int> st;
        for (int i = 0; i < n; i++) {
            while (!st.empty() && nums[st.top()] < nums[i]) {
                res[st.top()] = nums[i];
                st.pop();
            }
            st.push(i);
        }
        return res;
    }
};`,
    input: '2 1 2 4 3',
  },
    {
    name: 'Trie: insert + search (array children)',
    code: `#include <iostream>
#include <string>
using namespace std;
struct TrieNode {
TrieNode* children[26] = {};
bool isEnd = false;
};
void insertWord(TrieNode* root, string word) {
TrieNode* cur = root;
for (int i = 0; i < word.size(); i++) {
int idx = word[i] - 'a';
if (cur->children[idx] == NULL) {
cur->children[idx] = new TrieNode();
}
cur = cur->children[idx];
}
cur->isEnd = true;
}
bool searchWord(TrieNode* root, string word) {
TrieNode* cur = root;
for (int i = 0; i < word.size(); i++) {
int idx = word[i] - 'a';
if (cur->children[idx] == NULL) {
return false;
}
cur = cur->children[idx];
}
return cur->isEnd;
}
int main() {
TrieNode* root = new TrieNode();
insertWord(root, "app");
insertWord(root, "apple");
insertWord(root, "ape");
bool a = searchWord(root, "app");
bool b = searchWord(root, "ap");
return 0;
}`,
    input: '',
  },
  {
    name: 'Trie: class Trie (LeetCode style, with main)',
    code: `#include <iostream>
#include <string>
using namespace std;
struct Node {
Node* next[26] = {};
bool end = false;
};
class Trie {
public:
Node* root;
Trie() {
root = new Node();
}
void insert(string word) {
Node* cur = root;
for (int i = 0; i < word.size(); i++) {
int c = word[i] - 'a';
if (cur->next[c] == NULL) {
cur->next[c] = new Node();
}
cur = cur->next[c];
}
cur->end = true;
}
bool startsWith(string prefix) {
Node* cur = root;
for (int i = 0; i < prefix.size(); i++) {
int c = prefix[i] - 'a';
if (cur->next[c] == NULL) {
return false;
}
cur = cur->next[c];
}
return true;
}
};
int main() {
Trie t;
t.insert("car");
t.insert("cat");
t.insert("dog");
bool ok = t.startsWith("ca");
return 0;
}`,
    input: '',
  },
];

// ---------- small helpers ----------

// Colours of the logo, reused for the nodes (a node keeps its colour for the whole run)
const NODE_COLORS = ['#FFF1D0', '#FFD25E', '#BEE6F2', '#FFB59A'];
// One colour per pointer name (head, cur, prev...) so you can follow it
const PTR_COLORS = ['#14214F', '#C8602A', '#3F7D3A', '#7A4EA3'];
// Colours of the step bar ticks (one colour per "pass" through a loop)
const SEG_COLORS = ['#5DBFC0', '#FFD25E', '#FF8A5B', '#9ED36A'];

// 0x5e39f0 -> 0x…39f0 (long addresses are noisy)
// Solution::reverseList(this=0x7ffe..., head=0x5e39f0) -> Solution::reverseList(head=0x…39f0)
const niceFrame = (f) => f.replace(/this=0x[0-9a-f]+,?\s*/, '').replace(/0x[0-9a-f]{6,}/g, (a) => '0x…' + a.slice(-4));

const short = (v) => v.replace(/^(?:umap|uset|omap|oset|stk|que|pq|dq)(?:\/\d+)?(?=\{)/, '').replace(/(0x[0-9a-f]{6,})( <[^>]*>)?/g, (m, a) => '0x…' + a.slice(-4));
// ---------- tiny syntax highlighter (no library needed) ----------
const KEYWORDS = /^(int|long|short|char|bool|void|float|double|auto|const|static|struct|class|public|private|return|if|else|for|while|do|break|continue|new|delete|using|namespace|include|true|false|nullptr|switch|case)$/;
const TYPES = /^(ListNode|TreeNode|Solution|vector|string|cout|cin|endl|std|size_t)$/;

function highlight(line) {
  const parts = line.split(/(\/\/.*$|"[^"]*"|\b\w+\b)/);
  return parts.map((p, i) => {
    if (!p) return null;
    if (p.startsWith('//')) return <span key={i} className="tk-c">{p}</span>;
    if (p[0] === '"') return <span key={i} className="tk-s">{p}</span>;
    if (/^\d+$/.test(p) || p === 'NULL') return <span key={i} className="tk-n">{p}</span>;
    if (KEYWORDS.test(p)) return <span key={i} className="tk-k">{p}</span>;
    if (TYPES.test(p)) return <span key={i} className="tk-t">{p}</span>;
    return p;
  });
}

// ---------- pixel fish (drawn from a tiny grid, like in the logo) ----------
const FISH = ['...XXXX....', '.XXXXXXX..X', 'XXXXEXXXXXX', '.XXXXXXX..X', '...XXXX....'];

function PixelFish({ color, size = 4, flip }) {
  const body = [];
  FISH.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch !== '.') body.push({ x, y, eye: ch === 'E' });
    })
  );
  const isBody = (x, y) => body.some((p) => p.x === x && p.y === y);
  const outline = [];
  body.forEach((p) =>
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
      const x = p.x + dx;
      const y = p.y + dy;
      if (!isBody(x, y) && !outline.some((o) => o.x === x && o.y === y)) outline.push({ x, y });
    })
  );
  const w = (FISH[0].length + 2) * size;
  const h = (FISH.length + 2) * size;
  const rect = (p, fill, k) => (
    <rect key={k} x={(p.x + 1) * size} y={(p.y + 1) * size} width={size} height={size} fill={fill} />
  );
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {outline.map((p, i) => rect(p, '#14214F', 'o' + i))}
      {body.map((p, i) => rect(p, p.eye ? '#14214F' : color, 'b' + i))}
    </svg>
  );
}

function Pond() {
  return (
    <div className="pond" aria-hidden="true">
      <div className="fa f1"><PixelFish color="#C4452F" size={5} flip /></div>
      <span className="bubble b1" /><span className="bubble b2" />
      <div className="fa f2"><PixelFish color="#FFF1D0" size={4} /></div>
      <span className="bubble b3" />
      <div className="fa f3"><PixelFish color="#D4B45F" size={3} flip /></div>
    </div>
  );
}

// ---------- turn the raw steps into a "heap" we can draw ----------
// chains look like { head: [{v: 1, a: '0x..'}, {v: 2, a: '0x..'}], cur: [...] }
function buildModel(steps) {
  const order = []; // every node address, in order of first appearance (= layout order)
  const seen = new Set();
  const valueOf = {};
  const names = [];
  steps.forEach((s) =>
    Object.entries(s.chains || {}).forEach(([name, list]) => {
      if (!names.includes(name)) names.push(name);
      list.forEach((n) => {
        if (typeof n !== 'object') return; // old server format, ignore
        valueOf[n.a] = n.v;
        if (!seen.has(n.a)) {
          seen.add(n.a);
          order.push(n.a);
        }
      });
    })
  );
  const rank = {};
  order.forEach((a, i) => { rank[a] = i; });

  const per = steps.map((s) => {
    const next = {}; // node address -> address of the node it points to (or null)
    const ptrs = {}; // pointer name -> address of the node it points at
    Object.entries(s.chains || {}).forEach(([name, list]) => {
      if (!list.length || typeof list[0] !== 'object') return;
      ptrs[name] = list[0].a;
      list.forEach((n, i) => {
        if (i < list.length - 1) next[n.a] = list[i + 1].a;
        else if (!(n.a in next)) next[n.a] = null;
      });
    });
    return { next, ptrs };
  });
  return { order, rank, valueOf, names: names.sort(), per };
}

// short human sentence(s) about what changed between step i-1 and step i
function effectsFor(steps, model, i) {
  if (i === 0) return 'start';
  const s = steps[i];
  const p = steps[i - 1];
  const m = model.per[i];
  const pm = model.per[i - 1];
  const out = [];
  const nodeName = (a) => (a == null ? 'NULL' : 'node ' + model.valueOf[a]);

  if (s.stack && p.stack) {
    if (s.stack.length > p.stack.length) return 'calls ' + niceFrame(s.stack[0]);
    if (s.stack.length < p.stack.length) return 'back in ' + niceFrame(s.stack[0]);
    if (s.stack[0] !== p.stack[0]) return 'enters ' + niceFrame(s.stack[0]);
  }
  Object.entries(s.variables).forEach(([name, val]) => {
    const old = p.variables[name];
    if (old === undefined) {
      out.push('new ' + name + ' = ' + short(val));
    } else if (old !== val) {
    if (isLin(val) && isLin(old)) {
        const a = stkItems(val);
        const b = stkItems(old);
        const cnt = (arr, x) => arr.filter((y) => y === x).length;
        if (a.length > b.length) out.push(name + '.push(' + (a.find((x) => cnt(a, x) > cnt(b, x)) || a[a.length - 1]) + ')');
        else if (a.length < b.length) out.push(name + '.pop() → ' + (a.join() === b.slice(1).join() || val.startsWith('pq') ? b[0] : b[b.length - 1]));
        else out.push(name + ' changed');
      } else if (isStk(val) && isStk(old)) {
        const a = stkItems(val);
        const b = stkItems(old);
        if (a.length > b.length) out.push(name + '.push(' + a[a.length - 1] + ')');
        else if (a.length < b.length) out.push(name + '.pop() → ' + b[b.length - 1]);
        else out.push(name + ' changed');
      } else if (isGrid(val) && isGrid(old)) {
        const a = parse2D(val);
        const b = parse2D(old);
        a.forEach((row, r) => row.forEach((c, k) => { if (b[r] && b[r][k] !== c) out.push(name + '[' + r + '][' + k + '] = ' + c); }));
      } else if (val.startsWith('[')) {
        const a = val.slice(1, -1).split(' ');
        const b = old.slice(1, -1).split(' ');
        a.forEach((c, idx) => { if (b[idx] !== c) out.push(name + '[' + idx + '] = ' + c); });
      } else if (m.ptrs[name] && pm.ptrs[name]) {
        out.push(name + ' hops: ' + nodeName(pm.ptrs[name]) + ' → ' + nodeName(m.ptrs[name]));
      } else {
        out.push(name + ': ' + short(old) + ' → ' + short(val));
      }
    }
  });
  Object.keys(m.next).forEach((a) => {
    if (a in pm.next && pm.next[a] !== m.next[a]) {
      out.push(nodeName(a) + ' now points to ' + nodeName(m.next[a]));
    }
  });
  if (!out.length) return 'no change';
  return out.slice(0, 3).join(' · ') + (out.length > 3 ? ' …' : '');
}


// ---------- arrays: read the index variables out of the source ----------
const cellsOf = (v) => v.slice(1, -1).split(' ').filter((c) => c !== '');
const isGrid = (v) => v.startsWith('{{');
const isRes = (v) => v.startsWith('res{');
function ResultViz({ name, value, before }) {
  const rowsOf = (v) => (v && v.startsWith('res{') ? (v.match(/\[[^\]]*\]/g) || []) : null);
  const rows = rowsOf(value) || [];
  const prevRows = rowsOf(before);
  const old = prevRows ? prevRows.length : (before === '[]' ? 0 : rows.length);
  return (
    <div className="viz">
      <div className="big-name">{name}</div>
      <div className="h-cap">{'answers found so far · ' + rows.length}</div>
      <div className="res-list">
        {rows.map((r, i) => {
          const items = r.slice(1, -1).trim();
          return (
            <div key={i} className={'res-row' + (i >= old ? ' changed' : '')}>
              <span className="res-i">{i}</span>
              {items ? items.split(/\s+/).map((x, j) => <span key={j} className="res-c">{x}</span>) : <span className="res-e">empty</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
const parse2D = (v) => v.slice(2, -2).split(/\},\s*\{/).map((r) => r.split(/,\s*/));

// evaluate a tiny index expression like "j + 1" with the current variables
function evalIdx(expr, vars) {
  if (!/^[\w\s+\-*/%()]+$/.test(expr)) return null;
  const e = expr.replace(/[A-Za-z_]\w*/g, (id) => {
    const v = vars[id];
    return v !== undefined && /^-?\d+$/.test(String(v).trim()) ? '(' + v + ')' : 'NaN';
  });
  try {
    const n = Function('return (' + e + ')')();
    return Number.isInteger(n) ? n : null;
  } catch (x) {
    return null;
  }
}

// every "name[..][..]" in a piece of code -> list of bracket expressions
function accessesIn(text, name) {
  const re = new RegExp('\\b' + name + '((?:\\s*\\[[^\\]]*\\])+)', 'g');
  const out = [];
  let m;
  while ((m = re.exec(text))) {
    out.push({ label: m[0].replace(/\s+/g, ' '), exprs: m[1].match(/\[([^\]]*)\]/g).map((x) => x.slice(1, -1).trim()) });
  }
  return out;
}

// variables that are used as an index of this array anywhere in the code (i, j, lo, mid...)
function indexNames(code, name, dim) {
  const set = new Set();
  accessesIn(code, name).forEach((a) => {
    if (a.exprs[dim]) (a.exprs[dim].match(/[A-Za-z_]\w*/g) || []).forEach((id) => set.add(id));
  });
  // follow the assignments: mid = (lo + hi) / 2  ->  lo and hi count as index variables too
  for (let round = 0; round < 3; round++) {
    [...set].forEach((v) => {
      const re = new RegExp('\\b' + v + '\\s*(?:=(?!=)|\\+=|-=)\\s*([^;{]*);', 'g');
      let m;
      while ((m = re.exec(code))) {
        (m[1].match(/[A-Za-z_]\w*/g) || []).forEach((id) => {
          if (id !== name && !/^(int|long|char|new|NULL|true|false|sizeof)$/.test(id)) set.add(id);
        });
      }
    });
  }
  return [...set];
}

// places a chip for each index variable; chips on the same cell sit side by side
function chipsFor(names, vars, len, exclude) {
  const list = names
    .filter((id) => id !== exclude && vars[id] !== undefined && /^-?\d+$/.test(String(vars[id]).trim()))
    .map((id) => ({ id, idx: parseInt(vars[id], 10) }))
    .filter((c) => c.idx >= 0 && c.idx < len);
  const count = {};
  const seen = {};
  list.forEach((c) => { count[c.idx] = (count[c.idx] || 0) + 1; });
  return list.map((c) => {
    const k = seen[c.idx] || 0;
    seen[c.idx] = k + 1;
    return { ...c, off: (k - (count[c.idx] - 1) / 2) * 40 };
  });
}

const cellFont = (c) => (c.length <= 3 ? 22 : c.length <= 5 ? 15 : 11);

function ArrayViz({ name, value, before, code, line, vars, current }) {
  const cells = cellsOf(value);
    if (!cells.length) return null;
  const old = before ? cellsOf(before) : [];
  const PITCH = 74;
  const names = indexNames(code, name, 0);
  const chips = chipsFor(names, vars, cells.length, name);
  const reads = [];
  accessesIn(line, name).forEach((a) => {
    const idx = evalIdx(a.exprs[0], vars);
    if (idx !== null && idx >= 0 && idx < cells.length) reads.push({ label: a.label, idx });
  });
  const readIdx = new Set(reads.map((r) => r.idx));
  return (
    <div className="viz">
      <div className="big-name">{name}</div>
      <div className="a-area" style={{ width: cells.length * PITCH - 10, paddingTop: 46 }}>
        {chips.map((c) => (
          <div key={c.id} className="achip" style={{ left: c.idx * PITCH + 32 + c.off, background: PTR_COLORS[names.indexOf(c.id) % PTR_COLORS.length] }}>{c.id}</div>
        ))}
        <div className="big-cells">
          {cells.map((c, idx) => {
            const diff = old.length && old[idx] !== c;
            return (
              <div key={idx + (diff ? '-' + current : '')} className="big-wrap">
                <div className={'big-cell' + (diff ? ' changed' : '') + (readIdx.has(idx) ? ' read' : '')}
                  style={Object.assign({ fontSize: cellFont(c) }, diff ? {} : { background: NODE_COLORS[idx % 4] })}>{c}</div>
                <div className="big-idx">{idx}</div>
              </div>
            );
          })}
        </div>
      </div>
      {reads.length > 0 && (
        <div className="reads">
          next line reads: {reads.map((r, i) => (
            <span key={i}><b>{r.label}</b>{' → ' + name + '[' + r.idx + '] = ' + cells[r.idx]}{i < reads.length - 1 ? '  ·  ' : ''}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function GridViz({ name, value, before, code, line, vars, current }) {
  const rows = parse2D(value);
  const old = before && isGrid(before) ? parse2D(before) : null;
  const R = rows.length;
  const C = rows[0].length;
  const CELL = 56, P = 64, LEFT = 70, TOP = 46;
  const rnames = indexNames(code, name, 0);
  const cnames = indexNames(code, name, 1);
  const rchips = chipsFor(rnames, vars, R, name);
  const cchips = chipsFor(cnames, vars, C, name);
  const reads = [];
  accessesIn(line, name).forEach((a) => {
    if (a.exprs.length < 2) return;
    const r = evalIdx(a.exprs[0], vars);
    const c = evalIdx(a.exprs[1], vars);
    if (r !== null && c !== null && r >= 0 && r < R && c >= 0 && c < C) reads.push({ label: a.label, r, c });
  });
  const readKey = new Set(reads.map((x) => x.r + ',' + x.c));
  return (
    <div className="viz">
      <div className="big-name">{name}</div>
      <div className="g-area" style={{ width: LEFT + C * P + 30, height: TOP + R * P + 22 }}>
        {cchips.map((c) => (
          <div key={'c' + c.id} className="achip" style={{ left: LEFT + c.idx * P + CELL / 2 + c.off, background: PTR_COLORS[cnames.indexOf(c.id) % PTR_COLORS.length] }}>{c.id}</div>
        ))}
        {rchips.map((c) => (
          <div key={'r' + c.id} className="achip rchip" style={{ left: 2, top: TOP + c.idx * P + CELL / 2 - 12 + c.off * 0.5, background: PTR_COLORS[rnames.indexOf(c.id) % PTR_COLORS.length] }}>{c.id}</div>
        ))}
        <div className="g-cells" style={{ left: LEFT, top: TOP, gridTemplateColumns: 'repeat(' + C + ', ' + CELL + 'px)' }}>
          {rows.map((row, r) => row.map((c, k) => {
            const diff = old && old[r] && old[r][k] !== c;
            return (
              <div key={r + '-' + k + (diff ? '-' + current : '')}
                className={'g-cell' + (diff ? ' changed' : '') + (readKey.has(r + ',' + k) ? ' read' : '')}
                style={Object.assign({ fontSize: cellFont(c) }, diff ? {} : { background: NODE_COLORS[(r + k) % 4] })}>{c}</div>
            );
          }))}
        </div>
        {Array.from({ length: C }).map((_, k) => (
          <div key={'ci' + k} className="g-idx" style={{ left: LEFT + k * P, top: TOP + R * P - 4, width: CELL }}>{k}</div>
        ))}
        {Array.from({ length: R }).map((_, r) => (
          <div key={'ri' + r} className="g-idx" style={{ left: LEFT + C * P - 6, top: TOP + r * P + CELL / 2 - 8, width: 20 }}>{r}</div>
        ))}
      </div>
      {reads.length > 0 && (
        <div className="reads">
          next line reads: {reads.map((x, i) => (
            <span key={i}><b>{x.label}</b>{' → ' + name + '[' + x.r + '][' + x.c + '] = ' + rows[x.r][x.c]}{i < reads.length - 1 ? '  ·  ' : ''}</span>
          ))}
        </div>
      )}
    </div>
  );
}
// ---------- bit manipulation: show numbers as bits ----------
function usesBits(code) {
  const t = code
    .split('\n')
    .filter((l) => !/\b(cout|cin)\b|#include/.test(l))
    .join('\n')
    .replace(/\b(?:vector|pair|map|set|unordered_map|unordered_set)\s*<[^;(){}]*>/g, 'T')
        .replace(/(?:\b(?:int|long|char|bool|double|string|T)|>)\s*&\s*(?=\w+\s*[,)])/g, ' ');
  return /(<<|>>|\^|~|[^&]&(?!&)|[^|]\|(?!\|))/.test(t);
}

const toBits = (n, width) => {
  const mask = width === 32 ? 0xFFFFFFFF : (1 << width) - 1;
  return (((n & mask) >>> 0).toString(2)).padStart(width, '0');
};

// evaluate things like "nums[j]" or "(1 << i)" with the current variables
function evalBits(expr, vars) {
  if (!/^[\w\s+\-*/%()<>&|^~[\]]+$/.test(expr)) return null;
  const isNum = (v) => /^-?\d+$/.test(String(v).trim());
  let e = expr.replace(/([A-Za-z_]\w*)\s*\[([^\]]*)\]/g, (m, nm, ix) => {
    const arr = vars[nm];
    const i = evalBits(ix, vars);
    if (!arr || arr[0] !== '[' || i === null) return 'NaN';
    const c = arr.slice(1, -1).split(' ')[i];
    return c !== undefined && isNum(c) ? '(' + c + ')' : 'NaN';
  });
  e = e.replace(/[A-Za-z_]\w*/g, (id) =>
    id !== 'NaN' && vars[id] !== undefined && isNum(vars[id]) ? '(' + vars[id] + ')' : 'NaN');
  if (e.includes('NaN')) return null;
  try {
    const n = Function('return (' + e + ')')();
    return Number.isInteger(n) ? n | 0 : null;
  } catch (x) {
    return null;
  }
}

// the pieces of a bit expression on this line: [left, right, whole]
function bitTerms(line, vars) {
  const out = [];
  const seen = new Set();
  const add = (expr) => {
    const t = expr.trim();
    if (!t || /^\d+$/.test(t) || seen.has(t)) return;
    const v = evalBits(t, vars);
    if (v === null) return;
    seen.add(t);
    out.push([t, v]);
  };
  const re = /(\w+(?:\[[^\]]*\])?|\([^()]*\))\s*(<<|>>|&(?!&)|\^|\|(?!\|))\s*(\w+(?:\[[^\]]*\])?|\([^()]*\))/g;
  let m;
  while ((m = re.exec(line))) {
    add(m[1]);
    add(m[3]);
    add(m[0]);
  }
  return out.slice(0, 4);
}

function BitsViz({ vars, before, line, current }) {
  const isNum = (v) => /^-?\d+$/.test(String(v).trim());
  const terms = bitTerms(line, vars);
  const termNames = new Set(terms.map((t) => t[0]));
  const named = Object.entries(vars).filter(([, v]) => isNum(v));
  const inLine = named.filter(([n]) => new RegExp('\\b' + n + '\\b').test(line));
  const rest = named.filter(([n]) => !inLine.some(([m]) => m === n));
  const varRows = inLine.concat(rest)
    .filter(([n]) => !termNames.has(n))
    .slice(0, Math.max(2, 6 - terms.length));
  const rows = terms
    .map(([t, v]) => ({ name: t, v, expr: true, was: null }))
    .concat(varRows.map(([n, v]) => ({
      name: n,
      v: parseInt(v, 10),
      expr: false,
      was: before[n] !== undefined && isNum(before[n]) ? parseInt(before[n], 10) : null,
    })));
  if (!rows.length) return null;

  const nums = rows.map((r) => r.v);
  const neg = nums.some((n) => n < 0);
  const big = Math.max(...nums.map((n) => Math.abs(n)));
  const width = neg ? (big < 128 ? 8 : big < 32768 ? 16 : 32) : big < 256 ? 8 : big < 65536 ? 16 : 32;
  const posLabels = Array.from({ length: width }, (_, i) => width - 1 - i);
  return (
        <div className={'bits w' + width}>
      <div className="big-name">numbers as bits</div>
      <div className="bit-row bit-head">
        <span className="bit-name" />
        <div className="bit-cells">
          {posLabels.map((p) => <span key={p} className={'bit-pos' + (p % 4 === 3 && p !== width - 1 ? ' gap' : '')}>{p}</span>)}
        </div>
      </div>
      {rows.map((r) => {
        const str = toBits(r.v, width);
        const was = r.was !== null ? toBits(r.was, width) : null;
        return (
          <div key={r.name} className={'bit-row' + (r.expr ? ' expr' : '')}>
            <span className="bit-name" title={r.name + ' = ' + r.v}><b>{r.name}</b> = {r.v}</span>
            <div className="bit-cells">
              {[...str].map((b, i) => {
                const diff = was !== null && was[i] !== b;
                return (
                  <span key={i + (diff ? '-' + current : '')}
                    className={'bit' + (b === '1' ? ' one' : '') + (diff ? ' flip' : '') + ((width - 1 - i) % 4 === 3 && i !== 0 ? ' gap' : '')}>{b}</span>
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="reads">next line: <b>{line.trim()}</b></div>
    </div>
  );
}
// ---------- math: modular arithmetic, gcd, primes ----------
function usesMath(code) {
  return /%|gcd|prime|sieve|MOD/i.test(code.split('\n').filter((l) => !/#include/.test(l)).join('\n'));
}

// tiny exact calculator (BigInt, so a * b with big numbers does not lose digits)
function evalMath(expr, env) {
  const src = expr
    .replace(/\((?:unsigned\s+)?(?:long\s+long|long|int|ll)\)/g, '')
    .replace(/(\d)(?:ULL|ull|LL|ll|UL|ul|L|l|U|u)\b/g, '$1')
    .replace(/\b(\d+(?:\.\d+)?)e(\d+)\b/g, (m, a, b) => {
      const n = Number(a + 'e' + b);
      return Number.isInteger(n) ? String(BigInt(n)) : 'x';
    });
  const tok = src.match(/\d+|[A-Za-z_]\w*|[()+\-*/%[\]]|\S/g) || [];
  const zero = BigInt(0);
  const isInt = (s) => /^-?\d+$/.test(String(s).trim());
  const ops = [];
  let p = 0;
  let bad = false;

  function atom() {
    const t = tok[p++];
    if (t === undefined) { bad = true; return zero; }
    if (t === '(') { const v = sum(); if (tok[p++] !== ')') bad = true; return v; }
    if (t === '-') return -atom();
    if (t === '+') return atom();
    if (/^\d+$/.test(t)) return BigInt(t);
    if (/^[A-Za-z_]/.test(t)) {
      const idx = [];
      while (tok[p] === '[') {
        p++;
        idx.push(sum());
        if (tok[p++] !== ']') bad = true;
      }
      const raw = env[t];
      let cell;
      if (!idx.length) cell = raw;
      else if (typeof raw === 'string' && idx.length === 1 && raw[0] === '[') cell = raw.slice(1, -1).split(' ')[Number(idx[0])];
      else if (typeof raw === 'string' && idx.length === 2 && raw.indexOf('{{') === 0) {
        const row = parse2D(raw)[Number(idx[0])];
        cell = row ? row[Number(idx[1])] : undefined;
      }
      if (cell === undefined || !isInt(cell)) { bad = true; return zero; }
      return BigInt(String(cell).trim());
    }
    bad = true;
    return zero;
  }
  function term() {
    let v = atom();
    while (tok[p] === '*' || tok[p] === '/' || tok[p] === '%') {
      const o = tok[p++];
      const w = atom();
      if (o === '*') v *= w;
      else if (w === zero) bad = true;
      else {
        ops.push({ op: o, a: v, b: w });
        v = o === '/' ? v / w : v % w;
      }
    }
    return v;
  }
  function sum() {
    let v = term();
    while (tok[p] === '+' || tok[p] === '-') {
      const o = tok[p++];
      const w = term();
      v = o === '+' ? v + w : v - w;
    }
    return v;
  }
  const value = sum();
  if (bad || p < tok.length) return null;
  return { value, ops };
}

// const int MOD = 1e9 + 7;   or   #define MOD 1000000007
function mathConsts(code) {
  const out = {};
  const re = /(?:const|constexpr)\s+(?:unsigned\s+)?(?:long\s+long|long|int|ll|ull)\s+(\w+)\s*=\s*([^;]+);|#define\s+(\w+)\s+([^\n]+)/g;
  let m;
  while ((m = re.exec(code))) {
    const r = evalMath(m[2] || m[4], out);
    if (r) out[m[1] || m[3]] = String(r.value);
  }
  return out;
}

// every % and / on this line, worked out with the current variable values
function mathOpsFor(line, vars, consts) {
  const text = line.replace(/\/\/.*$/, '');
  const env = Object.assign({}, consts, vars);
  const OK = /[\w\s+\-*/%()[\].]/;
  const KW = /^(?:(?:return|else|case|const|unsigned|int|long|auto|double|float|bool|ll)\s+)+/;
  const INT_MAX = BigInt(2147483647);
  const out = [];
  const seen = new Set();

  const grow = (from, dir) => {
    let depth = 0;
    let i = from;
    while (i >= 0 && i < text.length) {
      const ch = text[i];
      if (!OK.test(ch)) break;
      if (dir < 0) {
        if (ch === ')' || ch === ']') depth++;
        else if (ch === '(' || ch === '[') { if (depth === 0) break; depth--; }
      } else {
        if (ch === '(' || ch === '[') depth++;
        else if (ch === ')' || ch === ']') { if (depth === 0) break; depth--; }
      }
      i += dir;
    }
    return dir < 0 ? text.slice(i + 1, from + 1) : text.slice(from, i);
  };

  for (let k = 0; k < text.length && out.length < 3; k++) {
    const c = text[k];
    if (c !== '%' && c !== '/') continue;
    let expr;
    if (text[k + 1] === '=') {
      const lhs = (text.slice(0, k).match(/(\w+(?:\s*\[[^\]]*\])*)\s*$/) || [])[1];
      const rhs = grow(k + 2, 1).trim();
      if (!lhs || !rhs) continue;
      expr = lhs + ' ' + c + ' (' + rhs + ')';
    } else {
      const left = grow(k - 1, -1).trim().replace(KW, '');
      const right = grow(k + 1, 1).trim();
      if (!left || !right) continue;
      expr = left + ' ' + c + ' ' + right;
    }
    const res = evalMath(expr, env);
    if (!res) continue;
    res.ops.forEach((o) => {
      const key = o.op + '|' + o.a + '|' + o.b;
      if (seen.has(key) || out.length >= 3) return;
      seen.add(key);
      out.push({ expr, op: o.op, a: o.a, b: o.b, over: (o.a > INT_MAX || o.a < -INT_MAX) && /[*+]/.test(expr) });
    });
  }
  return out;
}

// if this line has nothing to calculate, keep showing the last calculation from a few steps back
function lastMathOps(steps, current, code) {
  const consts = mathConsts(code);
  const lines = code.split('\n');
  for (let k = current; k >= 0 && k > current - 12; k--) {
    const ops = mathOpsFor(lines[steps[k].line - 1] || '', steps[k].variables, consts);
    if (ops.length) return { ops, stale: k !== current };
  }
  return { ops: [], stale: false };
}

function MathViz({ ops, stale }) {
  const zero = BigInt(0);
  return (
    <div className="mathv">
      <div className="big-name">{stale ? 'last calculation' : 'divide and remainder'}</div>
      {ops.map((o, i) => {
        const q = o.a / o.b;
        const r = o.a % o.b;
        const b = Number(o.b);
        const track = b >= 2 && b <= 24 && r >= zero;
        return (
          <div key={i} className="m-op">
            <div className="m-expr">{o.expr}</div>
            <div className="m-eq">
              {String(o.a)} = <span className={o.op === '/' ? 'hot' : ''}>{String(q)}</span> × {String(o.b)} + <span className={o.op === '%' ? 'hot' : ''}>{String(r)}</span>
            </div>
            {track && (
              <div>
                <div className="m-track">
                  {Array.from({ length: b }).map((_, k) => (
                    <span key={k} className={'m-cell' + (k === Number(r) ? ' hit' : '')}>{k}</span>
                  ))}
                </div>
                <div className="m-laps">goes around {String(q)} time(s), then lands on {String(r)}</div>
              </div>
            )}
            {r === zero && <div className="m-note ok">✓ divides evenly (remainder 0)</div>}
            {(o.a < zero || r < zero) && <div className="m-note">C++ keeps the sign of the left number, so this remainder can be negative. For 0..m-1 use ((a % m) + m) % m.</div>}
            {o.over && <div className="m-note warn">⚠ this is bigger than an int holds (2147483647). It only works if the variables are long long.</div>}
          </div>
        );
      })}
    </div>
  );
}

// a flag array (bool / 0-1) drawn as a number grid: gold = prime, crossed = not prime
const isFlags = (v, code) => {
  if (!v.startsWith('[')) return false;
  const c = cellsOf(v);
  return c.length >= 10 && c.every((x) => x === '0' || x === '1') && /\bbool\b|prime|sieve/i.test(code);
};

function SieveViz({ name, value, before, code, line, vars, current }) {
  const cells = cellsOf(value);
  const old = before && before[0] === '[' ? cellsOf(before) : [];
  const inverted = /comp|not|mark|vis/i.test(name);
  const isP = (c) => (inverted ? c === '0' : c === '1');
  const reads = new Set();
  accessesIn(line, name).forEach((a) => {
    const i = evalIdx(a.exprs[0], vars);
    if (i !== null && i >= 0 && i < cells.length) reads.add(i);
  });
  const primes = cells.map((c, i) => (isP(c) && i >= 2 ? i : -1)).filter((i) => i >= 0);
  return (
    <div className="viz">
      <div className="big-name">{name}</div>
      <div className="sieve">
        {cells.map((c, i) => {
          const diff = old.length && old[i] !== c;
          return (
            <div key={i + (diff ? '-' + current : '')}
              className={'sv' + (isP(c) ? ' on' : ' off') + (diff ? ' changed' : '') + (reads.has(i) ? ' read' : '')}>{i}</div>
          );
        })}
      </div>
      {/prime|sieve/i.test(code) && <div className="reads">still marked prime: {primes.length ? primes.join(' ') : 'none'}</div>}
    </div>
  );
}
// ---------- hashing: unordered_map / map / unordered_set / set ----------
const HASH_RE = /^(umap|uset|omap|oset)(?:\/(\d+))?\{([\s\S]*)\}$/;
const STK_RE = /^stk\{([\s\S]*)\}$/;
const isStk = (v) => STK_RE.test(v);
const LIN_RE = /^(?:que|pq|dq)\{([\s\S]*)\}$/;
const isLin = (v) => LIN_RE.test(v);
const isHash = (v) => HASH_RE.test(v) || STK_RE.test(v) || LIN_RE.test(v);
const stkItems = (v) => {
  const m = v.match(STK_RE) || v.match(LIN_RE);
  const body = m ? m[1].trim() : '';
  return body ? (body.match(/'(?:[^'\\]|\\.)*'|[^,\s][^,]*/g) || []).map((x) => x.trim()) : [];
};
// split on a separator that is not inside "quotes"
function splitQ(s, sep) {
  const out = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '"') q = !q;
    if (!q && s.startsWith(sep, i)) { out.push(cur); cur = ''; i += sep.length - 1; } else cur += s[i];
  }
  out.push(cur);
  return out;
}

function parseHash(v) {
  const m = v.match(HASH_RE);
  if (!m) return null;
  const body = m[3].trim();
  const isMap = m[1].endsWith('map');
  const items = body ? splitQ(body, ', ').map((e) => {
    if (!isMap) return { k: e, v: null };
    const p = splitQ(e, ': ');
    return { k: p[0], v: p.slice(1).join(': ') };
  }) : [];
  return { kind: m[1], isMap, ordered: m[1][0] === 'o', buckets: m[2] ? Number(m[2]) : 0, items };
}

function HashViz({ name, value, before, current }) {
  const h = parseHash(value);
  if (!h) return null;
  const old = before && isHash(before) ? parseHash(before) : null;
  const oldMap = {};
  if (old) old.items.forEach((it) => { oldMap[it.k] = it.v; });
  const hot = (it) => !!old && (!(it.k in oldMap) || oldMap[it.k] !== it.v);
  const gone = old ? old.items.filter((it) => !h.items.some((x) => x.k === it.k)) : [];
  const numeric = h.items.every((it) => /^-?\d+$/.test(it.k));
  const bucketOf = (k) => Number(BigInt.asUintN(64, BigInt(k)) % BigInt(h.buckets));
  const drawBuckets = !h.ordered && h.buckets > 0 && h.buckets <= 26 && numeric;
  const cell = (it) => (
    <div key={it.k + (hot(it) ? '-' + current : '')} className={'h-item' + (hot(it) ? ' changed' : '')}>
      <span className="h-k">{it.k}</span>
      {h.isMap && <span className="h-v">{it.v}</span>}
    </div>
  );
  const label = { umap: 'unordered_map', uset: 'unordered_set', omap: 'map, sorted by key', oset: 'set, sorted' }[h.kind];
  return (
    <div className="viz">
      <div className="big-name">{name}</div>
      <div className="h-cap">
        {label + (drawBuckets ? ' · ' + h.buckets + ' buckets, bucket = key % ' + h.buckets : '') + ' · ' + h.items.length + (h.items.length === 1 ? ' item' : ' items')}
      </div>
      {drawBuckets ? (
        <div className="h-buckets" style={{ gridTemplateColumns: 'repeat(' + Math.min(h.buckets, 13) + ', 64px)' }}>
          {Array.from({ length: h.buckets }).map((_, b) => (
            <div key={b} className="h-col">
              <div className="h-bi">{b}</div>
              {h.items.filter((it) => bucketOf(it.k) === b).map(cell)}
            </div>
          ))}
        </div>
      ) : (
        <div className="h-row">{h.items.length ? h.items.map(cell) : <div className="h-empty">empty</div>}</div>
      )}
      {gone.length > 0 && <div className="reads">removed: <b>{gone.map((x) => x.k).join(', ')}</b></div>}
    </div>
  );
}
// ---------- stack: std::stack<T> ----------
function StackViz({ name, value, before, line, current }) {
  const items = stkItems(value);
  const old = before && isStk(before) ? stkItems(before) : null;
  const top = items.length - 1;
  const pushed = old && items.length > old.length ? top : -1;
  const popped = old && items.length < old.length ? old[old.length - 1] : null;
  const peek = new RegExp('\\b' + name + '\\s*\\.\\s*top\\s*\\(').test(line) && items.length > 0;
  return (
    <div className="viz">
      <div className="big-name">{name}</div>
      <div className="h-cap">
        {'stack · ' + items.length + (items.length === 1 ? ' item' : ' items') + (items.length ? ' · top = ' + items[top] : '')}
      </div>
      <div className="stk">
        {popped !== null && (
          <div key={'pop-' + current} className="stk-cell popped">{popped}<span className="stk-tag">popped</span></div>
        )}
        {items.length === 0 && <div className="stk-empty">empty</div>}
        {items.map((_, i) => i).reverse().map((i) => (
          <div key={i + (i === pushed ? '-' + current : '')}
            className={'stk-cell' + (i === top ? ' top' : '') + (i === pushed ? ' changed' : '')}>
            {items[i]}
            {i === top && <span className="stk-tag">{i === pushed ? '◀ top (just pushed)' : '◀ top'}</span>}
          </div>
        ))}
      </div>
      {peek && <div className="reads">next line reads: <b>{name + '.top()'}</b>{' → ' + items[top]}</div>}
    </div>
  );
}
// ---------- binary trees ----------
function TreeViz({ steps, current, code, vars }) {
  const tree = steps[current].tree;
  const before = current > 0 ? steps[current - 1].tree : null;
  const nodes = tree.nodes;
  const pos = {};
  const seen = new Set();
  let nextX = 0;
  let maxD = 0;
  const place = (a, d) => {
    const n = nodes[a];
    if (!n || seen.has(a) || d > 9) return;
    seen.add(a);
    if (n.l !== '0x0') place(n.l, d + 1);
    pos[a] = { x: nextX++, d };
    if (d > maxD) maxD = d;
    if (n.r !== '0x0') place(n.r, d + 1);
  };
  tree.roots.forEach((r) => place(r, 0));
  const UX = 56;
  const UY = 80;
  const W = Math.max(nextX, 2) * UX + 30;
  const H = (maxD + 1) * UY + 56;
  const px = (a) => 30 + pos[a].x * UX - UX / 2 + 14;
  const py = (a) => 52 + pos[a].d * UY;
  const names = {};
  Object.entries(vars).forEach(([n, v]) => { if (nodes[v]) (names[v] = names[v] || []).push(n); });
  const trav = /inorder|preorder|postorder|traversal|traverse|dfs|bfs|visit|level/i.test(code);
  const visited = new Set();
  if (trav) {
    for (let k = 0; k <= current; k++) {
      Object.values(steps[k].variables).forEach((v) => { if (nodes[v]) visited.add(v); });
    }
  }
  const bn = before ? before.nodes : null;
  const nodeChanged = (a) => !!bn && (!bn[a] || bn[a].v !== nodes[a].v);
  const edgeNew = (a, side) => !!bn && (!bn[a] || bn[a][side] !== nodes[a][side]);
  const count = Object.keys(pos).length;
  return (
    <div className="viz">
      <div className="h-cap">{'binary tree · ' + count + (count === 1 ? ' node' : ' nodes') + ' · yellow = a pointer is here' + (trav ? ' · green = already visited' : '')}</div>
      <svg className="htree" width={W} height={H} viewBox={'0 0 ' + W + ' ' + H}>
        {Object.keys(pos).map((a) => ['l', 'r'].map((side) => {
          const c = nodes[a][side];
          if (!pos[c]) return null;
          return <line key={'e' + a + side + (edgeNew(a, side) ? '-' + current : '')} x1={px(a)} y1={py(a)} x2={px(c)} y2={py(c)}
            className={'ht-edge' + (edgeNew(a, side) ? ' fresh' : '')} />;
        }))}
        {Object.keys(pos).map((a) => {
          const here = !!names[a];
          const cls = 'ht-node' + (nodeChanged(a) ? ' changed' : here ? ' root' : visited.has(a) ? ' vis' : '');
          return (
            <g key={a + (nodeChanged(a) ? '-' + current : '')} className={cls}>
              <circle cx={px(a)} cy={py(a)} r="23" />
              <text className="ht-v" x={px(a)} y={py(a) + 6} textAnchor="middle">{nodes[a].v}</text>
              {here && (
                <g>
                  <rect className="ht-chip" x={px(a) - names[a].join(', ').length * 4.6 - 8} y={py(a) - 54} width={names[a].join(', ').length * 9.2 + 16} height="22" />
                  <text className="ht-chip-t" x={px(a)} y={py(a) - 38} textAnchor="middle">{names[a].join(', ')}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
// ---------- trie: a tree where every step down is one letter ----------
function TrieViz({ steps, current, vars }) {
  const trie = steps[current].trie;
  const before = current > 0 ? steps[current - 1].trie : null;
  const nodes = trie.nodes;
  const bn = before ? before.nodes : null;
  const pos = {};
  const letter = {};
  const seen = new Set();
  let nextX = 0;
  let maxD = 0;
  const place = (a, d) => {
    const n = nodes[a];
    if (!n || seen.has(a) || d > 14) return;
    seen.add(a);
    const kids = n.k.filter((kv) => nodes[kv[1]] && !seen.has(kv[1]));
    kids.forEach((kv) => { letter[kv[1]] = kv[0]; place(kv[1], d + 1); });
    const xs = kids.map((kv) => pos[kv[1]]).filter(Boolean).map((p) => p.x);
    pos[a] = { x: xs.length ? (Math.min(...xs) + Math.max(...xs)) / 2 : nextX++, d };
    if (d > maxD) maxD = d;
  };
  trie.roots.forEach((r) => place(r, 0));
  const UX = 62;
  const UY = 84;
  const W = Math.max(nextX, 2) * UX + 40;
  const H = (maxD + 1) * UY + 70;
  const px = (a) => 38 + pos[a].x * UX;
  const py = (a) => 62 + pos[a].d * UY;
  const names = {};
  const addName = (addr, n) => { names[addr] = [...new Set((names[addr] || []).concat(n))]; };
  Object.entries(vars).forEach(([n, v]) => { if (nodes[v]) addName(v, n); });
  Object.entries(trie.members || {}).forEach(([n, v]) => { if (nodes[v]) addName(v, n); });
  const words = [];
  const walk = (a, pre, d) => {
    const n = nodes[a];
    if (!n || d > 14 || words.length >= 24) return;
    if (n.e && pre) words.push(pre);
    n.k.forEach((kv) => walk(kv[1], pre + kv[0], d + 1));
  };
  trie.roots.forEach((r) => walk(r, '', 0));
  const ids = Object.keys(pos);
  const isNew = (a) => !!bn && !bn[a];
  const flip = (a) => !!bn && !!bn[a] && bn[a].e !== nodes[a].e;
  return (
    <div className="viz">
      <div className="h-cap">
        {'trie · ' + ids.length + (ids.length === 1 ? ' node' : ' nodes') + ' · double ring = a word ends here' + (words.length ? ' · words: ' + words.join(', ') : '')}
      </div>
      <svg className="htree" width={W} height={H} viewBox={'0 0 ' + W + ' ' + H}>
        {ids.map((a) => nodes[a].k.map((kv) => {
          const c = kv[1];
          if (!pos[c]) return null;
          return <line key={'e' + a + c + (isNew(c) ? '-' + current : '')} x1={px(a)} y1={py(a)} x2={px(c)} y2={py(c)}
            className={'ht-edge' + (isNew(c) ? ' fresh' : '')} />;
        }))}
        {ids.map((a) => {
          const here = !!names[a];
          const hot = isNew(a) || flip(a);
          return (
            <g key={a + (hot ? '-' + current : '')} className={'ht-node' + (hot ? ' changed' : here ? ' root' : '')}>
              {nodes[a].e && <circle className="tr-ring" cx={px(a)} cy={py(a)} r="28" />}
              <circle cx={px(a)} cy={py(a)} r="21" />
              <text className="ht-v" x={px(a)} y={py(a) + 6} textAnchor="middle">{letter[a] || '·'}</text>
              {here && (
                <g>
                  <rect className="ht-chip" x={px(a) - names[a].join(', ').length * 4.6 - 8} y={py(a) - 56} width={names[a].join(', ').length * 9.2 + 16} height="22" />
                  <text className="ht-chip-t" x={px(a)} y={py(a) - 40} textAnchor="middle">{names[a].join(', ')}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
// ---------- a heap drawn as a tree ----------
const isHeapCode = (code) => /2\s*\*\s*\w+\s*\+\s*[12]|\(\s*\w+\s*-\s*1\s*\)\s*\/\s*2|\bheapify\b|make_heap|push_heap|\b(?:sift|bubble)(?:Up|Down)\b/i.test(code);
function HeapTree({ items, before, name, current }) {
  const n = items.length;
  if (n === 0 || n > 31) return null;
  const levels = Math.floor(Math.log2(n)) + 1;
  const W = Math.max(360, Math.min(780, Math.pow(2, levels - 1) * 64));
  const H = levels * 76 + 24;
  const pos = (i) => {
    const L = Math.floor(Math.log2(i + 1));
    const k = i + 1 - Math.pow(2, L);
    return { x: ((k + 0.5) / Math.pow(2, L)) * W, y: 32 + L * 76 };
  };
  const changed = (i) => !!before && before[i] !== items[i];
  return (
    <div className="viz">
      <div className="h-cap">{name + ' as a tree · index i has children 2i+1 and 2i+2'}</div>
      <svg className="htree" width={W} height={H} viewBox={'0 0 ' + W + ' ' + H}>
        {items.map((_, i) => {
          if (i === 0) return null;
          const p = pos(i);
          const q = pos((i - 1) >> 1);
          return <line key={'e' + i} x1={q.x} y1={q.y} x2={p.x} y2={p.y} className="ht-edge" />;
        })}
        {items.map((x, i) => {
          const p = pos(i);
          return (
            <g key={i + '-' + x + (changed(i) ? '-' + current : '')}
              className={'ht-node' + (i === 0 ? ' root' : '') + (changed(i) ? ' changed' : '')}>
              <circle cx={p.x} cy={p.y} r="23" />
              <text className="ht-v" x={p.x} y={p.y + 6} textAnchor="middle">{x}</text>
              <text className="ht-i" x={p.x} y={p.y + 40} textAnchor="middle">{i}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ---------- queue / priority_queue / deque ----------
function QueueViz({ name, value, before, line, current }) {
  const kind = value.slice(0, value.indexOf('{'));
  const isPq = kind === 'pq';
  const items = stkItems(value);
  const old = before && isLin(before) ? stkItems(before) : null;
  const cnt = (arr, x) => arr.filter((y) => y === x).length;
  let added = -1;
  let gone = null;
  let goneFront = true;
  if (old && items.length > old.length) {
    if (isPq) added = items.findIndex((x) => cnt(items, x) > cnt(old, x));
    else added = kind === 'dq' && items.slice(1).join() === old.join() ? 0 : items.length - 1;
  }
  if (old && items.length < old.length) {
    goneFront = isPq || items.join() === old.slice(1).join();
    gone = goneFront ? old[0] : old[old.length - 1];
  }
  const tagOf = (i) => (isPq ? (i === 0 ? 'top' : '')
    : [i === 0 ? 'front' : '', i === items.length - 1 ? 'back' : ''].filter(Boolean).join(' / '));
  const pk = line.match(new RegExp('\\b' + name + '\\s*\\.\\s*(front|back|top)\\s*\\('));
  const peekVal = pk && items.length ? (pk[1] === 'back' ? items[items.length - 1] : items[0]) : null;
  const label = { que: 'queue · first in, first out',pq: 'priority_queue · the top comes out first' , dq: 'deque · both ends' }[kind];
  const ghost = gone !== null && (
    <div key={'pop-' + current} className="que-cell popped">{gone}<span className="que-tag">popped</span></div>
  );
  return (
    <div className="viz">
      <div className="big-name">{name}</div>
      <div className="h-cap">{label + ' · ' + items.length + (items.length === 1 ? ' item' : ' items')}</div>
      <div className="que">
        {goneFront && ghost}
        {items.length === 0 && <div className="stk-empty">empty</div>}
        {items.map((x, i) => (
          <div key={i + (i === added ? '-' + current : '')}
            className={'que-cell' + (i === 0 ? ' first' : '') + (i === added ? ' changed' : '')}>
            {x}
            <span className="que-tag">{tagOf(i)}</span>
            {isPq && <span className="que-i">{i}</span>}
          </div>
        ))}
        {!goneFront && ghost}
      </div>
     {isPq && <HeapTree items={items} before={old} name={name} current={current} />}
      {peekVal !== null && <div className="reads">next line reads: <b>{name + '.' + pk[1] + '()'}</b>{' → ' + peekVal}</div>}
    </div>
  );
}

// ---------- the heap drawing (SVG) ----------

function HeapView({ steps, current, model, code }) {
  const m = model.per[current];
  const prev = current > 0 ? model.per[current - 1] : null;

  const visible = Object.keys(m.next).sort((a, b) => model.rank[a] - model.rank[b]);
  if (!visible.length) {
    const vars = steps[current].variables;
    const before = current > 0 ? steps[current - 1].variables : {};
       const strArr = (v) => '[' + v.slice(1, -1).split('').map((c) => (c === ' ' ? '␣' : c)).join(' ') + ']';
    const isStr = (n, v) => /^"[^"]*"$/.test(v) && v.length > 2 && v.length <= 42 && accessesIn(code, n).length > 0;
    const shapes = Object.entries(vars)
.filter(([, v]) => v.startsWith('[') || isGrid(v) || isHash(v) || isRes(v))
    .concat(Object.entries(vars).filter(([n, v]) => isStr(n, v)).map(([n, v]) => [n, strArr(v)]));
    const line = (code.split('\n')[steps[current].line - 1] || '');
    const showBits = usesBits(code) && Object.values(vars).some((v) => /^-?\d+$/.test(String(v).trim()));
    const mathNow = usesMath(code) ? lastMathOps(steps, current, code) : { ops: [], stale: false };
const treeNow = steps[current].tree && Object.keys(steps[current].tree.nodes || {}).length > 0;
    const trieNow = steps[current].trie && Object.keys(steps[current].trie.nodes || {}).length > 0;
    if (shapes.length || showBits || mathNow.ops.length || treeNow || trieNow) {
      return (
        <div className="big-arrays">
          {shapes.map(([name, value]) => {
                       const props = { key: name, name, value, before: /^"/.test(before[name] || '') ? strArr(before[name]) : before[name], code, line, vars, current };
if (isStk(value)) return <StackViz {...props} />;
            if (isLin(value)) return <QueueViz {...props} />;
            if (isHash(value)) return <HashViz {...props} />;
            if (isRes(value)) return <ResultViz {...props} />;
            if (isGrid(value)) return <GridViz {...props} />;
           const arr = isFlags(value, code) ? <SieveViz {...props} /> : <ArrayViz {...props} />;
           if (!isHeapCode(code) || !value.startsWith('[')) return arr;
            const szv = ['size', 'heapSize', 'sz', 'cnt', 'count', 'n'].map((k) => vars[k]).find((x) => /^\d+$/.test(String(x)));
            const lim = szv === undefined ? 99 : Number(szv);
            const toArr = (s) => (s && s.startsWith('[') ? s.slice(1, -1).trim().split(/\s+/).filter(Boolean) : null);
            return <div key={name} className="viz">{arr}<HeapTree items={(toArr(value) || []).slice(0, lim)} before={toArr(before[name])} name={name} current={current} /></div>;
          })}
{treeNow && <TreeViz steps={steps} current={current} code={code} vars={vars} />}
                   {trieNow && <TrieViz steps={steps} current={current} vars={vars} />}
          {mathNow.ops.length > 0 && <MathViz ops={mathNow.ops} stale={mathNow.stale} />}
          {showBits && <BitsViz vars={vars} before={before} line={line} current={current} />}
        </div>
      );
    }
    const frames = steps[current].stack || [];
    if (frames.length > 1) {
      return (
        <div className="stack-view">
          <div className="big-name">call stack · the top box is the call that is running</div>
          {frames.map((f, i) => (
            <div key={frames.length - i} className={i === 0 ? 'sframe top' : 'sframe'}
              style={{ background: NODE_COLORS[(frames.length - i) % 4] }}>{niceFrame(f)}</div>
          ))}
        </div>
      );
    }
    return <div className="heap-empty">Nothing in the pond yet. Linked-list nodes, arrays and recursive calls show up here.</div>;
  }
  const pos = {};
  visible.forEach((a, i) => { pos[a] = i; });

  const NW = 170, NH = 72, PITCH = 250, PADX = 60, VAL = 106;
  const CX = VAL + (NW - VAL) / 2; // centre of the pointer cell
  const x = (a) => PADX + pos[a] * PITCH;

  // which pointer names sit on which node
  const names = Object.keys(m.ptrs).sort();
  const stacks = {};
  names.forEach((n) => { (stacks[m.ptrs[n]] = stacks[m.ptrs[n]] || []).push(n); });

  // pointers that moved since the last step (name -> old node address)
  const moved = {};
  if (prev) {
    names.forEach((n) => {
      if (n in prev.ptrs && prev.ptrs[n] !== m.ptrs[n]) moved[n] = prev.ptrs[n];
    });
  }
  const ghosts = {}; // node address -> names that used to sit there
  Object.entries(moved).forEach(([n, old]) => {
    if (old in pos) (ghosts[old] = ghosts[old] || []).push(n);
  });

  // arrows whose target changed since the last step
  const edgeChanged = {};
  if (prev) {
    visible.forEach((a) => {
      if (a in prev.next && prev.next[a] !== m.next[a]) edgeChanged[a] = true;
    });
  }
  const touched = new Set(Object.keys(edgeChanged));
  Object.keys(moved).forEach((n) => touched.add(m.ptrs[n]));

  const Y = 96 + (Object.keys(ghosts).length ? 34 : 0);
  const LY = Y - 42; // row of the pointer chips
  const GY = LY - 34; // row of the faded "where it used to be" chips
  const chipW = (n) => Math.max(56, n.length * 9 + 16);
  // several pointers on one node sit side by side
  const labelX = (a, n) => {
    const list = stacks[a];
    return x(a) + VAL / 2 + (list.indexOf(n) - (list.length - 1) / 2) * 66;
  };

  // arrows: neighbours get a straight arrow, everything else goes underneath
  const straight = [];
  const lanes = [];
  visible.forEach((a) => {
    const b = m.next[a];
    if (b == null || !(b in pos) || b === a) return;
    if (pos[b] === pos[a] + 1) straight.push([a, b]);
    else lanes.push([a, b]);
  });
  lanes.sort((p, q) => Math.abs(pos[p[1]] - pos[p[0]]) - Math.abs(pos[q[1]] - pos[q[0]]));
  // the arrow that was just replaced fades out slowly, so you can see what changed
  const olds = [];
  Object.keys(edgeChanged).forEach((a) => {
    const b = prev.next[a];
    if (b != null && b in pos && b !== a && b !== m.next[a]) olds.push([a, b]);
  });
  const totalLanes = lanes.length + olds.length;

  const W = PADX * 2 + (visible.length - 1) * PITCH + NW + 10;
  const H = Y + NH + 70 + totalLanes * 30 + 46;

  const elbow = (a, b, lane) => {
    const x1 = x(a) + CX;
    const y1 = Y + NH / 2;
    const x2 = x(b) + VAL / 2;
    const y2 = Y + NH + 8;
    const cy = Y + NH + 90 + lane * 38;
    return `M${x1},${y1} C${x1},${cy} ${x2},${cy} ${x2},${y2}`;
  };
  const line = (a, b) => `M${x(a) + CX},${Y + NH / 2} H${x(b) - 4}`;
  const colorOf = (n) => PTR_COLORS[model.names.indexOf(n) % PTR_COLORS.length];

  const drawEdge = (a, d) => {
    const ch = edgeChanged[a];
    return (
      <g key={a + '-' + (ch ? current : 's')}>
        {ch && <path d={d} pathLength={100} className="edge halo" />}
        <path d={d} pathLength={100} className={ch ? 'edge changed' : 'edge'}
          markerEnd={ch ? 'url(#ar-r)' : 'url(#ar-n)'} />
      </g>
    );
  };

  // a little fish swims to whatever just changed
  const target = [...touched][0] || visible[0];
  const bx = x(target) + NW / 2 - 28;
  const by = H - 44;

  return (
    <div className="heap-scroll">
      <svg className="heap-svg" viewBox={`0 0 ${W} ${H}`} style={{ minWidth: W * 0.7, maxWidth: W * 1.1 }}
        role="img" aria-label="Linked list drawing">
        <defs>
          <marker id="ar-n" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,1 L9,5 L0,9z" fill="#14214F" /></marker>
          <marker id="ar-r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,1 L9,5 L0,9z" fill="#C4452F" /></marker>
        </defs>

        {/* the arrow that was replaced fades away */}
        {olds.map(([a, b], i) => (
          <path key={'old-' + a + '-' + current} pathLength={100} className="edge old"
            d={pos[b] === pos[a] + 1 ? line(a, b) : elbow(a, b, lanes.length + i)} />
        ))}

        {/* arrows between nodes */}
        {straight.map(([a, b]) => drawEdge(a, line(a, b)))}
        {lanes.map(([a, b], lane) => drawEdge(a, elbow(a, b, lane)))}

        {/* the nodes (they glide when the layout changes) */}
        {visible.map((a) => {
          const hot = touched.has(a);
          const val = String(model.valueOf[a]);
          return (
            <g key={a} className="node" style={{ transform: `translate(${x(a)}px, 0px)` }}>
              <rect x="6" y={Y + 6} width={NW} height={NH} fill="#14214F" />
              <rect x="0" y={Y} width={NW} height={NH} fill={NODE_COLORS[model.rank[a] % 4]}
                stroke="#14214F" strokeWidth="3" />
              <line x1={VAL} y1={Y} x2={VAL} y2={Y + NH} stroke="#14214F" strokeWidth="3" />
              <rect x={CX - 5} y={Y + NH / 2 - 5} width="10" height="10" fill="#14214F" />
              {m.next[a] === null && (
                <g>
                  <path d={`M${CX},${Y + NH + 4} V${Y + NH + 30}`} stroke="#14214F" strokeWidth="2.5" fill="none" markerEnd="url(#ar-n)" />
                  <rect x={CX - 27} y={Y + NH + 32} width="54" height="20" fill="#FFF1D0" stroke="#14214F" strokeWidth="2" />
                  <text className="null-t" x={CX} y={Y + NH + 46} textAnchor="middle">NULL</text>
                </g>
              )}
              <text className="node-val" x={VAL / 2} y={Y + NH / 2 + 10} textAnchor="middle"
                fontSize={val.length <= 4 ? 30 : val.length <= 7 ? 20 : 14}>{val}</text>
              <text className="node-addr" x={VAL / 2} y={Y + 17} textAnchor="middle">{'0x…' + a.slice(-4)}</text>
              {hot && <rect key={'ring-' + current} className="ring" x="-7" y={Y - 7} width={NW + 14} height={NH + 14} />}
            </g>
          );
        })}

        {/* pointer chips above the nodes: they slide to the new node */}
        {names.map((n) => {
          const a = m.ptrs[n];
          if (!(a in pos)) return null;
          const isMoved = n in moved;
          const fill = isMoved ? '#C4452F' : colorOf(n);
          const w = chipW(n);
          return (
            <g key={n} className="slide" style={{ transform: `translate(${labelX(a, n)}px, ${LY}px)` }}>
              <g key={isMoved ? current : 's'} className={isMoved ? 'chip moved' : 'chip'}>
                <path d={`M0,12 V${Y - LY - 6}`} stroke={fill} strokeWidth="3" fill="none"
                  markerEnd={isMoved ? 'url(#ar-r)' : 'url(#ar-n)'} />
                <rect x={-w / 2 + 3} y="-9" width={w} height="24" fill="#14214F" />
                <rect x={-w / 2} y="-12" width={w} height="24" fill={fill} stroke="#14214F" strokeWidth="2" />
                <text className="chip-t" x="0" y="5" textAnchor="middle">{n}</text>
              </g>
            </g>
          );
        })}

        {/* where a moved pointer used to be + the hop arrow */}
        {Object.entries(moved).map(([n, old], gi) => {
          if (!(old in pos)) return null;
          const now = m.ptrs[n];
          const gx = x(old) + VAL / 2 + (gi - ((ghosts[old] || []).length - 1) / 2) * 66;
          const lx = labelX(now, n);
          const dir = lx > gx ? 1 : -1;
          const x1 = gx + dir * (chipW(n) / 2 + 4);
          const x2 = lx - dir * (chipW(n) / 2 + 4);
          const top = GY - 30;
          return (
            <g key={'ghost-' + n + '-' + current} className="ghost-g">
              <text className="ptr ghost" x={gx} y={GY + 5} textAnchor="middle">{n}</text>
              <path d={`M${x1},${GY - 4} Q${(x1 + x2) / 2},${top} ${x2},${LY - 4}`}
                fill="none" stroke="#C4452F" strokeWidth="3" strokeDasharray="7 5" markerEnd="url(#ar-r)" />
              <text className="hop-txt" x={(x1 + x2) / 2} y={top + 2 - gi * 20} textAnchor="middle">{n + ' moved'}</text>
            </g>
          );
        })}

        {/* the little fish that follows the action */}
        <g className="buddy" style={{ transform: `translate(${bx}px, ${by}px)` }}>
          <g className="bob"><PixelFish color="#FFD25E" size={4} /></g>
        </g>
      </svg>
    </div>
  );
}

// ---------- the app ----------
function App() {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [ranCode, setRanCode] = useState('');
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState('');
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [forceEdit, setForceEdit] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [predict, setPredict] = useState(false);
  const [asking, setAsking] = useState(false);

  const loadExample = (e) => {
    const chosen = examples[e.target.value];
    if (chosen) {
      setCode(chosen.code);
      setInput(chosen.input);
      setForceEdit(true);
    }
  };

  const handleRun = async () => {
    if (loading || !code.trim()) return;
    setLoading(true);
    setPlaying(false);
    setAsking(false);
    try {
      const response = await fetch('http://localhost:5000/tracelist', {
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
        setForceEdit(false);
      } else {
        setSteps([]);
        setError(data.error);
      }
    } catch (e) {
      setError('Could not reach the server. Is the backend running?');
    }
    setLoading(false);
  };

  const last = steps.length - 1;
  const jump = (n) => {
    setAsking(false);
    setCurrent(Math.max(0, Math.min(n, last)));
  };
  // "Predict first": the first press of Next asks you to think, the second press shows the answer
  const goNext = () => {
    if (current >= last) return;
    if (predict && !asking) {
      setAsking(true);
      return;
    }
    jump(current + 1);
  };

  // keyboard: Ctrl+Enter runs, arrow keys step
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        handleRun();
        return;
      }
      const tag = e.target.tagName;
      if (tag === 'TEXTAREA' || tag === 'SELECT' || (tag === 'INPUT' && e.target.type !== 'checkbox')) return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') jump(current - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // play button
  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(() => setCurrent((c) => Math.min(c + 1, last)), 800);
    return () => clearInterval(id);
  }, [playing, last]);
  useEffect(() => {
    if (playing && current >= last) setPlaying(false);
  }, [playing, current, last]);

  // keep the active line visible in the code panel
  useEffect(() => {
    const el = document.querySelector('.ln.on');
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [current, steps]);

  const model = useMemo(() => buildModel(steps), [steps]);
  const effects = useMemo(() => steps.map((_, i) => effectsFor(steps, model, i)), [steps, model]);
  // a new "pass" starts every time the program jumps back to an earlier line (loops!)
  const segs = useMemo(() => {
    let seg = 0;
    return steps.map((s, i) => {
      if (i > 0 && s.line <= steps[i - 1].line) seg++;
      return seg;
    });
  }, [steps]);

  const hasSteps = steps.length > 0;
  const editing = !hasSteps || forceEdit;
  const lines = ranCode.split('\n');
  const step = hasSteps ? steps[current] : null;
  const prevVars = hasSteps && current > 0 ? steps[current - 1].variables : {};

  // faint "prev = 0x…" note at the end of the line that just ran
  let ghostLine = null;
  let ghostText = '';
  if (hasSteps && current > 0 && steps[current - 1].stack.length === step.stack.length) {
    const bits = Object.entries(step.variables)
      .filter(([n, v]) => n in prevVars && prevVars[n] !== v && !v.startsWith('[') && !v.startsWith('{{') && !isHash(v))
      .slice(0, 2)
      .map(([n, v]) => n + ' = ' + short(v));
    if (bits.length) {
      ghostLine = steps[current - 1].line;
      ghostText = bits.join('   ');
    }
  }

  const rowStart = hasSteps ? Math.max(0, Math.min(current - 2, steps.length - 5)) : 0;
  const rows = hasSteps ? steps.slice(rowStart, rowStart + 5).map((s, k) => rowStart + k) : [];

  return (
    <div className="app">
      <header className="top">
        <img className="logo" src={process.env.PUBLIC_URL + '/logo.png'} alt="" />
        <span className="word">DSA Code Visualizer</span>
        <select onChange={loadExample} defaultValue="" aria-label="Load an example">
          <option value="" disabled>Load an example...</option>
          {examples.map((ex, i) => (
            <option key={i} value={i}>{ex.name}</option>
          ))}
        </select>
        <label className="stdin">
          <span>stdin</span>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 4 9" />
        </label>
        <span className="sp" />
        <button className="run" onClick={handleRun} disabled={loading}>
          {loading ? 'Running...' : 'Run it'} <kbd>Ctrl ↵</kbd>
        </button>
      </header>

      <main className="main">
        <section className="left">
          <div className="code-wrap">
            <div className="lab-row">
              <span className="lab"><i className="sq" style={{ background: '#C4452F' }} />Code</span>
              {hasSteps && (
                <button className="link" onClick={() => setForceEdit(!forceEdit)}>
                  {editing ? 'Back to trace' : 'Edit code'}
                </button>
              )}
            </div>
            {editing ? (
              <textarea className="code-in" value={code} onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your C++ code here, or pick an example above..." spellCheck="false" />
            ) : (
              <div className="code">
                {lines.map((text, i) => {
                  const active = i + 1 === step.line;
                  return (
                    <div key={i} className={active ? 'ln on' : 'ln'}>
                      <span className="n">{i + 1}</span>
                      <span className="src">{highlight(text)}</span>
                      {ghostLine === i + 1 && <span className="ghost">{ghostText}</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="info">
            <div>
              <div className="lab"><i className="sq" style={{ background: '#C8602A' }} />Variables</div>
              {!hasSteps && <p className="hint-text">Run the code and your variables show up here.</p>}
              {hasSteps && Object.entries(step.variables).map(([name, value]) => {
                const old = prevVars[name];
                const changed = current > 0 && old !== undefined && old !== value && steps[current - 1].stack.length === step.stack.length;
                if (isGrid(value)) {
                  const rows = parse2D(value);
                  const was = old && isGrid(old) ? parse2D(old) : null;
                  return (
                    <div key={name} className="v-arr">
                      <span className="v-name">{name}</span>
                      <div className="v-grid" style={{ gridTemplateColumns: 'repeat(' + rows[0].length + ', 30px)' }}>
                        {rows.map((row, r) => row.map((c, k) => {
                          const diff = was && was[r] && was[r][k] !== c;
                          return <div key={r + '-' + k + (diff ? '-' + current : '')} className={diff ? 'vg changed' : 'vg'}>{c}</div>;
                        }))}
                      </div>
                    </div>
                  );
                }
                if (value.startsWith('[')) {
                  const cells = value.slice(1, -1).split(' ');
                  const before = old ? old.slice(1, -1).split(' ') : [];
                  return (
                    <div key={name} className="v-arr">
                      <span className="v-name">{name}</span>
                      <div className="array">
                        {cells.map((c, idx) => {
                          const diff = before.length && before[idx] !== c;
                          return (
                            <div key={idx + (diff ? '-' + current : '')} className="cell-wrap">
                              <div className={diff ? 'cell changed' : 'cell'}>{c}</div>
                              <div className="idx">{idx}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={name + (changed ? '-' + current : '')} className={changed ? 'v ch' : 'v'}>
                    <span>{name}</span>
                    <span className="val">{changed && <s>{short(old)}</s>}{short(value)}</span>
                  </div>
                );
              })}
            </div>
            <div>
              <div className="lab"><i className="sq" style={{ background: '#1F7F99' }} />Call stack</div>
              {!hasSteps && <p className="hint-text">Function calls stack up here.</p>}
              {hasSteps && step.stack && step.stack.map((f, i) => (
                <div key={i} className={i === 0 ? 'fr top1' : 'fr'}>{niceFrame(f)}</div>
              ))}
            </div>
          </div>
        </section>

        <section className="right">
          <div className="heap">
            <Pond />
            <div className="lab-row heap-head">
              <span className="lab">
                <i className="sq" style={{ background: '#1F7F99' }} />Heap
                <span className="cap">where your nodes live</span>
              </span>
              {hasSteps && <span className="legend"><b>red</b> = changed this step</span>}
            </div>
            {error && <pre className="error">{error}</pre>}
            {!hasSteps && !error && (
              <div className="empty">
                <img src={process.env.PUBLIC_URL + '/logo.png'} alt="" />
                <p>Paste some C++ and press <b>Run it</b>.</p>
                <p className="sub">Then step through it and watch your pointers move.</p>
              </div>
            )}
            {hasSteps && <HeapView steps={steps} current={current} model={model} code={ranCode} />}
          </div>

          <div className="trace">
            <div className="lab"><i className="sq" style={{ background: '#D4B45F' }} />Trace</div>
            {asking && (
              <div className="ask">
                <span>
                  <b>Your turn.</b> What will <code>{(lines[step.line - 1] || '').trim()}</code> do?
                  Think about it first.
                </span>
                <button onClick={goNext}>Show me</button>
              </div>
            )}
            {!hasSteps && <p className="hint-text">Every step shows up here: the line, and what it changed.</p>}
            {hasSteps && (
              <table>
                <thead>
                  <tr><th style={{ width: 56 }}>Step</th><th style={{ width: 56 }}>Line</th><th style={{ width: '38%' }}>About to run</th><th>Changed since last step</th></tr>
                </thead>
                <tbody>
                  {rows.map((i) => (
                    <tr key={i} className={i === current ? 'c' : i > current ? 'f' : ''} onClick={() => jump(i)}>
                      <td><button className="stepbtn" onClick={() => jump(i)}>{i + 1}</button></td>
                      <td>{steps[i].line}</td>
                      <td title={(lines[steps[i].line - 1] || '').trim()}>{(lines[steps[i].line - 1] || '').trim()}</td>
                      <td className={effects[i] === 'no change' ? 'e none' : 'e'} title={effects[i]}>{effects[i]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      <footer className="bar">
        <button className="ib" onClick={() => jump(0)} disabled={!hasSteps || current === 0} aria-label="First step">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3 2h2v12H3zM13 2v12L6 8z" /></svg>
        </button>
        <button className="ib" onClick={() => jump(current - 1)} disabled={!hasSteps || current === 0} aria-label="Back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M12 2v12L4 8z" /></svg>
        </button>
        <button className="ib pl" onClick={() => setPlaying(!playing)} disabled={!hasSteps} aria-label={playing ? 'Pause' : 'Play'}>
          {playing
            ? <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3 2h4v12H3zM9 2h4v12H9z" /></svg>
            : <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M5 2l9 6-9 6z" /></svg>}
        </button>
        <button className="ib" onClick={goNext} disabled={!hasSteps || current === last} aria-label="Next">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2l8 6-8 6z" /></svg>
        </button>
        <button className="ib" onClick={() => jump(last)} disabled={!hasSteps || current === last} aria-label="Last step">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11 2h2v12h-2zM3 2l7 6-7 6z" /></svg>
        </button>
        <div className="scrub">
          {steps.map((s, i) => (
            <button key={i} className={'tick' + (i < current ? ' done' : '') + (i === current ? ' cur' : '')}
              style={{ background: SEG_COLORS[segs[i] % SEG_COLORS.length] }}
              onClick={() => jump(i)} title={'Step ' + (i + 1)} aria-label={'Go to step ' + (i + 1)} />
          ))}
        </div>
        <label className="predict" title="Pause before each step and think about what it will do">
          <input type="checkbox" checked={predict} onChange={(e) => { setPredict(e.target.checked); setAsking(false); }} />
          Predict first
        </label>
        <span className="cnt">
          <input key={current} className="goto" type="number" min="1" max={steps.length}
            disabled={!hasSteps} defaultValue={hasSteps ? current + 1 : ''}
            onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
            onBlur={(e) => { const n = parseInt(e.target.value, 10); if (!isNaN(n)) jump(n - 1); }} />
          {' / ' + steps.length}
        </span>
        <span className="keys"><kbd>←</kbd> <kbd>→</kbd> step</span>
        <span className="made">made by Kripa</span>
      </footer>
    </div>
  );
}

export default App;