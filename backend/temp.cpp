#include <iostream>
#include <vector>
using namespace std;
void solve(vector<int>& nums, int i, vector<int>& cur, vector<vector<int>>& res) {
    if (i == nums.size()) { res.push_back(cur); return; }
    cur.push_back(nums[i]);
    solve(nums, i + 1, cur, res);
    cur.pop_back();
    solve(nums, i + 1, cur, res);
}
int main() {
    vector<int> nums = {1, 2, 3};
    vector<int> cur;
    vector<vector<int>> res;
    solve(nums, 0, cur, res);
    return 0;
}