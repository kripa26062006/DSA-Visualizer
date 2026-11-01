#include <iostream>
#include <queue>
#include <deque>
using namespace std;
int main() {
    queue<int> q;
    q.push(2);
    q.push(3);
    q.push(4);
    int f = q.front();
    q.pop();
    priority_queue<int> pq;
    pq.push(5);
    pq.push(9);
    pq.push(2);
    pq.pop();
    deque<int> d;
    d.push_back(1);
    d.push_front(7);
    d.pop_back();
    return 0;
}