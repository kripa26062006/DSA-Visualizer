#include <iostream>
using namespace std;
int power(int base, int exp) {
if (exp == 0) {
return 1;
}
int rest = power(base, exp - 1);
return base * rest;
}
int main() {
int answer = power(2, 3);
return 0;
}