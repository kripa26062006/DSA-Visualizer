#include <iostream>
using namespace std;
int main() {
int arr[3] = {1, 2, 3};
cout << "STEP|" << 4 << "|"; cout << "arr=["; for (int ai_ = 0; ai_ < (int)(sizeof(arr) / sizeof(arr[0])); ai_++) { cout << arr[ai_] << (ai_ + 1 < (int)(sizeof(arr) / sizeof(arr[0])) ? " " : ""); } cout << "]"; cout << endl;
for (int i = 0; i < 3; i++) {
cout << "STEP|" << 5 << "|"; cout << "arr=["; for (int ai_ = 0; ai_ < (int)(sizeof(arr) / sizeof(arr[0])); ai_++) { cout << arr[ai_] << (ai_ + 1 < (int)(sizeof(arr) / sizeof(arr[0])) ? " " : ""); } cout << "]"; cout << ","; cout << "i=" << i; cout << endl;
arr[i] = arr[i] * 2;
cout << "STEP|" << 6 << "|"; cout << "arr=["; for (int ai_ = 0; ai_ < (int)(sizeof(arr) / sizeof(arr[0])); ai_++) { cout << arr[ai_] << (ai_ + 1 < (int)(sizeof(arr) / sizeof(arr[0])) ? " " : ""); } cout << "]"; cout << ","; cout << "i=" << i; cout << endl;
}
return 0;
}