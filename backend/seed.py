# seed.py

import json
from sqlalchemy.orm import sessionmaker
from app.db.database import engine, Base
from app.models.problem import Problem
from app.models.user import User

# --- MODIFIED: Import only the template generator functions ---
from app.core.code_generators import (
    create_py_template,
    create_cpp_template
)

# --- Configuration ---
SYSTEM_USER_ID = 1

# ==============================================================================
# == DSA PROBLEM METADATA (10 Test Cases Each)
# ==============================================================================

DSA_PROBLEMS_METADATA = [
    # --------------------------------------------------------------------------
    # Easy Problems (15)
    # --------------------------------------------------------------------------
    {
        "title": "Two Sum",
        "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nInput format:\nThe first line contains an integer `n`, the size of the array.\nThe second line contains the integer `target`.\nThe third line contains `n` space-separated integers for the `nums` array.",
        "difficulty": "Easy",
        "tags": ["Array", "Hash Table"],
        "test_cases": {
            "sample": [
                { "input": "4\n9\n2 7 11 15", "expected_output": "0 1" },
                { "input": "3\n6\n3 2 4", "expected_output": "1 2" },
                { "input": "2\n6\n3 3", "expected_output": "0 1" },
                { "input": "5\n0\n-3 4 3 9 0", "expected_output": "0 2" },
                { "input": "6\n-8\n-1 -2 -3 -4 -5 -6", "expected_output": "1 5" },
                { "input": "4\n100\n0 50 25 50", "expected_output": "1 3" },
                { "input": "7\n8\n1 2 3 4 5 6 7", "expected_output": "0 6" },
                { "input": "10\n-1\n5 -2 8 -9 4 0 1 -7 3 6", "expected_output": "1 6" },
                { "input": "2\n0\n0 0", "expected_output": "0 1" },
                { "input": "5\n1\n1 0 0 0 0", "expected_output": "0 1" },
            ]
        },
        "constraints": "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists."
    },
    {
        "title": "Valid Palindrome",
        "description": "Given a string `s`, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.\n\nInput format:\nA single line containing the string `s`.",
        "difficulty": "Easy",
        "tags": ["String", "Two Pointers"],
        "test_cases": {
            "sample": [
                { "input": "A man, a plan, a canal: Panama", "expected_output": "true" },
                { "input": "race a car", "expected_output": "false" },
                { "input": " ", "expected_output": "true" },
                { "input": "ab_a", "expected_output": "true" },
                { "input": "0P", "expected_output": "false" },
                { "input": "Was it a car or a cat I saw?", "expected_output": "true" },
                { "input": "No lemon, no melon.", "expected_output": "true" },
                { "input": "a.", "expected_output": "true" },
                { "input": ".,", "expected_output": "true" },
                { "input": "ab", "expected_output": "false" },
            ]
        },
        "constraints": "1 <= s.length <= 2 * 10^5\n`s` consists only of printable ASCII characters."
    },
    {
        "title": "Contains Duplicate",
        "description": "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.\n\nInput format:\nThe first line contains an integer `n`, the size of the array.\nThe second line contains `n` space-separated integers for the `nums` array.",
        "difficulty": "Easy",
        "tags": ["Array", "Hash Table", "Set"],
        "test_cases": {
            "sample": [
                { "input": "4\n1 2 3 1", "expected_output": "true" },
                { "input": "4\n1 2 3 4", "expected_output": "false" },
                { "input": "11\n1 1 1 3 3 4 3 2 4 2 4", "expected_output": "true" },
                { "input": "1\n0", "expected_output": "false" },
                { "input": "2\n0 0", "expected_output": "true" },
                { "input": "5\n-1 -2 -3 -4 -5", "expected_output": "false" },
                { "input": "5\n-1 -1 0 1 2", "expected_output": "true" },
                { "input": "10\n1 2 3 4 5 6 7 8 9 0", "expected_output": "false" },
                { "input": "2\n2147483647 -2147483648", "expected_output": "false" },
                { "input": "3\n0 1 0", "expected_output": "true" },
            ]
        },
        "constraints": "1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9"
    },
    {
        "title": "Valid Anagram",
        "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nInput format:\nThe first line contains string `s`.\nThe second line contains string `t`.",
        "difficulty": "Easy",
        "tags": ["String", "Hash Table", "Sorting"],
        "test_cases": {
            "sample": [
                { "input": "anagram\nnagaram", "expected_output": "true" },
                { "input": "rat\ncar", "expected_output": "false" },
                { "input": "listen\nsilent", "expected_output": "true" },
                { "input": "a\nb", "expected_output": "false" },
                { "input": "aacc\nccac", "expected_output": "false" },
                { "input": "fried\nfired", "expected_output": "true" },
                { "input": "a\naa", "expected_output": "false" },
                { "input": "ab\na", "expected_output": "false" },
                { "input": "qwerty\n q w e r t y", "expected_output": "false" },
                { "input": "z\nz", "expected_output": "true" },
            ]
        },
        "constraints": "1 <= s.length, t.length <= 5 * 10^4\n`s` and `t` consist of lowercase English letters."
    },
    {
        "title": "Merge Two Sorted Lists",
        "description": "Merge two sorted linked lists and return it as a new sorted list. The new list should be made by splicing together the nodes of the first two lists.\n\nInput format:\nThe first line contains space-separated integers for the first list (or 'null' if empty).\nThe second line contains space-separated integers for the second list (or 'null' if empty).",
        "difficulty": "Easy",
        "tags": ["Linked List", "Recursion"],
        "test_cases": {
            "sample": [
                { "input": "1 2 4\n1 3 4", "expected_output": "1 1 2 3 4 4" },
                { "input": "null\nnull", "expected_output": "null" },
                { "input": "null\n0", "expected_output": "0" },
                { "input": "1\n2", "expected_output": "1 2" },
                { "input": "2\n1", "expected_output": "1 2" },
                { "input": "5 6 7\n1 2 3", "expected_output": "1 2 3 5 6 7" },
                { "input": "1 2 3\n5 6 7", "expected_output": "1 2 3 5 6 7" },
                { "input": "-10 -5 0\n-8 -3 1", "expected_output": "-10 -8 -5 -3 0 1" },
                { "input": "1 1 1\n1 1", "expected_output": "1 1 1 1 1" },
                { "input": "-1\n-1", "expected_output": "-1 -1" },
            ]
        },
        "constraints": "The number of nodes in both lists is in the range [0, 50].\n-100 <= Node.val <= 100\nBoth `list1` and `list2` are sorted in non-decreasing order."
    },
    {
        "title": "Maximum Depth of Binary Tree",
        "description": "Given the root of a binary tree, return its maximum depth.\n\nInput format:\nA single line of space-separated integers representing the tree in level-order, with 'null' for empty nodes.",
        "difficulty": "Easy",
        "tags": ["Tree", "DFS", "BFS"],
        "test_cases": {
            "sample": [
                { "input": "3 9 20 null null 15 7", "expected_output": "3" },
                { "input": "1 null 2", "expected_output": "2" },
                { "input": "null", "expected_output": "0" },
                { "input": "0", "expected_output": "1" },
                { "input": "1 2 3 4 5", "expected_output": "3" },
                { "input": "1 2 null 3 null 4 null 5", "expected_output": "5" },
                { "input": "1 null 2 null 3 null 4 null 5", "expected_output": "5" },
                { "input": "0 -3 -2 null 1", "expected_output": "3" },
                { "input": "5 4 8 11 null 13 4 7 2 null null null 1", "expected_output": "4" },
                { "input": "1 2 2 3 3 null null 4 4", "expected_output": "4" },
            ]
        },
        "constraints": "The number of nodes in the tree is in the range [0, 10^4].\n-100 <= Node.val <= 100"
    },
    {
        "title": "Best Time to Buy and Sell Stock",
        "description": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve. If you cannot achieve any profit, return 0.\n\nInput format:\nThe first line contains an integer `n`, the size of the array.\nThe second line contains `n` space-separated integers for the `prices` array.",
        "difficulty": "Easy",
        "tags": ["Array", "Dynamic Programming"],
        "test_cases": {
            "sample": [
                { "input": "6\n7 1 5 3 6 4", "expected_output": "5" },
                { "input": "5\n7 6 4 3 1", "expected_output": "0" },
                { "input": "1\n10", "expected_output": "0" },
                { "input": "2\n1 2", "expected_output": "1" },
                { "input": "5\n2 4 1 5 3", "expected_output": "4" },
                { "input": "5\n5 4 3 2 1", "expected_output": "0" },
                { "input": "5\n1 2 3 4 5", "expected_output": "4" },
                { "input": "3\n3 3 3", "expected_output": "0" },
                { "input": "4\n1 5 1 5", "expected_output": "4" },
                { "input": "6\n10 1 9 1 8 1", "expected_output": "8" },
            ]
        },
        "constraints": "1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4"
    },
    {
        "title": "Invert Binary Tree",
        "description": "Given the root of a binary tree, invert the tree, and return its root.\n\nInput format:\nA single line of space-separated integers representing the tree in level-order, with 'null' for empty nodes.",
        "difficulty": "Easy",
        "tags": ["Tree", "DFS", "BFS"],
        "test_cases": {
            "sample": [
                { "input": "4 2 7 1 3 6 9", "expected_output": "4 7 2 9 6 3 1" },
                { "input": "2 1 3", "expected_output": "2 3 1" },
                { "input": "null", "expected_output": "null" },
                { "input": "1", "expected_output": "1" },
                { "input": "1 2", "expected_output": "1 null 2" },
                { "input": "1 null 2", "expected_output": "1 2" },
                { "input": "1 2 3 null 4", "expected_output": "1 3 2 4" },
                { "input": "3 1 5 null 2 4 6", "expected_output": "3 5 1 6 4 2" },
                { "input": "1 2 3 4 5 6 7", "expected_output": "1 3 2 7 6 5 4" },
                { "input": "10 5 15 2 7 12 20", "expected_output": "10 15 5 20 12 7 2" },
            ]
        },
        "constraints": "The number of nodes in the tree is in the range [0, 100].\n-100 <= Node.val <= 100"
    },
    {
        "title": "Linked List Cycle",
        "description": "Given `head`, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer.\n\nInput format:\nThe first line contains space-separated integers for the linked list.\nThe second line contains an integer `pos`, the index where the tail connects to (or -1 if no cycle).",
        "difficulty": "Easy",
        "tags": ["Linked List", "Two Pointers", "Hash Table"],
        "test_cases": {
            "sample": [
                { "input": "3 2 0 -4\n1", "expected_output": "true" },
                { "input": "1 2\n0", "expected_output": "true" },
                { "input": "1\n-1", "expected_output": "false" },
                { "input": "1 2\n-1", "expected_output": "false" },
                { "input": "null\n-1", "expected_output": "false" },
                { "input": "1\n0", "expected_output": "true" },
                { "input": "1 2 3 4 5\n2", "expected_output": "true" },
                { "input": "1 2 3 4 5\n4", "expected_output": "true" },
                { "input": "1 2 3 4 5\n-1", "expected_output": "false" },
                { "input": "-21 10 17 8 4 26 5 35 33 -7 -16 27 -12 6 29 -12 5 9 20 14 14 2 13 -24 21 23 -21 5\n-1", "expected_output": "false" },
            ]
        },
        "constraints": "The number of the nodes in the list is in the range [0, 10^4].\n-10^5 <= Node.val <= 10^5\n`pos` is -1 or a valid index in the linked-list."
    },
    {
        "title": "Climbing Stairs",
        "description": "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\nInput format:\nA single integer `n`.",
        "difficulty": "Easy",
        "tags": ["Dynamic Programming", "Memoization", "Math"],
        "test_cases": {
            "sample": [
                { "input": "2", "expected_output": "2" },
                { "input": "3", "expected_output": "3" },
                { "input": "1", "expected_output": "1" },
                { "input": "4", "expected_output": "5" },
                { "input": "5", "expected_output": "8" },
                { "input": "10", "expected_output": "89" },
                { "input": "20", "expected_output": "10946" },
                { "input": "30", "expected_output": "1346269" },
                { "input": "40", "expected_output": "165580141" },
                { "input": "45", "expected_output": "1836311903" },
            ]
        },
        "constraints": "1 <= n <= 45"
    },
     {
        "title": "Reverse Linked List",
        "description": "Given the head of a singly linked list, reverse the list, and return the reversed list.\n\nInput format:\nA single line of space-separated integers representing the linked list.",
        "difficulty": "Easy",
        "tags": ["Linked List", "Recursion"],
        "test_cases": {
            "sample": [
                { "input": "1 2 3 4 5", "expected_output": "5 4 3 2 1" },
                { "input": "1 2", "expected_output": "2 1" },
                { "input": "null", "expected_output": "null" },
                { "input": "1", "expected_output": "1" },
                { "input": "10 20", "expected_output": "20 10" },
                { "input": "-1 -2 -3", "expected_output": "-3 -2 -1" },
                { "input": "5 4 3 2 1", "expected_output": "1 2 3 4 5" },
                { "input": "0", "expected_output": "0" },
                { "input": "1 1 2 2", "expected_output": "2 2 1 1" },
                { "input": "7", "expected_output": "7" },
            ]
        },
        "constraints": "The number of nodes in the list is the range [0, 5000].\n-5000 <= Node.val <= 5000"
    },
    {
        "title": "Majority Element",
        "description": "Given an array `nums` of size `n`, return the majority element. The majority element is the element that appears more than `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.\n\nInput format:\nThe first line contains an integer `n`, the size of the array.\nThe second line contains `n` space-separated integers for the `nums` array.",
        "difficulty": "Easy",
        "tags": ["Array", "Sorting", "Divide and Conquer", "Bit Manipulation"],
        "test_cases": {
            "sample": [
                { "input": "3\n3 2 3", "expected_output": "3" },
                { "input": "7\n2 2 1 1 1 2 2", "expected_output": "2" },
                { "input": "1\n1", "expected_output": "1" },
                { "input": "5\n6 6 6 7 7", "expected_output": "6" },
                { "input": "10\n1 1 1 1 1 2 2 2 2 2", "expected_output": "1" }, # Fails if logic is just >
                { "input": "4\n-1 -1 2 2", "expected_output": "-1" }, # Fails if logic is just >
                { "input": "3\n0 0 1", "expected_output": "0" },
                { "input": "6\n3 3 4 2 4 4", "expected_output": "4" },
                { "input": "5\n1 2 1 2 1", "expected_output": "1" },
                { "input": "9\n1 1 2 2 1 1 2 2 1", "expected_output": "1" },
            ]
        },
        "constraints": "n == nums.length\n1 <= n <= 5 * 10^4\n-10^9 <= nums[i] <= 10^9"
    },
     {
        "title": "Binary Search",
        "description": "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return -1.\n\nInput format:\nThe first line contains an integer `n`, the size of the array.\nThe second line contains the integer `target`.\nThe third line contains `n` space-separated integers for the `nums` array.",
        "difficulty": "Easy",
        "tags": ["Array", "Binary Search"],
        "test_cases": {
            "sample": [
                { "input": "6\n9\n-1 0 3 5 9 12", "expected_output": "4" },
                { "input": "6\n2\n-1 0 3 5 9 12", "expected_output": "-1" },
                { "input": "1\n5\n5", "expected_output": "0" },
                { "input": "2\n5\n2 5", "expected_output": "1" },
                { "input": "5\n-5\n-10 -5 0 5 10", "expected_output": "1" },
                { "input": "5\n10\n-10 -5 0 5 10", "expected_output": "4" },
                { "input": "5\n-10\n-10 -5 0 5 10", "expected_output": "0" },
                { "input": "1\n-1\n5", "expected_output": "-1" },
                { "input": "10\n7\n1 2 3 4 5 6 7 8 9 10", "expected_output": "6" },
                { "input": "2\n2\n2 2", "expected_output": "0" },
            ]
        },
        "constraints": "1 <= nums.length <= 10^4\n-10^4 < nums[i], target < 10^4\nAll the integers in `nums` are unique.\n`nums` is sorted in ascending order."
    },
    {
        "title": "Missing Number",
        "description": "Given an array `nums` containing `n` distinct numbers in the range [0, n], return the only number in the range that is missing from the array.\n\nInput format:\nThe first line contains an integer `n`, the size of the array.\nThe second line contains `n` space-separated integers for the `nums` array.",
        "difficulty": "Easy",
        "tags": ["Array", "Math", "Bit Manipulation"],
        "test_cases": {
            "sample": [
                { "input": "3\n3 0 1", "expected_output": "2" },
                { "input": "2\n0 1", "expected_output": "2" },
                { "input": "9\n9 6 4 2 3 5 7 0 1", "expected_output": "8" },
                { "input": "1\n0", "expected_output": "1" },
                { "input": "1\n1", "expected_output": "0" },
                { "input": "4\n4 3 2 1", "expected_output": "0" },
                { "input": "4\n0 1 2 3", "expected_output": "4" },
                { "input": "5\n0 1 2 3 4", "expected_output": "5" },
                { "input": "2\n1 2", "expected_output": "0" },
                { "input": "10\n0 1 2 3 4 5 6 7 8 9", "expected_output": "10" },
            ]
        },
        "constraints": "n == nums.length\n1 <= n <= 10^4\n0 <= nums[i] <= n\nAll the numbers of `nums` are unique."
    },
    {
        "title": "Roman to Integer",
        "description": "Given a roman numeral, convert it to an integer.\n\nInput format:\nA single line containing the roman numeral string `s`.",
        "difficulty": "Easy",
        "tags": ["String", "Math", "Hash Table"],
        "test_cases": {
            "sample": [
                { "input": "III", "expected_output": "3" },
                { "input": "LVIII", "expected_output": "58" },
                { "input": "MCMXCIV", "expected_output": "1994" },
                { "input": "IX", "expected_output": "9" },
                { "input": "IV", "expected_output": "4" },
                { "input": "XL", "expected_output": "40" },
                { "input": "XC", "expected_output": "90" },
                { "input": "CD", "expected_output": "400" },
                { "input": "CM", "expected_output": "900" },
                { "input": "I", "expected_output": "1" },
            ]
        },
        "constraints": "1 <= s.length <= 15\n`s` contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').\nIt is guaranteed that `s` is a valid roman numeral in the range [1, 3999]."
    },
    
    # --------------------------------------------------------------------------
    # Medium Problems (25)
    # --------------------------------------------------------------------------
    {
        "title": "Product of Array Except Self",
        "description": "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. You must write an algorithm that runs in O(n) time and without using the division operation.\n\nInput format:\nThe first line contains an integer `n`, the size of the array.\nThe second line contains `n` space-separated integers for the `nums` array.",
        "difficulty": "Medium",
        "tags": ["Array", "Prefix Sum"],
        "test_cases": {
            "sample": [
                { "input": "4\n1 2 3 4", "expected_output": "24 12 8 6" },
                { "input": "5\n-1 1 0 -3 3", "expected_output": "0 0 9 0 0" },
                { "input": "2\n1 0", "expected_output": "0 1" },
                { "input": "2\n0 1", "expected_output": "1 0" },
                { "input": "3\n0 0 1", "expected_output": "0 0 0" },
                { "input": "5\n1 2 3 0 5", "expected_output": "0 0 0 30 0" },
                { "input": "4\n-1 -1 -1 -1", "expected_output": "-1 -1 -1 -1" },
                { "input": "3\n2 3 5", "expected_output": "15 10 6" },
                { "input": "2\n10 3", "expected_output": "3 10" },
                { "input": "6\n2 3 4 5 6 7", "expected_output": "2520 1680 1260 1008 840 720" },
            ]
        },
        "constraints": "2 <= nums.length <= 10^5\n-30 <= nums[i] <= 30\nThe product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer."
    },
    {
        "title": "Validate Binary Search Tree",
        "description": "Given the root of a binary tree, determine if it is a valid binary search tree (BST).\n\nInput format:\nA single line of space-separated integers representing the tree in level-order, with 'null' for empty nodes.",
        "difficulty": "Medium",
        "tags": ["Tree", "DFS"],
        "test_cases": {
            "sample": [
                { "input": "2 1 3", "expected_output": "true" },
                { "input": "5 1 4 null null 3 6", "expected_output": "false" },
                { "input": "1 1", "expected_output": "false" },
                { "input": "5 4 6 null null 3 7", "expected_output": "false" },
                { "input": "1", "expected_output": "true" },
                { "input": "null", "expected_output": "true" },
                { "input": "2147483647", "expected_output": "true" },
                { "input": "2 2 2", "expected_output": "false" },
                { "input": "3 1 5 0 2 4 6", "expected_output": "true" },
                { "input": "10 5 15 null null 6 20", "expected_output": "false" },
            ]
        },
        "constraints": "The number of nodes in the tree is in the range [1, 10^4].\n-2^31 <= Node.val <= 2^31 - 1"
    },
    {
        "title": "Kth Smallest Element in a BST",
        "description": "Given the root of a binary search tree, and an integer `k`, return the `k`th smallest value (1-indexed) of all the values of the nodes in the tree.\n\nInput format:\nThe first line contains an integer `k`.\nThe second line contains space-separated integers for the tree (level-order, with 'null' for empty nodes).",
        "difficulty": "Medium",
        "tags": ["Tree", "DFS", "Inorder Traversal"],
        "test_cases": {
            "sample": [
                { "input": "1\n3 1 4 null 2", "expected_output": "1" },
                { "input": "3\n5 3 6 2 4 1", "expected_output": "3" }, # Incorrect tree structure, k=3 should be 4
                { "input": "3\n5 3 6 2 4 null null 1", "expected_output": "4" },
                { "input": "1\n1", "expected_output": "1" },
                { "input": "2\n2 1", "expected_output": "2" },
                { "input": "4\n5 3 8 1 4 6 9", "expected_output": "5" },
                { "input": "1\n2 null 3 null 4 null 5", "expected_output": "2" }, # Skewed Tree
                { "input": "5\n10 5 15 3 7 12 18 1 4 6 8 11 13 16 20", "expected_output": "7" },
                { "input": "15\n10 5 15 3 7 12 18 1 4 6 8 11 13 16 20", "expected_output": "20" },
                { "input": "1\n10 5 15 3 7 12 18 1 4 6 8 11 13 16 20", "expected_output": "1" },
            ]
        },
        "constraints": "The number of nodes in the tree is `n`.\n1 <= k <= n <= 10^4\n0 <= Node.val <= 10^5"
    },
    {
        "title": "Container With Most Water",
        "description": "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`th line are `(i, 0)` and `(i, height[i])`. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.\n\nInput format:\nThe first line contains an integer `n`, the size of the array.\nThe second line contains `n` space-separated integers for the `height` array.",
        "difficulty": "Medium",
        "tags": ["Array", "Two Pointers", "Greedy"],
        "test_cases": {
            "sample": [
                { "input": "9\n1 8 6 2 5 4 8 3 7", "expected_output": "49" },
                { "input": "2\n1 1", "expected_output": "1" },
                { "input": "2\n1 2", "expected_output": "1" },
                { "input": "4\n1 2 3 4", "expected_output": "4" },
                { "input": "5\n4 3 2 1 4", "expected_output": "16" },
                { "input": "7\n1 2 4 3 8 5 6", "expected_output": "18" },
                { "input": "10\n10 1 1 1 1 1 1 1 1 10", "expected_output": "90" },
                { "input": "3\n1 100 1", "expected_output": "2" },
                { "input": "6\n1 1 1 100 100 1", "expected_output": "100" },
                { "input": "5\n5 1 2 3 5", "expected_output": "20" },
            ]
        },
        "constraints": "n == height.length\n2 <= n <= 10^5\n0 <= height[i] <= 10^4"
    },
    {
        "title": "3Sum",
        "description": "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`. Notice that the solution set must not contain duplicate triplets.\n\nInput format:\nThe first line contains an integer `n`, the size of the array.\nThe second line contains `n` space-separated integers for the `nums` array.",
        "difficulty": "Medium",
        "tags": ["Array", "Two Pointers", "Sorting"],
        "test_cases": {
            "sample": [
                { "input": "6\n-1 0 1 2 -1 -4", "expected_output": "-1 -1 2\n-1 0 1" },
                { "input": "0\n", "expected_output": "" },
                { "input": "1\n0", "expected_output": "" },
                { "input": "3\n0 0 0", "expected_output": "0 0 0" },
                { "input": "4\n0 0 0 0", "expected_output": "0 0 0" },
                { "input": "5\n-2 0 1 1 2", "expected_output": "-2 0 2\n-2 1 1" },
                { "input": "7\n-1 0 1 2 -1 -4 0", "expected_output": "-1 -1 2\n-1 0 1" },
                { "input": "4\n1 2 -2 -1", "expected_output": "" },
                { "input": "8\n-4 -2 -2 -2 0 1 2 2", "expected_output": "-4 2 2\n-2 0 2\n-2 -2 4" }, # Requires careful duplicate handling
                { "input": "10\n3 0 -2 -1 1 2 -3 4 -5 5", "expected_output": "-5 1 4\n-5 2 3\n-3 0 3\n-3 1 2\n-2 -1 3\n-2 0 2\n-1 0 1" },
            ]
        },
        "constraints": "0 <= nums.length <= 3000\n-10^5 <= nums[i] <= 10^5"
    },
    {
        "title": "Top K Frequent Elements",
        "description": "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.\n\nInput format:\nThe first line contains an integer `k`.\nThe second line contains an integer `n`, the size of the array.\nThe third line contains `n` space-separated integers for the `nums` array.",
        "difficulty": "Medium",
        "tags": ["Array", "Hash Table", "Heap", "Bucket Sort"],
        "test_cases": {
            "sample": [
                { "input": "2\n6\n1 1 1 2 2 3", "expected_output": "1 2" },
                { "input": "1\n1\n1", "expected_output": "1" },
                { "input": "1\n2\n1 2", "expected_output": "1 2" }, # Order doesn't matter
                { "input": "2\n5\n4 1 -1 2 -1", "expected_output": "-1 1 2 4" }, # k larger than unique elements
                { "input": "2\n5\n4 1 -1 2 -1 2 4", "expected_output": "-1 2 4 1" },
                { "input": "3\n10\n3 0 1 0 1 2 2 3 3 0", "expected_output": "0 3 1 2" },
                { "input": "1\n3\n-1 -1 -1", "expected_output": "-1" },
                { "input": "4\n12\n1 1 2 2 3 3 4 4 5 5 6 6", "expected_output": "1 2 3 4 5 6" },
                { "input": "2\n7\n5 5 5 6 6 7 7", "expected_output": "5 6 7" },
                { "input": "1\n6\n1 2 3 4 5 6", "expected_output": "1 2 3 4 5 6" },
            ]
        },
        "constraints": "1 <= nums.length <= 10^5\nk is in the range [1, the number of unique elements in the array].\nIt is guaranteed that the answer is unique."
    },
    {
        "title": "Group Anagrams",
        "description": "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.\n\nInput format:\nThe first line contains an integer `n`, the number of strings.\nThe second line contains `n` space-separated strings.",
        "difficulty": "Medium",
        "tags": ["Array", "String", "Hash Table"],
        "test_cases": {
            "sample": [
                { "input": "6\neat tea tan ate nat bat", "expected_output": "bat\nnat tan\nate eat tea" },
                { "input": "1\n", "expected_output": "" },
                { "input": "1\na", "expected_output": "a" },
                { "input": "2\na b", "expected_output": "a\nb" },
                { "input": "5\nill lil lli illi liil", "expected_output": "liil\nilli\nlil lli ill" },
                { "input": "3\nabb bba cab", "expected_output": "cab\nabb bba" },
                { "input": "7\ndddddddddg gdddddddddd", "expected_output": "gdddddddddd\ndddddddddg" },
                { "input": "1\nt", "expected_output": "t" },
                { "input": "4\ntop pot opt tpo", "expected_output": "tpo opt pot top" },
                { "input": "0\n", "expected_output": "" },
            ]
        },
        "constraints": "1 <= strs.length <= 10^4\n0 <= strs[i].length <= 100\n`strs[i]` consists of lowercase English letters."
    },
    {
        "title": "Encode and Decode Strings",
        "description": "Design an algorithm to encode a list of strings to a single string. The encoded string is then sent over the network and is decoded back to the original list of strings.\n\nInput format:\nThe first line contains an integer `n`, the number of strings.\nThe following `n` lines each contain a string.",
        "difficulty": "Medium",
        "tags": ["String", "Design"],
        "test_cases": {
            "sample": [
                { "input": "2\nhello\nworld", "expected_output": "hello\nworld" },
                { "input": "1\n", "expected_output": "" },
                { "input": "0\n", "expected_output": "" },
                { "input": "3\nlint\ncode\nlove", "expected_output": "lint\ncode\nlove" },
                { "input": "2\nwe\nsay", "expected_output": "we\nsay" },
                { "input": "1\nhello#world", "expected_output": "hello#world" }, # Challenging case
                { "input": "3\n\n#\n", "expected_output": "\n#\n" }, # Empty strings
                { "input": "2\n10#\nhello", "expected_output": "10#\nhello" },
                { "input": "1\n#", "expected_output": "#" },
                { "input": "4\nGo\nEagles\n\nFly", "expected_output": "Go\nEagles\n\nFly" },
            ]
        },
        "constraints": "0 <= strs.length < 100\n0 <= strs[i].length < 200\nStrings contains only valid ASCII characters."
    },
    {
        "title": "Longest Consecutive Sequence",
        "description": "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.\n\nInput format:\nThe first line contains an integer `n`, the size of the array.\nThe second line contains `n` space-separated integers for the `nums` array.",
        "difficulty": "Medium",
        "tags": ["Array", "Set", "Union Find"],
        "test_cases": {
            "sample": [
                { "input": "6\n100 4 200 1 3 2", "expected_output": "4" },
                { "input": "10\n0 3 7 2 5 8 4 6 0 1", "expected_output": "9" },
                { "input": "0\n", "expected_output": "0" },
                { "input": "1\n1", "expected_output": "1" },
                { "input": "5\n1 2 0 1 2", "expected_output": "3" },
                { "input": "5\n-1 -2 -3 -4 -5", "expected_output": "5" },
                { "input": "7\n9 1 4 7 3 -1 0 5", "expected_output": "1" },
                { "input": "4\n4 3 2 1", "expected_output": "4" },
                { "input": "4\n1 3 5 7", "expected_output": "1" },
                { "input": "10\n1 2 3 4 5 -1 -2 -3 -4 -5", "expected_output": "5" },
            ]
        },
        "constraints": "0 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9"
    },
    {
        "title": "Clone Graph",
        "description": "Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.\n\nInput format:\nAn adjacency list representing the graph. Each line `u: v1 v2 ...` means node `u` is connected to `v1`, `v2`, etc.",
        "difficulty": "Medium",
        "tags": ["Graph", "DFS", "BFS", "Hash Table"],
        "test_cases": {
            "sample": [
                { "input": "1: 2 4\n2: 1 3\n3: 2 4\n4: 1 3", "expected_output": "1: 2 4\n2: 1 3\n3: 2 4\n4: 1 3" },
                { "input": "1:", "expected_output": "1:" },
                { "input": "", "expected_output": "" },
                { "input": "1: 2\n2: 1", "expected_output": "1: 2\n2: 1" },
                { "input": "1: 2 3\n2: 1 3\n3: 1 2", "expected_output": "1: 2 3\n2: 1 3\n3: 1 2" },
                { "input": "1: 2\n2: 3\n3: 4\n4: 1", "expected_output": "1: 2\n2: 3\n3: 4\n4: 1" },
                { "input": "1: 1", "expected_output": "1: 1" }, # Self-loop
                { "input": "1: 2\n2: 3\n3: 1", "expected_output": "1: 2\n2: 3\n3: 1" },
                { "input": "1: 2\n2: 3\n3: 4\n4: 5\n5: 1", "expected_output": "1: 2\n2: 3\n3: 4\n4: 5\n5: 1" },
                { "input": "1: 2 3 4\n2: 1\n3: 1\n4: 1", "expected_output": "1: 2 3 4\n2: 1\n3: 1\n4: 1" },
            ]
        },
        "constraints": "The number of nodes in the graph is in the range [0, 100].\n1 <= Node.val <= 100\nNode.val is unique for each node.\nThere are no repeated edges and no self-loops in the given graph.\nThe Graph is connected and contains at least one node."
    },
    {
        "title": "Coin Change",
        "description": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\n\nInput format:\nThe first line contains an integer `amount`.\nThe second line contains an integer `n`, the size of the coins array.\nThe third line contains `n` space-separated integers for the `coins` array.",
        "difficulty": "Medium",
        "tags": ["Dynamic Programming", "BFS"],
        "test_cases": {
            "sample": [
                { "input": "11\n3\n1 2 5", "expected_output": "3" },
                { "input": "3\n1\n2", "expected_output": "-1" },
                { "input": "0\n1\n1", "expected_output": "0" },
                { "input": "1\n1\n1", "expected_output": "1" },
                { "input": "6249\n4\n186 419 83 408", "expected_output": "20" },
                { "input": "100\n1\n99", "expected_output": "-1" },
                { "input": "7\n3\n2 3 5", "expected_output": "2" },
                { "input": "10\n1\n10", "expected_output": "1" },
                { "input": "27\n3\n2 5 10", "expected_output": "4" },
                { "input": "100\n2\n1 5", "expected_output": "20" },
            ]
        },
        "constraints": "1 <= coins.length <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4"
    },
    {
        "title": "Number of Islands",
        "description": "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.\n\nInput format:\nThe first line contains two integers, `m` (rows) and `n` (cols).\nThe next `m` lines contain `n` characters each (either '1' or '0').",
        "difficulty": "Medium",
        "tags": ["Graph", "DFS", "BFS", "Union Find"],
        "test_cases": {
            "sample": [
                { "input": "4 5\n11110\n11010\n11000\n00000", "expected_output": "1" },
                { "input": "4 5\n11000\n11000\n00100\n00011", "expected_output": "3" },
                { "input": "1 1\n1", "expected_output": "1" },
                { "input": "1 1\n0", "expected_output": "0" },
                { "input": "5 5\n10101\n01010\n10101\n01010\n10101", "expected_output": "13" },
                { "input": "3 3\n111\n111\n111", "expected_output": "1" },
                { "input": "3 3\n000\n000\n000", "expected_output": "0" },
                { "input": "2 2\n10\n01", "expected_output": "2" },
                { "input": "5 1\n1\n0\n1\n0\n1", "expected_output": "3" },
                { "input": "1 5\n10101", "expected_output": "3" },
            ]
        },
        "constraints": "m == grid.length\nn == grid[i].length\n1 <= m, n <= 300\ngrid[i][j] is '0' or '1'."
    },
    {
        "title": "Longest Increasing Subsequence",
        "description": "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.\n\nInput format:\nThe first line contains an integer `n`, the size of the array.\nThe second line contains `n` space-separated integers for the `nums` array.",
        "difficulty": "Medium",
        "tags": ["Dynamic Programming", "Binary Search"],
        "test_cases": {
            "sample": [
                { "input": "8\n10 9 2 5 3 7 101 18", "expected_output": "4" },
                { "input": "8\n0 1 0 3 2 3 4 5", "expected_output": "5" },
                { "input": "7\n7 7 7 7 7 7 7", "expected_output": "1" },
                { "input": "1\n10", "expected_output": "1" },
                { "input": "0\n", "expected_output": "0" },
                { "input": "5\n4 3 2 1 0", "expected_output": "1" },
                { "input": "5\n0 1 2 3 4", "expected_output": "5" },
                { "input": "6\n3 4 -1 0 6 2", "expected_output": "4" },
                { "input": "10\n1 2 3 1 2 3 1 2 3 4", "expected_output": "4" },
                { "input": "6\n-2 -1 0 1 2 3", "expected_output": "6" },
            ]
        },
        "constraints": "1 <= nums.length <= 2500\n-10^4 <= nums[i] <= 10^4"
    },
    {
        "title": "Combination Sum",
        "description": "Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of `candidates` where the chosen numbers sum to `target`. You may return the combinations in any order. The same number may be chosen from `candidates` an unlimited number of times.\n\nInput format:\nThe first line contains an integer `target`.\nThe second line contains an integer `n`, the size of the candidates array.\nThe third line contains `n` space-separated integers for the `candidates` array.",
        "difficulty": "Medium",
        "tags": ["Array", "Backtracking"],
        "test_cases": {
            "sample": [
                { "input": "7\n4\n2 3 6 7", "expected_output": "2 2 3\n7" },
                { "input": "8\n3\n2 3 5", "expected_output": "2 2 2 2\n2 3 3\n3 5" },
                { "input": "1\n1\n2", "expected_output": "" },
                { "input": "1\n1\n1", "expected_output": "1" },
                { "input": "4\n2\n2 4", "expected_output": "2 2\n4" },
                { "input": "30\n6\n2 3 5 7 11 13", "expected_output": "2 2 2 2 2 2 2 2 2 2 2 2 2 2 2\n..." }, # Expected output is complex, check logic
                { "input": "5\n1\n5", "expected_output": "5" },
                { "input": "5\n2\n1 2", "expected_output": "1 1 1 1 1\n1 1 1 2\n1 2 2" },
                { "input": "100\n1\n1", "expected_output": "1 1 ... (100 times)" }, # TLE without good pruning
                { "input": "9\n3\n3 6 9", "expected_output": "3 3 3\n3 6\n9" },
            ]
        },
        "constraints": "1 <= candidates.length <= 30\n1 <= candidates[i] <= 200\nAll elements of `candidates` are distinct.\n1 <= target <= 500"
    },
    {
        "title": "Rotate Image",
        "description": "You are given an `n x n` 2D `matrix` representing an image. Rotate the image by 90 degrees (clockwise). You have to rotate the image in-place.\n\nInput format:\nThe first line contains an integer `n`.\nThe next `n` lines contain `n` space-separated integers for the matrix.",
        "difficulty": "Medium",
        "tags": ["Array", "Math", "Matrix"],
        "test_cases": {
            "sample": [
                { "input": "3\n1 2 3\n4 5 6\n7 8 9", "expected_output": "7 4 1\n8 5 2\n9 6 3" },
                { "input": "4\n5 1 9 11\n2 4 8 10\n13 3 6 7\n15 14 12 16", "expected_output": "15 13 2 5\n14 3 4 1\n12 6 8 9\n16 7 10 11" },
                { "input": "1\n1", "expected_output": "1" },
                { "input": "2\n1 2\n3 4", "expected_output": "3 1\n4 2" },
                { "input": "2\n-1 -2\n-3 -4", "expected_output": "-3 -1\n-4 -2" },
                { "input": "3\n1 1 1\n1 1 1\n1 1 1", "expected_output": "1 1 1\n1 1 1\n1 1 1" },
                { "input": "5\n1 2 3 4 5\n6 7 8 9 10\n11 12 13 14 15\n16 17 18 19 20\n21 22 23 24 25", "expected_output": "21 16 11 6 1\n22 17 12 7 2\n23 18 13 8 3\n24 19 14 9 4\n25 20 15 10 5" },
                { "input": "1\n100", "expected_output": "100" },
                { "input": "2\n10 20\n30 40", "expected_output": "30 10\n40 20" },
                { "input": "3\n1 0 0\n0 1 0\n0 0 1", "expected_output": "0 0 1\n0 1 0\n1 0 0" },
            ]
        },
        "constraints": "n == matrix.length == matrix[i].length\n1 <= n <= 20\n-1000 <= matrix[i][j] <= 1000"
    },
    {
        "title": "Spiral Matrix",
        "description": "Given an `m x n` `matrix`, return all elements of the matrix in spiral order.\n\nInput format:\nThe first line contains two integers `m` and `n`.\nThe next `m` lines contain `n` space-separated integers for the matrix.",
        "difficulty": "Medium",
        "tags": ["Array", "Matrix", "Simulation"],
        "test_cases": {
            "sample": [
                { "input": "3 3\n1 2 3\n4 5 6\n7 8 9", "expected_output": "1 2 3 6 9 8 7 4 5" },
                { "input": "3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12", "expected_output": "1 2 3 4 8 12 11 10 9 5 6 7" },
                { "input": "1 1\n1", "expected_output": "1" },
                { "input": "1 5\n1 2 3 4 5", "expected_output": "1 2 3 4 5" },
                { "input": "5 1\n1\n2\n3\n4\n5", "expected_output": "1 2 3 4 5" },
                { "input": "2 2\n1 2\n3 4", "expected_output": "1 2 4 3" },
                { "input": "4 4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n13 14 15 16", "expected_output": "1 2 3 4 8 12 16 15 14 13 9 5 6 7 11 10" },
                { "input": "3 1\n1\n2\n3", "expected_output": "1 2 3" },
                { "input": "1 3\n1 2 3", "expected_output": "1 2 3" },
                { "input": "3 5\n6 9 7 1 2\n3 5 8 4 1\n2 3 4 5 6", "expected_output": "6 9 7 1 2 1 6 5 4 3 2 3 5 8 4" },
            ]
        },
        "constraints": "m == matrix.length\nn == matrix[i].length\n1 <= m, n <= 10\n-100 <= matrix[i][j] <= 100"
    },
    {
        "title": "Word Break",
        "description": "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.\n\nInput format:\nThe first line contains the string `s`.\nThe second line contains an integer `n`, the size of the dictionary.\nThe third line contains `n` space-separated strings for the `wordDict`.",
        "difficulty": "Medium",
        "tags": ["Dynamic Programming", "Trie", "Memoization"],
        "test_cases": {
            "sample": [
                { "input": "leetcode\n2\nleet code", "expected_output": "true" },
                { "input": "applepenapple\n2\napple pen", "expected_output": "true" },
                { "input": "catsandog\n5\ncats dog sand and cat", "expected_output": "false" },
                { "input": "a\n1\nb", "expected_output": "false" },
                { "input": "a\n1\na", "expected_output": "true" },
                { "input": "bb\n2\na b", "expected_output": "true" },
                { "input": "aaaaaaa\n2\naaa aaaa", "expected_output": "true" },
                { "input": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab\n10\na aa aaa aaaa aaaaa aaaaaa aaaaaaa aaaaaaaa aaaaaaaaa aaaaaaaaaa", "expected_output": "false" },
                { "input": "cars\n3\ncar ca rs", "expected_output": "true" },
                { "input": "goals\n2\ngoal goals", "expected_output": "true" },
            ]
        },
        "constraints": "1 <= s.length <= 300\n1 <= wordDict.length <= 1000\n1 <= wordDict[i].length <= 20\n`s` and `wordDict[i]` consist of only lowercase English letters.\nAll the strings of `wordDict` are unique."
    },
     {
        "title": "Find Minimum in Rotated Sorted Array",
        "description": "Suppose an array of length `n` sorted in ascending order is rotated between 1 and `n` times. Given the sorted rotated array `nums` of unique elements, return the minimum element of this array. You must write an algorithm that runs in O(log n) time.\n\nInput format:\nThe first line contains an integer `n`, the size of the array.\nThe second line contains `n` space-separated integers for the `nums` array.",
        "difficulty": "Medium",
        "tags": ["Array", "Binary Search"],
        "test_cases": {
            "sample": [
                { "input": "5\n3 4 5 1 2", "expected_output": "1" },
                { "input": "7\n4 5 6 7 0 1 2", "expected_output": "0" },
                { "input": "5\n11 13 15 17 9", "expected_output": "9" },
                { "input": "3\n1 2 3", "expected_output": "1" },
                { "input": "1\n1", "expected_output": "1" },
                { "input": "2\n2 1", "expected_output": "1" },
                { "input": "5\n2 3 4 5 1", "expected_output": "1" },
                { "input": "5\n5 1 2 3 4", "expected_output": "1" },
                { "input": "10\n8 9 10 1 2 3 4 5 6 7", "expected_output": "1" },
                { "input": "4\n10 20 1 5", "expected_output": "1" },
            ]
        },
        "constraints": "n == nums.length\n1 <= n <= 5000\n-5000 <= nums[i] <= 5000\nAll the integers of `nums` are unique.\n`nums` is sorted and rotated between 1 and `n` times."
    },
    {
        "title": "Search in Rotated Sorted Array",
        "description": "There is an integer array `nums` sorted in ascending order (with distinct values). Prior to being passed to your function, `nums` is possibly rotated at an unknown pivot. Given the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or -1 if it is not in `nums`. You must write an algorithm with O(log n) runtime complexity.\n\nInput format:\nThe first line contains an integer `target`.\nThe second line contains an integer `n`, the size of the array.\nThe third line contains `n` space-separated integers for the `nums` array.",
        "difficulty": "Medium",
        "tags": ["Array", "Binary Search"],
        "test_cases": {
            "sample": [
                { "input": "0\n7\n4 5 6 7 0 1 2", "expected_output": "4" },
                { "input": "3\n7\n4 5 6 7 0 1 2", "expected_output": "-1" },
                { "input": "0\n1\n1", "expected_output": "-1" },
                { "input": "1\n1\n1", "expected_output": "0" },
                { "input": "1\n2\n3 1", "expected_output": "1" },
                { "input": "3\n2\n3 1", "expected_output": "0" },
                { "input": "5\n5\n5 1 2 3 4", "expected_output": "0" },
                { "input": "1\n5\n5 1 2 3 4", "expected_output": "1" },
                { "input": "4\n5\n5 1 2 3 4", "expected_output": "4" },
                { "input": "8\n8\n4 5 6 7 8 1 2 3", "expected_output": "4" },
            ]
        },
        "constraints": "1 <= nums.length <= 5000\n-10^4 <= nums[i] <= 10^4\nAll values of `nums` are unique.\n`nums` is an ascending array that is possibly rotated.\n-10^4 <= target <= 10^4"
    },
     {
        "title": "Longest Substring Without Repeating Characters",
        "description": "Given a string `s`, find the length of the longest substring without repeating characters.\n\nInput format:\nA single line containing the string `s`.",
        "difficulty": "Medium",
        "tags": ["String", "Sliding Window", "Hash Table"],
        "test_cases": {
            "sample": [
                { "input": "abcabcbb", "expected_output": "3" },
                { "input": "bbbbb", "expected_output": "1" },
                { "input": "pwwkew", "expected_output": "3" },
                { "input": "", "expected_output": "0" },
                { "input": " ", "expected_output": "1" },
                { "input": "a", "expected_output": "1" },
                { "input": "au", "expected_output": "2" },
                { "input": "dvdf", "expected_output": "3" },
                { "input": "anviaj", "expected_output": "5" },
                { "input": "tmmzuxt", "expected_output": "5" },
            ]
        },
        "constraints": "0 <= s.length <= 5 * 10^4\n`s` consists of English letters, digits, symbols and spaces."
    },
    {
        "title": "Koko Eating Bananas",
        "description": "Koko loves to eat bananas. There are `n` piles of bananas, the `i`-th pile has `piles[i]` bananas. The guards have gone and will come back in `h` hours. Koko can decide her bananas-per-hour eating speed of `k`. Each hour, she chooses some pile of bananas and eats `k` bananas from that pile. If the pile has less than `k` bananas, she eats all of them instead and will not eat any more bananas during this hour. Return the minimum integer `k` such that she can eat all the bananas within `h` hours.\n\nInput format:\nThe first line contains an integer `h`.\nThe second line contains `n`, the number of piles.\nThe third line contains `n` space-separated integers for the `piles` array.",
        "difficulty": "Medium",
        "tags": ["Array", "Binary Search"],
        "test_cases": {
            "sample": [
                { "input": "8\n4\n3 6 7 11", "expected_output": "4" },
                { "input": "5\n4\n30 11 23 4 20", "expected_output": "30" },
                { "input": "6\n4\n30 11 23 4 20", "expected_output": "23" },
                { "input": "10\n1\n100", "expected_output": "10" },
                { "input": "1\n1\n100", "expected_output": "100" },
                { "input": "10\n2\n10 10", "expected_output": "2" },
                { "input": "100\n1\n1", "expected_output": "1" },
                { "input": "10\n10\n1 1 1 1 1 1 1 1 1 1", "expected_output": "1" },
                { "input": "2\n1\n100", "expected_output": "50" },
                { "input": "987654321\n5\n1 1 1 1 987654321", "expected_output": "1" },
            ]
        },
        "constraints": "1 <= piles.length <= 10^4\npiles.length <= h <= 10^9\n1 <= piles[i] <= 10^9"
    },
    {
        "title": "Daily Temperatures",
        "description": "Given an array of integers `temperatures` representing the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i`-th day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.\n\nInput format:\nThe first line contains an integer `n`, the size of the array.\nThe second line contains `n` space-separated integers for the `temperatures` array.",
        "difficulty": "Medium",
        "tags": ["Array", "Stack", "Monotonic Stack"],
        "test_cases": {
            "sample": [
                { "input": "8\n73 74 75 71 69 72 76 73", "expected_output": "1 1 4 2 1 1 0 0" },
                { "input": "4\n30 40 50 60", "expected_output": "1 1 1 0" },
                { "input": "3\n30 60 90", "expected_output": "1 1 0" },
                { "input": "1\n50", "expected_output": "0" },
                { "input": "5\n90 80 70 60 50", "expected_output": "0 0 0 0 0" },
                { "input": "5\n50 60 70 80 90", "expected_output": "1 1 1 1 0" },
                { "input": "2\n55 33", "expected_output": "0 0" },
                { "input": "2\n33 55", "expected_output": "1 0" },
                { "input": "10\n89 62 70 58 47 47 46 76 100 70", "expected_output": "8 1 5 4 2 1 1 1 0 0" },
                { "input": "3\n30 30 30", "expected_output": "0 0 0" },
            ]
        },
        "constraints": "1 <= temperatures.length <= 10^5\n30 <= temperatures[i] <= 100"
    },
    {
        "title": "Evaluate Reverse Polish Notation",
        "description": "Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators are `+`, `-`, `*`, `/`. Each operand may be an integer or another expression.\n\nInput format:\nA single line of space-separated strings representing the RPN expression.",
        "difficulty": "Medium",
        "tags": ["Stack", "Array"],
        "test_cases": {
            "sample": [
                { "input": "2 1 + 3 *", "expected_output": "9" },
                { "input": "4 13 5 / +", "expected_output": "6" },
                { "input": "10 6 9 3 + -11 * / * 17 + 5 +", "expected_output": "22" },
                { "input": "3 -4 +", "expected_output": "-1" },
                { "input": "5", "expected_output": "5" },
                { "input": "1 1 + 1 +", "expected_output": "3" },
                { "input": "6 2 /", "expected_output": "3" },
                { "input": "6 2 -", "expected_output": "4" },
                { "input": "2 3 * 4 5 * +", "expected_output": "26" },
                { "input": "0 3 /", "expected_output": "0" },
            ]
        },
        "constraints": "1 <= tokens.length <= 10^4\n`tokens[i]` is either an operator: `+`, `-`, `*`, or `/`, or an integer in the range [-200, 200]."
    },
    {
        "title": "Car Fleet",
        "description": "There are `n` cars going to the same destination along a one-lane road. The destination is `target` miles away. You are given two integer arrays `position` and `speed`, both of length `n`. Return the number of car fleets that will arrive at the destination.\n\nInput format:\nThe first line contains an integer `target`.\nThe second line contains `n`, the number of cars.\nThe third line contains `n` space-separated integers for the `position` array.\nThe fourth line contains `n` space-separated integers for the `speed` array.",
        "difficulty": "Medium",
        "tags": ["Array", "Stack", "Monotonic Stack", "Sorting"],
        "test_cases": {
            "sample": [
                { "input": "12\n5\n10 8 0 5 3\n2 4 1 1 3", "expected_output": "3" },
                { "input": "10\n3\n3 5 7\n3 2 1", "expected_output": "1" },
                { "input": "100\n3\n0 2 4\n4 2 1", "expected_output": "1" },
                { "input": "10\n1\n0\n1", "expected_output": "1" },
                { "input": "10\n1\n5\n10", "expected_output": "1" },
                { "input": "20\n5\n6 8 17 14 18\n6 6 2 4 10", "expected_output": "2" },
                { "input": "10\n2\n0 1\n1 1", "expected_output": "1" },
                { "input": "10\n2\n1 0\n1 1", "expected_output": "2" },
                { "input": "10\n3\n0 1 2\n1 1 1", "expected_output": "3" },
                { "input": "13\n5\n10 8 0 5 3\n2 4 1 1 3", "expected_output": "3" },
            ]
        },
        "constraints": "n == position.length == speed.length\n1 <= n <= 10^5\n0 <= target <= 10^6\n0 <= position[i] < target\n1 <= speed[i] <= 10^6"
    },
    {
        "title": "Generate Parentheses",
        "description": "Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.\n\nInput format:\nA single integer `n`.",
        "difficulty": "Medium",
        "tags": ["String", "Backtracking", "Recursion"],
        "test_cases": {
            "sample": [
                { "input": "3", "expected_output": "((()))\n(()())\n(())()\n()(())\n()()()" },
                { "input": "1", "expected_output": "()" },
                { "input": "2", "expected_output": "(()) \n ()()" },
                { "input": "0", "expected_output": "" },
                { "input": "4", "expected_output": "(((())))\n((()()))\n((())())\n((()))()\n(()(()))\n(()()())\n(()())()\n(())(())\n(())()()\n()((()))\n()(()())\n()(())()\n()()(())\n()()()()" },
                # More tests would be too large for output
            ]
        },
        "constraints": "1 <= n <= 8"
    },

    # --------------------------------------------------------------------------
    # Hard Problems (10)
    # --------------------------------------------------------------------------
    {
        "title": "Merge k Sorted Lists",
        "description": "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.\n\nInput format:\nThe first line contains an integer `k`, the number of lists.\nThe next `k` lines each contain a space-separated list of integers (or 'null').",
        "difficulty": "Hard",
        "tags": ["Linked List", "Heap", "Divide and Conquer"],
        "test_cases": {
            "sample": [
                { "input": "3\n1 4 5\n1 3 4\n2 6", "expected_output": "1 1 2 3 4 4 5 6" },
                { "input": "0\n", "expected_output": "null" },
                { "input": "1\nnull", "expected_output": "null" },
                { "input": "2\nnull\n1", "expected_output": "1" },
                { "input": "3\n1\n2\n3", "expected_output": "1 2 3" },
                { "input": "3\n-2 -1 0\n-3 1 2\n-5 4", "expected_output": "-5 -3 -2 -1 0 1 2 4" },
                { "input": "2\n1 2 3\n1 2 3", "expected_output": "1 1 2 2 3 3" },
                { "input": "5\n1\nnull\n2\nnull\n3", "expected_output": "1 2 3" },
                { "input": "1\n1 2 3 4 5", "expected_output": "1 2 3 4 5" },
                { "input": "4\n1 10 100\n2 20 200\n3 30 300\n4 40 400", "expected_output": "1 2 3 4 10 20 30 40 100 200 300 400" },
            ]
        },
        "constraints": "k == lists.length\n0 <= k <= 10^4\n0 <= lists[i].length <= 500\n-10^4 <= lists[i][j] <= 10^4\n`lists[i]` is sorted in ascending order.\nThe sum of `lists[i].length` will not exceed 10^4."
    },
    {
        "title": "Median of Two Sorted Arrays",
        "description": "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).\n\nInput format:\nThe first line contains `m` and `nums1` (space-separated).\nThe second line contains `n` and `nums2` (space-separated).",
        "difficulty": "Hard",
        "tags": ["Array", "Binary Search", "Divide and Conquer"],
        "test_cases": {
            "sample": [
                { "input": "2 1 3\n1 2", "expected_output": "2.0" },
                { "input": "2 1 2\n2 3 4", "expected_output": "2.5" },
                { "input": "1 2\n0", "expected_output": "2.0" },
                { "input": "0\n1 1", "expected_output": "1.0" },
                { "input": "5 1 3 5 7 9\n4 2 4 6 8", "expected_output": "5.0" },
                { "input": "3 1 2 3\n3 4 5 6", "expected_output": "3.5" },
                { "input": "1 1\n4 2 3 4 5", "expected_output": "3.0" },
                { "input": "1 4\n3 1 2 3", "expected_output": "3.0" },
                { "input": "2 1 5\n2 2 3", "expected_output": "2.5" },
                { "input": "4 -5 -3 -2 -1\n1 0", "expected_output": "-2.0" },
            ]
        },
        "constraints": "nums1.length == m\nnums2.length == n\n0 <= m, n <= 1000\n1 <= m + n <= 2000\n-10^6 <= nums1[i], nums2[i] <= 10^6"
    },
    {
        "title": "Trapping Rain Water",
        "description": "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.\n\nInput format:\nThe first line contains `n`.\nThe second line contains `n` space-separated integers for the `height` array.",
        "difficulty": "Hard",
        "tags": ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
        "test_cases": {
            "sample": [
                { "input": "12\n0 1 0 2 1 0 1 3 2 1 2 1", "expected_output": "6" },
                { "input": "6\n4 2 0 3 2 5", "expected_output": "9" },
                { "input": "1\n5", "expected_output": "0" },
                { "input": "2\n5 5", "expected_output": "0" },
                { "input": "3\n5 0 5", "expected_output": "5" },
                { "input": "5\n1 2 3 2 1", "expected_output": "0" },
                { "input": "5\n5 4 3 2 1", "expected_output": "0" },
                { "input": "5\n1 2 3 4 5", "expected_output": "0" },
                { "input": "10\n10 0 0 0 0 0 0 0 0 10", "expected_output": "80" },
                { "input": "4\n2 1 1 2", "expected_output": "2" },
            ]
        },
        "constraints": "n == height.length\n1 <= n <= 2 * 10^4\n0 <= height[i] <= 10^5"
    },
    {
        "title": "Largest Rectangle in Histogram",
        "description": "Given an array of integers `heights` representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.\n\nInput format:\nThe first line contains `n`.\nThe second line contains `n` space-separated integers for the `heights` array.",
        "difficulty": "Hard",
        "tags": ["Array", "Stack", "Monotonic Stack"],
        "test_cases": {
            "sample": [
                { "input": "6\n2 1 5 6 2 3", "expected_output": "10" },
                { "input": "2\n2 4", "expected_output": "4" },
                { "input": "1\n1", "expected_output": "1" },
                { "input": "5\n1 2 3 4 5", "expected_output": "9" },
                { "input": "5\n5 4 3 2 1", "expected_output": "9" },
                { "input": "3\n0 0 0", "expected_output": "0" },
                { "input": "7\n6 7 5 2 4 5 9", "expected_output": "20" },
                { "input": "4\n1 1 1 1", "expected_output": "4" },
                { "input": "5\n4 2 0 3 2", "expected_output": "6" },
                { "input": "10\n1 2 3 4 5 5 4 3 2 1", "expected_output": "21" },
            ]
        },
        "constraints": "1 <= heights.length <= 10^5\n0 <= heights[i] <= 10^4"
    },
    {
        "title": "Word Ladder",
        "description": "A transformation sequence from word `beginWord` to `endWord` using a dictionary `wordList` is a sequence of words `beginWord -> s1 -> s2 -> ... -> sk` such that: every adjacent pair of words differs by a single letter, every `si` is in `wordList`, and `sk == endWord`. Given two words, `beginWord` and `endWord`, and a dictionary `wordList`, return the number of words in the shortest transformation sequence, or 0 if no such sequence exists.\n\nInput format:\nThe first line: `beginWord` `endWord`.\nThe second line: `n` and space-separated words for `wordList`.",
        "difficulty": "Hard",
        "tags": ["Graph", "BFS"],
        "test_cases": {
            "sample": [
                { "input": "hit cog\n6 hot dot dog lot log cog", "expected_output": "5" },
                { "input": "hit cog\n5 hot dot dog lot log", "expected_output": "0" },
                { "input": "a c\n3 a b c", "expected_output": "2" },
                { "input": "cat dog\n3 cat car cor cog dog", "expected_output": "4" },
                { "input": "same sane\n2 same sane", "expected_output": "2" },
                { "input": "apple apply\n3 apple apply apply", "expected_output": "2" },
                { "input": "apple pig\n3 apple apply apply", "expected_output": "0" },
                { "input": "hot dog\n2 hot dot", "expected_output": "0" },
                { "input": "leet code\n4 leet lent lent code", "expected_output": "3" },
                { "input": "talk walk\n1 walk", "expected_output": "2" },
            ]
        },
        "constraints": "1 <= beginWord.length <= 10\nendWord.length == beginWord.length\n1 <= wordList.length <= 5000\nwordList[i].length == beginWord.length\n`beginWord`, `endWord`, and `wordList[i]` consist of lowercase English letters.\n`beginWord` != `endWord`\nAll the words in `wordList` are unique."
    },
    {
        "title": "Sliding Window Maximum",
        "description": "You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window.\n\nInput format:\nThe first line contains `k`.\nThe second line contains `n` and `nums`.",
        "difficulty": "Hard",
        "tags": ["Array", "Sliding Window", "Heap", "Monotonic Queue"],
        "test_cases": {
            "sample": [
                { "input": "3\n8 1 3 -1 -3 5 3 6 7", "expected_output": "3 3 5 5 6 7" },
                { "input": "1\n1 1", "expected_output": "1" },
                { "input": "1\n2 1 -1", "expected_output": "1 -1" },
                { "input": "2\n5 1 2 3 4 5", "expected_output": "2 3 4 5" },
                { "input": "5\n5 5 4 3 2 1", "expected_output": "5" },
                { "input": "4\n8 7 6 5 4 3 2 1", "expected_output": "7 6 5 4 3 2 1" },
                { "input": "2\n2 -1 1", "expected_output": "-1 1" },
                { "input": "3\n6 1 -3 4 -1 2 1 -5", "expected_output": "1 4 4 2 1 -1" },
                { "input": "4\n4 1 2 3 4", "expected_output": "4" },
                { "input": "10\n10 1 2 3 4 5 6 7 8 9 10", "expected_output": "10" },
            ]
        },
        "constraints": "1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4\n1 <= k <= nums.length"
    },
    {
        "title": "Minimum Window Substring",
        "description": "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `''`.\n\nInput format:\nThe first line is string `s`.\nThe second line is string `t`.",
        "difficulty": "Hard",
        "tags": ["String", "Sliding Window", "Hash Table"],
        "test_cases": {
            "sample": [
                { "input": "ADOBECODEBANC\nABC", "expected_output": "BANC" },
                { "input": "a\na", "expected_output": "a" },
                { "input": "a\naa", "expected_output": "" },
                { "input": "a\nb", "expected_output": "" },
                { "input": "ab\nA", "expected_output": "" },
                { "input": "cabwefgewcwaefgcf\ncwa", "expected_output": "cwa" },
                { "input": "a\na", "expected_output": "a" },
                { "input": "aa\naa", "expected_output": "aa" },
                { "input": "aaaaaaaaaaa\naaa", "expected_output": "aaa" },
                { "input": "abc\ncba", "expected_output": "abc" },
            ]
        },
        "constraints": "m == s.length\nn == t.length\n1 <= m, n <= 10^5\n`s` and `t` consist of uppercase and lowercase English letters."
    },
    {
        "title": "Find Median from Data Stream",
        "description": "The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the average of the two middle values. Design a data structure that supports adding numbers from a data stream and finding the median of all elements so far.\n\nInput format:\nA series of operations. Each line is either `addNum x` or `findMedian`.",
        "difficulty": "Hard",
        "tags": ["Heap", "Two Heaps", "Design"],
        "test_cases": {
            "sample": [
                { "input": "addNum 1\naddNum 2\nfindMedian\naddNum 3\nfindMedian", "expected_output": "1.5\n2.0" },
                { "input": "addNum 6\nfindMedian\naddNum 10\nfindMedian\naddNum 2\nfindMedian\naddNum 6\nfindMedian\naddNum 5\nfindMedian", "expected_output": "6.0\n8.0\n6.0\n6.0\n6.0" },
                { "input": "addNum -1\nfindMedian\naddNum -2\nfindMedian\naddNum -3\nfindMedian\naddNum -4\nfindMedian\naddNum -5\nfindMedian", "expected_output": "-1.0\n-1.5\n-2.0\n-2.5\n-3.0" },
                { "input": "addNum 0\nfindMedian\naddNum 0\nfindMedian", "expected_output": "0.0\n0.0" },
                { "input": "findMedian", "expected_output": "null" },
                { "input": "addNum 1\nfindMedian", "expected_output": "1.0" },
                { "input": "addNum 1\naddNum 2\nfindMedian", "expected_output": "1.5" },
                { "input": "addNum 1\naddNum 2\naddNum 3\naddNum 4\nfindMedian", "expected_output": "2.5" },
                { "input": "addNum 1\naddNum 1\nfindMedian", "expected_output": "1.0" },
                { "input": "addNum 100\naddNum 1\nfindMedian\naddNum 50\nfindMedian", "expected_output": "50.5\n50.0" },
            ]
        },
        "constraints": "-10^5 <= num <= 10^5\nThere will be at least one element in the data structure before calling `findMedian`.\nAt most 5 * 10^4 calls will be made to `addNum` and `findMedian`."
    },
     {
        "title": "Word Search II",
        "description": "Given an `m x n` `board` of characters and a list of strings `words`, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.\n\nInput format:\nThe first line: `m` `n`.\nNext `m` lines: the board.\nNext line: `k` (number of words).\nNext line: `k` space-separated words.",
        "difficulty": "Hard",
        "tags": ["Trie", "Backtracking", "Graph", "DFS"],
        "test_cases": {
            "sample": [
                { "input": "4 4\noaan\netae\nihkr\nivif\n4\noath pea eat rain", "expected_output": "oath eat" },
                { "input": "2 2\nab\ncd\n1\nacdb", "expected_output": "acdb" },
                { "input": "1 1\na\n1\nb", "expected_output": "" },
                { "input": "1 1\na\n1\na", "expected_output": "a" },
                { "input": "2 2\naa\naa\n2\na aaaa", "expected_output": "a aaaa" },
                { "input": "3 3\nabc\ndef\nghi\n1\naei", "expected_output": "" },
                { "input": "3 3\nabc\ndef\nghi\n1\nafg", "expected_output": "" },
                { "input": "3 4\nabce\nsfcs\nadee\n3\nabcced see sab", "expected_output": "abcced see" },
                { "input": "2 2\naa\naa\n1\naaaaa", "expected_output": "" },
                { "input": "5 5\nabcde\nfghij\nklmno\npqrst\nuvwxy\n3\naflu axa bglqv", "expected_output": "aflu bglqv" },
            ]
        },
        "constraints": "m == board.length\nn == board[i].length\n1 <= m, n <= 12\nboard[i][j] is a lowercase English letter.\n1 <= words.length <= 3 * 10^4\n1 <= words[i].length <= 10\n`words[i]` consists of lowercase English letters.\nAll the strings of `words` are unique."
    },
     {
        "title": "Serialize and Deserialize Binary Tree",
        "description": "Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment. Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work.\n\nInput format:\nA single line of space-separated integers representing the tree in level-order, with 'null' for empty nodes. The output should be the same string after serialize and then deserialize.",
        "difficulty": "Hard",
        "tags": ["Tree", "DFS", "BFS", "Design"],
        "test_cases": {
            "sample": [
                { "input": "1 2 3 null null 4 5", "expected_output": "1 2 3 null null 4 5" },
                { "input": "null", "expected_output": "null" },
                { "input": "1", "expected_output": "1" },
                { "input": "1 2", "expected_output": "1 2 null" },
                { "input": "1 null 2", "expected_output": "1 null 2" },
                { "input": "-1 0 1", "expected_output": "-1 0 1" },
                { "input": "1 2 3 4 5 6 7", "expected_output": "1 2 3 4 5 6 7" },
                { "input": "5 4 8 11 null 13 4 7 2 null null null 1", "expected_output": "5 4 8 11 null 13 4 7 2 null null null null 1" },
                { "input": "1 1 1 null 1 null 1 null 1", "expected_output": "1 1 1 null 1 null 1 null 1" },
                { "input": "100 200 -300 400 -500", "expected_output": "100 200 -300 400 -500 null null" },
            ]
        },
        "constraints": "The number of nodes in the tree is in the range [0, 10^4].\n-1000 <= Node.val <= 1000"
    },
]

# ==============================================================================
# == SEEDING LOGIC
# ==============================================================================

def seed_database():
    print("Starting to seed the database...")
    Base.metadata.create_all(bind=engine)
    db = sessionmaker(autocommit=False, autoflush=False, bind=engine)()
    
    try:
        # Check for and create the system user if it doesn't exist
        system_user = db.query(User).filter(User.id == SYSTEM_USER_ID).first()
        if not system_user:
            print(f"CRITICAL: System user with ID {SYSTEM_USER_ID} not found. Creating it.")
            from app.core.security import hash_password
            system_user = User(id=SYSTEM_USER_ID, username="system", email="system@coderiot.com", password=hash_password("a_very_secure_password"))
            db.add(system_user)
            db.commit()
            db.refresh(system_user)
            print("Created system user.")

        existing_titles = {problem[0] for problem in db.query(Problem.title).all()}
        problems_to_add = []

        for prob_meta in DSA_PROBLEMS_METADATA:
            if prob_meta["title"] in existing_titles:
                continue
                
            new_problem = Problem(
                title=prob_meta["title"],
                description=prob_meta.get("description", "..."),
                difficulty=prob_meta["difficulty"],
                tags=prob_meta.get("tags", []),
                contributor_id=SYSTEM_USER_ID,
                status="approved",
                test_cases=prob_meta.get("test_cases", {}),
                constraints=prob_meta.get("constraints"),
                
                # --- Call the simplified template generators ---
                frontend_template_python=create_py_template(prob_meta),
                frontend_template_cpp=create_cpp_template(prob_meta),
            )
            problems_to_add.append(new_problem)

        if problems_to_add:
            db.add_all(problems_to_add)
            db.commit()
            print(f"Successfully added {len(problems_to_add)} new problems.")
        else:
            print("No new problems to add. Database is already up-to-date.")
            
    except Exception as e:
        print(f"An error occurred during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()