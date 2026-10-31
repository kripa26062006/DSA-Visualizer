#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
#include <climits>
#include <cmath>
#include <map>
#include <set>
#include <unordered_map>
#include <unordered_set>
#include <queue>
#include <stack>
#include <numeric>
#include <bitset>
#include <cstring>
#include <cstdlib>
#include <cstdint>
#include <deque>
#include <list>
#include <functional>
using namespace std;
struct ListNode { int val; ListNode* next; ListNode(int x) : val(x), next(NULL) {} };
#line 1
class Solution {
public:
    int countUnique(vector<int>& nums) {
        unordered_set<int> seen;
        for (int i = 0; i < nums.size(); i++) {
            seen.insert(nums[i]);
        }
        seen.erase(3);
        return seen.size();
    }
};
#line 100000
static string part_(const vector<string>& p, size_t i) { return i < p.size() ? p[i] : string(); }
int main() {
string all_, ln_; while (getline(cin, ln_)) { all_ += ln_; all_ += ' '; }
vector<string> parts_; string cur_;
for (size_t i_ = 0; i_ < all_.size(); i_++) { if (all_[i_] == '|') { parts_.push_back(cur_); cur_.clear(); } else cur_ += all_[i_]; }
parts_.push_back(cur_);
vector<int> arg0_;
{ istringstream is_(part_(parts_, 0)); int x_; while (is_ >> x_) arg0_.push_back(x_); }
Solution sol_;
auto result_ = sol_.countUnique(arg0_);
return 0;
}
