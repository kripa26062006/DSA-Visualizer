#include <iostream>
#include <vector>
using namespace std;
struct ListNode { int val; ListNode* next; ListNode(int x) : val(x), next(NULL) {} };
#line 1
class Solution {
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
};

#line 100000
int main() {
ListNode* head = NULL; ListNode* tail = NULL; int x;
while (cin >> x) { ListNode* n = new ListNode(x); if (head == NULL) head = n; else tail->next = n; tail = n; }
Solution s;
ListNode* result = s.sortList(head);
return 0;
}
