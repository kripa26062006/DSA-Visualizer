#include <iostream>
using namespace std;
int main() {
int x = 5;
cout << "STEP|" << "x=" << x << endl;
int y = 10;
cout << "STEP|" << "x=" << x << "," << "y=" << y << endl;
int sum = x + y;
cout << "STEP|" << "x=" << x << "," << "y=" << y << "," << "sum=" << sum << endl;
return 0;
}