#include <iostream>
using namespace std;
int main() {
int x = 5;
cout << "STEP|" << 4 << "|" << "x=" << x << endl;
int y = 10;
cout << "STEP|" << 5 << "|" << "x=" << x << "," << "y=" << y << endl;
int sum = x + y;
cout << "STEP|" << 6 << "|" << "x=" << x << "," << "y=" << y << "," << "sum=" << sum << endl;
return 0;
}