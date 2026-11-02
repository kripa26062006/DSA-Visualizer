#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int wt[3] = {1, 3, 4}, val[3] = {15, 20, 30};
    int W = 4, n = 3;
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            dp[i][w] = dp[i - 1][w];
            if (wt[i - 1] <= w)
                dp[i][w] = max(dp[i][w], val[i - 1] + dp[i - 1][w - wt[i - 1]]);
        }
    }
    return 0;
}