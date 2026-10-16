const code = `#include <iostream>
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
}`;

fetch('http://localhost:5000/tracelist', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code: code, input: '' }),
})
  .then((r) => r.json())
  .then((d) => {
    if (!d.success) console.log(d.error);
    else console.log(JSON.stringify(d.steps.slice(-3), null, 1));
  });