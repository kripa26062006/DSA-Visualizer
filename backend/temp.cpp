#include <iostream>
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
ListNode* prev = NULL;
ListNode* cur = head;
while (cur != NULL) {
ListNode* nxt = cur->next;
cur->next = prev;
prev = cur;
cur = nxt;
}
return 0;
}