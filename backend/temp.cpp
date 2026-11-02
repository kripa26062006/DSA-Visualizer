#include <iostream>
#include <string>
using namespace std;
struct TrieNode {
    TrieNode* next[26];
    bool end;
};
void insert(TrieNode* root, string word) {
    TrieNode* cur = root;
    for (char c : word) {
        int i = c - 'a';
        if (cur->next[i] == NULL) cur->next[i] = new TrieNode();
        cur = cur->next[i];
    }
    cur->end = true;
}
int main() {
    TrieNode* root = new TrieNode();
    insert(root, "cat");
    insert(root, "car");
    insert(root, "dog");
    return 0;
}