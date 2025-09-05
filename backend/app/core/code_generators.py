# app/core/code_generators.py

# ==============================================================================
# == TEMPLATE FACTORY
# ==============================================================================

def create_py_template(meta):
    """Creates a basic Python frontend template for stdin/stdout."""
    return """# Read input from stdin and write output to stdout
# Example:
#
# import sys
#
# def solve():
#     line = sys.stdin.readline()
#     # process the line
#     print(result)
#
# solve()

# Start your code here

"""

def create_cpp_template(meta):
    """Creates a basic C++ frontend template for stdin/stdout."""
    return """#include <iostream>
#include <bits/stdc++.h>
using namespace std;
void solve() {
    // Read from std::cin
    // Write to std::cout
}

int main() {
    // Fast I/O
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);

    // You can handle test cases like this if needed
    // int t;
    // std::cin >> t;
    // while (t--) {
    //     solve();
    // }

    solve();

    return 0;
}
"""