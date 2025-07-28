import json
from sqlalchemy.orm import sessionmaker
from app.db.database import engine, Base
from app.models.problem import Problem
from app.models.user import User

# --- Configuration ---
# IMPORTANT: Before running, ensure you have a user with this ID in your 'users' table.
SYSTEM_USER_ID = 1

# --- Problem Data ---
DSA_PROBLEMS_50 = [
    # 1. Arrays & Hashing
    {
        "title": "Two Sum", "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.", "difficulty": "Easy", "tags": ["Array", "Hash Table"],
        "test_cases": {
            "sample": [{"input": "2 7 11 15\n9", "expected_output": "0 1"}, {"input": "3 2 4\n6", "expected_output": "1 2"}, {"input": "3 3\n6", "expected_output": "0 1"}],
            "hidden": [{"input": "-1 -4 0 5\n-5", "expected_output": "1 2"}, {"input": "100 200 300 400\n700", "expected_output": "2 3"}, {"input": "0 4 3 0\n0", "expected_output": "0 3"}, {"input": "-3 4 3 90\n0", "expected_output": "0 2"}, {"input": "5 2 11 7\n9", "expected_output": "1 3"}, {"input": "20 70 110 150\n90", "expected_output": "0 1"}, {"input": "1 2 3 4 5\n9", "expected_output": "3 4"}, {"input": "-10 7 19 15\n9", "expected_output": "0 2"}, {"input": "1 1 1 1\n2", "expected_output": "0 1"}, {"input": "4 5 6\n10", "expected_output": "0 2"}, {"input": "1 5 9 13\n14", "expected_output": "1 2"}, {"input": "2 5 5 11\n10", "expected_output": "1 2"}]
        }
    },
    # 2. Arrays & Hashing
    {
        "title": "Contains Duplicate", "description": "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.", "difficulty": "Easy", "tags": ["Array", "Hash Table", "Set"],
        "test_cases": {
            "sample": [{"input": "1 2 3 1", "expected_output": "true"}, {"input": "1 2 3 4", "expected_output": "false"}, {"input": "1 1 1 3 3 4 3 2 4 2", "expected_output": "true"}],
            "hidden": [{"input": "", "expected_output": "false"}, {"input": "1", "expected_output": "false"}, {"input": "1 2 3 4 5 6 7 8 1", "expected_output": "true"}, {"input": "0 0", "expected_output": "true"}, {"input": "-1 -1", "expected_output": "true"}, {"input": "2147483647 -2147483648 0 1 2 3 2147483647", "expected_output": "true"}, {"input": "10 20 30 40", "expected_output": "false"}, {"input": "15 25 35 15", "expected_output": "true"}, {"input": "9 8 7 6 5 4 3 2 1 0", "expected_output": "false"}, {"input": "5 5 5 5 5", "expected_output": "true"}, {"input": "-1 -2 -3 -1", "expected_output": "true"}, {"input": "100 200 300 100", "expected_output": "true"}]
        }
    },
    # 3. Arrays & Hashing
    {
        "title": "Valid Anagram", "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.", "difficulty": "Easy", "tags": ["String", "Hash Table", "Sorting"],
        "test_cases": {
            "sample": [{"input": "anagram\nnagaram", "expected_output": "true"}, {"input": "rat\ncar", "expected_output": "false"}, {"input": "listen\nsilent", "expected_output": "true"}],
            "hidden": [{"input": "a\na", "expected_output": "true"}, {"input": "ab\nba", "expected_output": "true"}, {"input": "ab\na", "expected_output": "false"}, {"input": "aacc\nccac", "expected_output": "false"}, {"input": "cinema\niceman", "expected_output": "true"}, {"input": "hello\noleh", "expected_output": "false"}, {"input": "qwerty\nqwertz", "expected_output": "false"}, {"input": "a\nb", "expected_output": "false"}, {"input": "fried\nfired", "expected_output": "true"}, {"input": "apple\npale", "expected_output": "false"}, {"input": "eleven plus two\ntwelve plus one", "expected_output": "true"}, {"input": "a gentleman\nelegant man", "expected_output": "true"}]
        }
    },
    # 4. Arrays & Hashing
    {
        "title": "Group Anagrams", "description": "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.", "difficulty": "Medium", "tags": ["Array", "String", "Hash Table"],
        "test_cases": {
            "sample": [{"input": "eat tea tan ate nat bat", "expected_output": "ate,eat,tea\nbat\nnat,tan"}, {"input": "a", "expected_output": "a"}, {"input": "", "expected_output": ""}],
            "hidden": [{"input": "cab den abed", "expected_output": "abed\ncab\nden"}, {"input": "listen silent hello", "expected_output": "hello\nlisten,silent"}, {"input": "abc bca cab", "expected_output": "abc,bca,cab"}, {"input": "aaa bbb ccc", "expected_output": "aaa\nbbb\nccc"}, {"input": "ant tan nat", "expected_output": "ant,nat,tan"}, {"input": "flow wolf", "expected_output": "flow,wolf"}, {"input": "aaa aaa aaa", "expected_output": "aaa,aaa,aaa"}, {"input": "x", "expected_output": "x"}, {"input": "stop pots tops", "expected_output": "pots,stop,tops"}, {"input": "race care acre", "expected_output": "acre,care,race"}, {"input": "a b c d e", "expected_output": "a\nb\nc\nd\ne"}, {"input": " ", "expected_output": " "}]
        }
    },
    # 5. Arrays & Hashing
    {
        "title": "Top K Frequent Elements", "description": "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements.", "difficulty": "Medium", "tags": ["Array", "Hash Table", "Heap"],
        "test_cases": {
            "sample": [{"input": "1 1 1 2 2 3\n2", "expected_output": "1 2"}, {"input": "1\n1", "expected_output": "1"}, {"input": "4 1 -1 2 -1 2 3\n2", "expected_output": "-1 2"}],
            "hidden": [{"input": "1 2 3 4 5\n5", "expected_output": "1 2 3 4 5"}, {"input": "5 5 5 5 5\n1", "expected_output": "5"}, {"input": "1 1 2 2 3 3\n3", "expected_output": "1 2 3"}, {"input": "-1 -1 -1\n1", "expected_output": "-1"}, {"input": "1 2\n2", "expected_output": "1 2"}, {"input": "3 0 1 0\n1", "expected_output": "0"}, {"input": "2 3 4 1 4 0 4 -1 -1 4\n2", "expected_output": "4 -1"}, {"input": "1 1 1 1 1 1\n1", "expected_output": "1"}, {"input": "1 2 2 3 3 3\n3", "expected_output": "3 2 1"}, {"input": "1 2\n1", "expected_output": "1"}, {"input": "6 6 6 6 6 6\n1", "expected_output": "6"}, {"input": "1 1 2 2 2 3\n2", "expected_output": "2 1"}]
        }
    },
    # 6. Arrays & Hashing
    {
        "title": "Product of Array Except Self", "description": "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.", "difficulty": "Medium", "tags": ["Array", "Prefix Sum"],
        "test_cases": {
            "sample": [{"input": "1 2 3 4", "expected_output": "24 12 8 6"}, {"input": "-1 1 0 -3 3", "expected_output": "0 0 9 0 0"}],
            "hidden": [{"input": "1 2", "expected_output": "2 1"}, {"input": "0 0", "expected_output": "0 0"}, {"input": "1 0", "expected_output": "0 1"}, {"input": "0 4", "expected_output": "4 0"}, {"input": "1 2 3", "expected_output": "6 3 2"}, {"input": "1 1 1", "expected_output": "1 1 1"}, {"input": "-1 -1 -1", "expected_output": "1 1 1"}, {"input": "1 -1", "expected_output": "-1 1"}, {"input": "2 3 0 0", "expected_output": "0 0 0 0"}, {"input": "1 2 3 4 5", "expected_output": "120 60 40 30 24"}, {"input": "10 20", "expected_output": "20 10"}, {"input": "5 5 5 5", "expected_output": "125 125 125 125"}]
        }
    },
    # 7. Arrays & Hashing
    {
        "title": "Longest Consecutive Sequence", "description": "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.", "difficulty": "Medium", "tags": ["Array", "Hash Table", "Set"],
        "test_cases": {
            "sample": [{"input": "100 4 200 1 3 2", "expected_output": "4"}, {"input": "0 3 7 2 5 8 4 6 0 1", "expected_output": "9"}],
            "hidden": [{"input": "", "expected_output": "0"}, {"input": "1", "expected_output": "1"}, {"input": "1 1 1", "expected_output": "1"}, {"input": "1 2 3", "expected_output": "3"}, {"input": "3 2 1", "expected_output": "3"}, {"input": "1 3 5 2 4", "expected_output": "5"}, {"input": "-1 0 1", "expected_output": "3"}, {"input": "-1 -2 -3", "expected_output": "3"}, {"input": "10 20 30", "expected_output": "1"}, {"input": "1 2 0 1", "expected_output": "3"}, {"input": "100 2 101 3 102 4", "expected_output": "3"}, {"input": "9 1 4 7 3 -1 0 5 8 -1 6", "expected_output": "11"}]
        }
    },
    # 8. Two Pointers
    {
        "title": "Valid Palindrome", "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.", "difficulty": "Easy", "tags": ["String", "Two Pointers"],
        "test_cases": {
            "sample": [{"input": "A man, a plan, a canal: Panama", "expected_output": "true"}, {"input": "race a car", "expected_output": "false"}, {"input": " ", "expected_output": "true"}],
            "hidden": [{"input": "0P", "expected_output": "false"}, {"input": "Was it a car or a cat I saw?", "expected_output": "true"}, {"input": "No lemon, no melon.", "expected_output": "true"}, {"input": "hello world", "expected_output": "false"}, {"input": "a.", "expected_output": "true"}, {"input": ".,", "expected_output": "true"}, {"input": "Live on time, emit no evil.", "expected_output": "true"}, {"input": "1a2", "expected_output": "false"}, {"input": "Able was I ere I saw Elba", "expected_output": "true"}, {"input": "palindrome", "expected_output": "false"}, {"input": "A!b@c#c$b%a^", "expected_output": "true"}, {"input": "12321", "expected_output": "true"}]
        }
    },
    # 9. Two Pointers
    {
        "title": "3Sum", "description": "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.", "difficulty": "Medium", "tags": ["Array", "Two Pointers", "Sorting"],
        "test_cases": {
            "sample": [{"input": "-1 0 1 2 -1 -4", "expected_output": "-1,-1,2\n-1,0,1"}, {"input": "0 1 1", "expected_output": ""}, {"input": "0 0 0", "expected_output": "0,0,0"}],
            "hidden": [{"input": "", "expected_output": ""}, {"input": "0", "expected_output": ""}, {"input": "-1 0 1", "expected_output": "-1,0,1"}, {"input": "0 0 0 0", "expected_output": "0,0,0"}, {"input": "-2 0 1 1 2", "expected_output": "-2,0,2\n-2,1,1"}, {"input": "1 2 3", "expected_output": ""}, {"input": "-1 -2 -3", "expected_output": ""}, {"input": "-4 -1 -1 0 1 2", "expected_output": "-1,-1,2\n-1,0,1"}, {"input": "3 0 -2 -1 1 2", "expected_output": "-2,-1,3\n-2,0,2\n-1,0,1"}, {"input": "1 -1 -1 0", "expected_output": "-1,0,1"}, {"input": "1 2 -2 -1", "expected_output": ""}, {"input": "-5 1 2 3 4", "expected_output": "-5,1,4\n-5,2,3"}]
        }
    },
    # 10. Two Pointers
    {
        "title": "Container With Most Water", "description": "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`. Find two lines that together with the x-axis form a container, such that the container contains the most water.", "difficulty": "Medium", "tags": ["Array", "Two Pointers", "Greedy"],
        "test_cases": {
            "sample": [{"input": "1 8 6 2 5 4 8 3 7", "expected_output": "49"}, {"input": "1 1", "expected_output": "1"}],
            "hidden": [{"input": "1 2", "expected_output": "1"}, {"input": "4 3 2 1 4", "expected_output": "16"}, {"input": "1 2 1", "expected_output": "2"}, {"input": "2 3 4 5 18 17 6", "expected_output": "17"}, {"input": "1 1000 1000 6 2 5 4 8 3 7", "expected_output": "1000"}, {"input": "1 2 3 4 5", "expected_output": "6"}, {"input": "5 4 3 2 1", "expected_output": "6"}, {"input": "10 1 1 10", "expected_output": "30"}, {"input": "2 2 2 2 2", "expected_output": "8"}, {"input": "1 2 4 3", "expected_output": "4"}, {"input": "3 9 3 4 7 2 12 6", "expected_output": "45"}, {"input": "7 1 2 3 9", "expected_output": "28"}]
        }
    },
    # 11. Sliding Window
    {
        "title": "Best Time to Buy and Sell Stock", "description": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.", "difficulty": "Easy", "tags": ["Array", "Sliding Window"],
        "test_cases": {
            "sample": [{"input": "7 1 5 3 6 4", "expected_output": "5"}, {"input": "7 6 4 3 1", "expected_output": "0"}, {"input": "1 2 3 4 5", "expected_output": "4"}],
            "hidden": [{"input": "2 1 2 0 1 2", "expected_output": "2"}, {"input": "2 4 1", "expected_output": "2"}, {"input": "3 2 6 5 0 3", "expected_output": "4"}, {"input": "1", "expected_output": "0"}, {"input": "5 4 3 2 1 2", "expected_output": "1"}, {"input": "1 6 1 6", "expected_output": "5"}, {"input": "10 2 8 1 9", "expected_output": "8"}, {"input": "100 180 260 310 40 535 695", "expected_output": "655"}, {"input": "5 1", "expected_output": "0"}, {"input": "2 5 1 3", "expected_output": "3"}, {"input": "1 2", "expected_output": "1"}, {"input": "2 1", "expected_output": "0"}]
        }
    },
    # 12. Sliding Window
    {
        "title": "Longest Substring Without Repeating Characters", "description": "Given a string `s`, find the length of the longest substring without repeating characters.", "difficulty": "Medium", "tags": ["String", "Sliding Window", "Hash Table"],
        "test_cases": {
            "sample": [{"input": "abcabcbb", "expected_output": "3"}, {"input": "bbbbb", "expected_output": "1"}, {"input": "pwwkew", "expected_output": "3"}],
            "hidden": [{"input": "", "expected_output": "0"}, {"input": " ", "expected_output": "1"}, {"input": "a", "expected_output": "1"}, {"input": "au", "expected_output": "2"}, {"input": "dvdf", "expected_output": "3"}, {"input": "anviaj", "expected_output": "5"}, {"input": "tmmzuxt", "expected_output": "5"}, {"input": "abacaba", "expected_output": "3"}, {"input": "abcdefg", "expected_output": "7"}, {"input": "abccbadd", "expected_output": "4"}, {"input": "aab", "expected_output": "2"}, {"input": "abba", "expected_output": "2"}]
        }
    },
    # 13. Stack
    {
        "title": "Valid Parentheses", "description": "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.", "difficulty": "Easy", "tags": ["Stack", "String"],
        "test_cases": {
            "sample": [{"input": "()", "expected_output": "true"}, {"input": "()[]{}", "expected_output": "true"}, {"input": "(]", "expected_output": "false"}],
            "hidden": [{"input": "([)]", "expected_output": "false"}, {"input": "{[]}", "expected_output": "true"}, {"input": "]", "expected_output": "false"}, {"input": "((", "expected_output": "false"}, {"input": "", "expected_output": "true"}, {"input": "({[]})", "expected_output": "true"}, {"input": "{[()]}", "expected_output": "true"}, {"input": "(({[]}))", "expected_output": "true"}, {"input": "[", "expected_output": "false"}, {"input": "([", "expected_output": "false"}, {"input": "())", "expected_output": "false"}, {"input": "((()))", "expected_output": "true"}]
        }
    },
    # 14. Stack
    {
        "title": "Min Stack", "description": "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time. Implement the MinStack class.", "difficulty": "Medium", "tags": ["Stack", "Design"],
        "test_cases": {
            "sample": [{"input": "push -2\npush 0\npush -3\ngetMin\npop\ntop\ngetMin", "expected_output": "-3\n0\n-2"}],
            "hidden": [{"input": "push 0\npush 1\npush 0\ngetMin\npop\ngetMin", "expected_output": "0\n0"}, {"input": "push 2147483647\npush -2147483648\ngetMin\ntop\npop\ngetMin", "expected_output": "-2147483648\n-2147483648\n2147483647"}, {"input": "push 5\npush 3\npush 8\ngetMin\ntop\npop\ngetMin", "expected_output": "3\n8\n3"}, {"input": "push 1\npush 2\ntop\ngetMin\npop\ngetMin\ntop", "expected_output": "2\n1\n1\n1"}, {"input": "push 10\ngetMin", "expected_output": "10"}, {"input": "push -1\npush -1\ngetMin", "expected_output": "-1"}, {"input": "push -5\npush 0\npush -2\ngetMin\npop\ngetMin\npop\ngetMin", "expected_output": "-5\n-5\n-5"}, {"input": "push 100\npush 50\npush 120\ngetMin\npop\ngetMin", "expected_output": "50\n50"}, {"input": "push 0\ngetMin", "expected_output": "0"}]
        }
    },
    # 15. Binary Search
    {
        "title": "Binary Search", "description": "Given a sorted array of integers `nums` and a `target`, write a function to search for `target` in `nums`. If `target` exists, then return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.", "difficulty": "Easy", "tags": ["Array", "Binary Search"],
        "test_cases": {
            "sample": [{"input": "-1 0 3 5 9 12\n9", "expected_output": "4"}, {"input": "-1 0 3 5 9 12\n2", "expected_output": "-1"}],
            "hidden": [{"input": "5\n5", "expected_output": "0"}, {"input": "2 5\n5", "expected_output": "1"}, {"input": "\n5", "expected_output": "-1"}, {"input": "2\n5", "expected_output": "-1"}, {"input": "1 2 3 4 5 6 7 8 9 10\n8", "expected_output": "7"}, {"input": "-5 -3 -1 0 2 4\n-3", "expected_output": "1"}, {"input": "10 20 30\n5", "expected_output": "-1"}, {"input": "10 20 30\n35", "expected_output": "-1"}, {"input": "0 1 2 3 4 5\n0", "expected_output": "0"}, {"input": "0 1 2 3 4 5\n5", "expected_output": "5"}, {"input": "5 7 7 8 8 10\n8", "expected_output": "3"}, {"input": "5 7 7 8 8 10\n6", "expected_output": "-1"}]
        }
    },
    # 16. Binary Search
    {
        "title": "Search a 2D Matrix", "description": "You are given an `m x n` integer matrix `matrix` where each row is sorted and the first integer of each row is greater than the last integer of the previous row. Write a function to search for a `target` value.", "difficulty": "Medium", "tags": ["Array", "Binary Search", "Matrix"],
        "test_cases": {
            "sample": [{"input": "1 3 5 7\n10 11 16 20\n23 30 34 60\n3", "expected_output": "true"}, {"input": "1 3 5 7\n10 11 16 20\n23 30 34 60\n13", "expected_output": "false"}],
            "hidden": [{"input": "1\n1", "expected_output": "true"}, {"input": "1\n0", "expected_output": "false"}, {"input": "1 3\n3", "expected_output": "true"}, {"input": "1 3\n4", "expected_output": "false"}, {"input": "1 3 5\n1", "expected_output": "true"}, {"input": "1 3 5\n5", "expected_output": "true"}, {"input": "1 3 5\n0", "expected_output": "false"}, {"input": "1 3 5\n6", "expected_output": "false"}, {"input": "10 20\n30 40\n15", "expected_output": "false"}, {"input": "10 20\n30 40\n30", "expected_output": "true"}, {"input": "10 20\n30 40\n45", "expected_output": "false"}]
        }
    },
    # 17. Linked List
    {
        "title": "Reverse Linked List", "description": "Given the `head` of a singly linked list, reverse the list, and return the reversed list.", "difficulty": "Easy", "tags": ["Linked List", "Recursion"],
        "test_cases": {
            "sample": [{"input": "1 2 3 4 5", "expected_output": "5 4 3 2 1"}, {"input": "1 2", "expected_output": "2 1"}, {"input": "", "expected_output": ""}],
            "hidden": [{"input": "1", "expected_output": "1"}, {"input": "10 20", "expected_output": "20 10"}, {"input": "-1 0 1", "expected_output": "1 0 -1"}, {"input": "5 4 3 2 1", "expected_output": "1 2 3 4 5"}, {"input": "100", "expected_output": "100"}, {"input": "1 1 2 2", "expected_output": "2 2 1 1"}, {"input": "7", "expected_output": "7"}, {"input": "0 0 0", "expected_output": "0 0 0"}, {"input": "8 6 7 5 3 0 9", "expected_output": "9 0 3 5 7 6 8"}]
        }
    },
    # 18. Linked List
    {
        "title": "Merge Two Sorted Lists", "description": "You are given the heads of two sorted linked lists. Merge the two lists into one sorted list.", "difficulty": "Easy", "tags": ["Linked List", "Recursion"],
        "test_cases": {
            "sample": [{"input": "1 2 4\n1 3 4", "expected_output": "1 1 2 3 4 4"}, {"input": "\n", "expected_output": ""}, {"input": "\n0", "expected_output": "0"}],
            "hidden": [{"input": "1\n", "expected_output": "1"}, {"input": "\n1", "expected_output": "1"}, {"input": "1 3 5\n2 4 6", "expected_output": "1 2 3 4 5 6"}, {"input": "2 4 6\n1 3 5", "expected_output": "1 2 3 4 5 6"}, {"input": "1\n2", "expected_output": "1 2"}, {"input": "2\n1", "expected_output": "1 2"}, {"input": "5\n1 2 3 4", "expected_output": "1 2 3 4 5"}, {"input": "1 2 3 4\n5", "expected_output": "1 2 3 4 5"}, {"input": "-1 5 10\n-2 3 8", "expected_output": "-2 -1 3 5 8 10"}]
        }
    },
    # 19. Linked List
    {
        "title": "Reorder List", "description": "Given the head of a singly linked list L0→L1→…→Ln-1→Ln, reorder it to: L0→Ln→L1→Ln-1→…", "difficulty": "Medium", "tags": ["Linked List", "Two Pointers", "Stack"],
        "test_cases": {
            "sample": [{"input": "1 2 3 4", "expected_output": "1 4 2 3"}, {"input": "1 2 3 4 5", "expected_output": "1 5 2 4 3"}],
            "hidden": [{"input": "1", "expected_output": "1"}, {"input": "1 2", "expected_output": "1 2"}, {"input": "1 2 3", "expected_output": "1 3 2"}, {"input": "10 20 30 40", "expected_output": "10 40 20 30"}, {"input": "1 2 3 4 5 6", "expected_output": "1 6 2 5 3 4"}, {"input": "1 2 3 4 5 6 7", "expected_output": "1 7 2 6 3 5 4"}, {"input": "0", "expected_output": "0"}, {"input": "-1 -2 -3", "expected_output": "-1 -3 -2"}, {"input": "10 9 8", "expected_output": "10 8 9"}, {"input": "5 5 5 5", "expected_output": "5 5 5 5"}, {"input": "1 8 2 7", "expected_output": "1 7 8 2"}]
        }
    },
    # 20. Linked List
    {
        "title": "Remove Nth Node From End of List", "description": "Given the `head` of a linked list, remove the `n-th` node from the end of the list and return its head.", "difficulty": "Medium", "tags": ["Linked List", "Two Pointers"],
        "test_cases": {
            "sample": [{"input": "1 2 3 4 5\n2", "expected_output": "1 2 3 5"}, {"input": "1\n1", "expected_output": ""}, {"input": "1 2\n1", "expected_output": "1"}],
            "hidden": [{"input": "1 2\n2", "expected_output": "2"}, {"input": "1 2 3 4 5\n5", "expected_output": "2 3 4 5"}, {"input": "1 2 3 4 5\n1", "expected_output": "1 2 3 4"}, {"input": "10 20 30\n3", "expected_output": "20 30"}, {"input": "10 20 30\n1", "expected_output": "10 20"}, {"input": "7\n1", "expected_output": ""}, {"input": "1 2 3\n2", "expected_output": "1 3"}, {"input": "1 2 3\n3", "expected_output": "2 3"}, {"input": "5 6 7 8\n4", "expected_output": "6 7 8"}, {"input": "5 6 7 8\n1", "expected_output": "5 6 7"}]
        }
    },
    # 21. Linked List
    {
        "title": "Linked List Cycle", "description": "Given `head`, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer.", "difficulty": "Easy", "tags": ["Linked List", "Two Pointers", "Hash Table"],
        "test_cases": {
            "sample": [{"input": "3 2 0 -4\n1", "expected_output": "true"}, {"input": "1 2\n0", "expected_output": "true"}, {"input": "1\n-1", "expected_output": "false"}],
            "hidden": [{"input": "", "expected_output": "false"}, {"input": "1\n0", "expected_output": "true"}, {"input": "1 2 3 4\n-1", "expected_output": "false"}, {"input": "1 2 3 4\n3", "expected_output": "true"}, {"input": "1 2 3 4\n0", "expected_output": "true"}, {"input": "0 1 2 3 4 5\n2", "expected_output": "true"}, {"input": "5\n-1", "expected_output": "false"}, {"input": "10 20 30\n0", "expected_output": "true"}, {"input": "10 20 30\n2", "expected_output": "true"}, {"input": "10 20 30\n-1", "expected_output": "false"}]
        }
    },
    # 22. Trees
    {
        "title": "Invert Binary Tree", "description": "Given the `root` of a binary tree, invert the tree, and return its root.", "difficulty": "Easy", "tags": ["Tree", "DFS", "BFS", "Recursion"],
        "test_cases": {
            "sample": [{"input": "4 2 7 1 3 6 9", "expected_output": "4 7 2 9 6 3 1"}, {"input": "2 1 3", "expected_output": "2 3 1"}, {"input": "", "expected_output": ""}],
            "hidden": [{"input": "1", "expected_output": "1"}, {"input": "1 2", "expected_output": "1 null 2"}, {"input": "1 null 2", "expected_output": "1 2"}, {"input": "1 2 3 4 5 6 7", "expected_output": "1 3 2 7 6 5 4"}, {"input": "10 5 15 null null 12 20", "expected_output": "10 15 5 20 12"}, {"input": "0", "expected_output": "0"}, {"input": "100 50 150", "expected_output": "100 150 50"}, {"input": "5 3 7 1 4 6 8", "expected_output": "5 7 3 8 6 4 1"}, {"input": "1 null 2 null 3", "expected_output": "1 2 null 3"}, {"input": "1 2 null 3", "expected_output": "1 null 2 null 3"}]
        }
    },
    # 23. Trees
    {
        "title": "Maximum Depth of Binary Tree", "description": "Given the `root` of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.", "difficulty": "Easy", "tags": ["Tree", "DFS", "BFS", "Recursion"],
        "test_cases": {
            "sample": [{"input": "3 9 20 null null 15 7", "expected_output": "3"}, {"input": "1 null 2", "expected_output": "2"}, {"input": "", "expected_output": "0"}],
            "hidden": [{"input": "1", "expected_output": "1"}, {"input": "1 2", "expected_output": "2"}, {"input": "1 2 3 4 5", "expected_output": "3"}, {"input": "0", "expected_output": "1"}, {"input": "1 2 null 3 null 4 null 5", "expected_output": "5"}, {"input": "2 1 3", "expected_output": "2"}, {"input": "1 2 2 3 3 null null 4 4", "expected_output": "4"}, {"input": "10 5 15", "expected_output": "2"}, {"input": "10 5 null 3 7", "expected_output": "3"}, {"input": "10 null 15 null 20", "expected_output": "3"}, {"input": "50", "expected_output": "1"}]
        }
    },
    # 24. Trees
    {
        "title": "Same Tree", "description": "Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not. Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.", "difficulty": "Easy", "tags": ["Tree", "DFS", "BFS", "Recursion"],
        "test_cases": {
            "sample": [{"input": "1 2 3\n1 2 3", "expected_output": "true"}, {"input": "1 2\n1 null 2", "expected_output": "false"}, {"input": "1 2 1\n1 1 2", "expected_output": "false"}],
            "hidden": [{"input": "\n", "expected_output": "true"}, {"input": "1\n1", "expected_output": "true"}, {"input": "1\n2", "expected_output": "false"}, {"input": "1 2\n1 2", "expected_output": "true"}, {"input": "1 2\n2 1", "expected_output": "false"}, {"input": "1 null 2\n1 null 2", "expected_output": "true"}, {"input": "1 2 null\n1 null 2", "expected_output": "false"}, {"input": "10 5 15\n10 5 15", "expected_output": "true"}, {"input": "10 5 15\n10 5 null 15", "expected_output": "false"}, {"input": "10 5 15\n10 5 16", "expected_output": "false"}, {"input": "\n1", "expected_output": "false"}]
        }
    },
    # 25. Trees
    {
        "title": "Subtree of Another Tree", "description": "Given the roots of two binary trees `root` and `subRoot`, return `true` if there is a subtree of `root` with the same structure and node values of `subRoot` and `false` otherwise. A subtree of a binary tree `tree` is a tree that consists of a node in `tree` and all of this node's descendants.", "difficulty": "Easy", "tags": ["Tree", "DFS", "Recursion"],
        "test_cases": {
            "sample": [{"input": "3 4 5 1 2\n4 1 2", "expected_output": "true"}, {"input": "3 4 5 1 2 null null null null 0\n4 1 2", "expected_output": "false"}, {"input": "1\n1", "expected_output": "true"}],
            "hidden": [{"input": "1\n0", "expected_output": "false"}, {"input": "1 1\n1", "expected_output": "true"}, {"input": "1 null 1 null 1 null 1 null 1\n1 null 1 null 1 null 1", "expected_output": "true"}, {"input": "4 1 2\n1", "expected_output": "true"}, {"input": "3 4 5 1\n4 1", "expected_output": "true"}, {"input": "1 2 3\n2 3", "expected_output": "false"}, {"input": "3 4 5 1 2\n4 1", "expected_output": "false"}, {"input": "3 4 5 1 null 2\n3 1 2", "expected_output": "false"}, {"input": "4 -7 -3 null null -9 -3 9 -7 -4 null 6 null -6 -6 null null 0 -6 5 null null null null -1 -4\n-9 -3 9 -7 -4 null 6 null -6 -6", "expected_output": "false"}, {"input": "1 2 3\n1 2 3", "expected_output": "true"}]
        }
    },
    # 26. Trees
    {
        "title": "Lowest Common Ancestor of a BST", "description": "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.", "difficulty": "Easy", "tags": ["Tree", "BST", "DFS"],
        "test_cases": {
            "sample": [{"input": "6 2 8 0 4 7 9 null null 3 5\n2\n8", "expected_output": "6"}, {"input": "6 2 8 0 4 7 9 null null 3 5\n2\n4", "expected_output": "2"}, {"input": "2 1\n2\n1", "expected_output": "2"}],
            "hidden": [{"input": "6 2 8 0 4 7 9 null null 3 5\n3\n5", "expected_output": "4"}, {"input": "6 2 8 0 4 7 9 null null 3 5\n7\n9", "expected_output": "8"}, {"input": "6 2 8 0 4 7 9 null null 3 5\n0\n9", "expected_output": "6"}, {"input": "10 5 15 3 7 12 20\n3\n7", "expected_output": "5"}, {"input": "10 5 15 3 7 12 20\n12\n20", "expected_output": "15"}, {"input": "10 5 15 3 7 12 20\n5\n15", "expected_output": "10"}, {"input": "10 5 15 3 7 12 20\n3\n20", "expected_output": "10"}, {"input": "10 5 15 3 7 12 20\n7\n12", "expected_output": "10"}, {"input": "10 5 15\n5\n15", "expected_output": "10"}]
        }
    },
    # 27. Trees
    {
        "title": "Binary Tree Level Order Traversal", "description": "Given the `root` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).", "difficulty": "Medium", "tags": ["Tree", "BFS"],
        "test_cases": {
            "sample": [{"input": "3 9 20 null null 15 7", "expected_output": "3\n9,20\n15,7"}, {"input": "1", "expected_output": "1"}, {"input": "", "expected_output": ""}],
            "hidden": [{"input": "1 2 3 4 5", "expected_output": "1\n2,3\n4,5"}, {"input": "1 null 2 null 3", "expected_output": "1\n2\n3"}, {"input": "10 5 15 3 7 12 20", "expected_output": "10\n5,15\n3,7,12,20"}, {"input": "0", "expected_output": "0"}, {"input": "1 2", "expected_output": "1\n2"}, {"input": "1 null 2", "expected_output": "1\n2"}, {"input": "50 25 75", "expected_output": "50\n25,75"}, {"input": "10 20 30 null 40 null 50", "expected_output": "10\n20,30\n40,50"}, {"input": "1 2 3 null 4 null 5", "expected_output": "1\n2,3\n4,5"}]
        }
    },
    # 28. Trees
    {
        "title": "Validate Binary Search Tree", "description": "Given the `root` of a binary tree, determine if it is a valid binary search tree (BST).", "difficulty": "Medium", "tags": ["Tree", "BST", "DFS", "Recursion"],
        "test_cases": {
            "sample": [{"input": "2 1 3", "expected_output": "true"}, {"input": "5 1 4 null null 3 6", "expected_output": "false"}, {"input": "1", "expected_output": "true"}],
            "hidden": [{"input": "5 4 6 null null 3 7", "expected_output": "false"}, {"input": "1 1", "expected_output": "false"}, {"input": "2 2 2", "expected_output": "false"}, {"input": "0", "expected_output": "true"}, {"input": "10 5 15 null null 6 20", "expected_output": "false"}, {"input": "3 2 5 1 4", "expected_output": "false"}, {"input": "2147483647", "expected_output": "true"}, {"input": "-2147483648", "expected_output": "true"}, {"input": "32 26 47 19 null null 56 null 27", "expected_output": "false"}, {"input": "10 5 15 3 7 12 20", "expected_output": "true"}]
        }
    },
    # 29. Trees
    {
        "title": "Kth Smallest Element in a BST", "description": "Given the `root` of a BST and an integer `k`, return the `k-th` smallest value (1-indexed) of all the values of the nodes in the tree.", "difficulty": "Medium", "tags": ["Tree", "BST", "DFS"],
        "test_cases": {
            "sample": [{"input": "3 1 4 null 2\n1", "expected_output": "1"}, {"input": "5 3 6 2 4 1\n3", "expected_output": "3"}],
            "hidden": [{"input": "1\n1", "expected_output": "1"}, {"input": "2 1\n1", "expected_output": "1"}, {"input": "2 1\n2", "expected_output": "2"}, {"input": "10 5 15 3 7 12 20\n1", "expected_output": "3"}, {"input": "10 5 15 3 7 12 20\n2", "expected_output": "5"}, {"input": "10 5 15 3 7 12 20\n4", "expected_output": "10"}, {"input": "10 5 15 3 7 12 20\n7", "expected_output": "20"}, {"input": "50 30 70 20 40 60 80\n5", "expected_output": "60"}, {"input": "5 3 null 2 4 1\n6", "expected_output": "5"}, {"input": "100\n1", "expected_output": "100"}]
        }
    },
    # 30. Trees
    {
        "title": "Binary Tree Maximum Path Sum", "description": "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root. Given the `root` of a non-empty binary tree, find the maximum path sum.", "difficulty": "Hard", "tags": ["Tree", "DFS", "Recursion", "DP"],
        "test_cases": {
            "sample": [{"input": "1 2 3", "expected_output": "6"}, {"input": "-10 9 20 null null 15 7", "expected_output": "42"}, {"input": "-3", "expected_output": "-3"}],
            "hidden": [{"input": "1", "expected_output": "1"}, {"input": "2 -1", "expected_output": "2"}, {"input": "1 -2 3", "expected_output": "4"}, {"input": "1 -2 -3 1 3 -2 null -1", "expected_output": "3"}, {"input": "5 4 8 11 null 13 4 7 2 null null null 1", "expected_output": "48"}, {"input": "-1", "expected_output": "-1"}, {"input": "0", "expected_output": "0"}, {"input": "1 2", "expected_output": "3"}, {"input": "1 null 2", "expected_output": "3"}, {"input": "-2 -1", "expected_output": "-1"}, {"input": "2 -1 -2", "expected_output": "2"}]
        }
    },
    # 31. Heap / Priority Queue
    {
        "title": "Kth Largest Element in a Stream", "description": "Design a class to find the `k-th` largest element in a stream. Note that it is the k-th largest element in the sorted order, not the k-th distinct element.", "difficulty": "Easy", "tags": ["Heap", "Design"],
        "test_cases": {
            "sample": [{"input": "3\n4 5 8 2\nadd 3\nadd 5\nadd 10\nadd 9\nadd 4", "expected_output": "4\n5\n5\n8\n8"}],
            "hidden": [{"input": "1\n\nadd 1\nadd 2\nadd 3", "expected_output": "1\n2\n3"}, {"input": "2\n0\nadd -1\nadd 1\nadd -2\nadd -4\nadd 3", "expected_output": "0\n0\n-1\n-1\n-1"}, {"input": "3\n5 -1\nadd 2\nadd 1\nadd -1\nadd 3\nadd 4", "expected_output": "-1\n1\n1\n2\n3"}]
        }
    },
    # 32. Heap / Priority Queue
    {
        "title": "Last Stone Weight", "description": "You are given an array of integers `stones` where `stones[i]` is the weight of the `i-th` stone. We are playing a game with the stones. On each turn, we choose the two heaviest stones and smash them together. Return the weight of the last remaining stone, or 0 if none are left.", "difficulty": "Easy", "tags": ["Heap", "Simulation"],
        "test_cases": {
            "sample": [{"input": "2 7 4 1 8 1", "expected_output": "1"}, {"input": "1", "expected_output": "1"}, {"input": "1 1", "expected_output": "0"}],
            "hidden": [{"input": "", "expected_output": "0"}, {"input": "10", "expected_output": "10"}, {"input": "10 20", "expected_output": "10"}, {"input": "10 10", "expected_output": "0"}, {"input": "3 7 2", "expected_output": "2"}, {"input": "1 2 3 4 5", "expected_output": "1"}, {"input": "10 4 2 10", "expected_output": "2"}, {"input": "7 3 2", "expected_output": "2"}, {"input": "8 10 4", "expected_output": "2"}, {"input": "1 1 1 1 1", "expected_output": "1"}, {"input": "9 3 2 10", "expected_output": "0"}]
        }
    },
    # 33. Heap / Priority Queue
    {
        "title": "Find Median from Data Stream", "description": "Implement the MedianFinder class which supports two methods: `addNum(int num)` which adds an integer from the data stream to the data structure, and `findMedian()` which returns the median of all elements so far.", "difficulty": "Hard", "tags": ["Heap", "Two Heaps", "Design"],
        "test_cases": {
            "sample": [{"input": "addNum 1\naddNum 2\nfindMedian\naddNum 3\nfindMedian", "expected_output": "1.5\n2.0"}],
            "hidden": [{"input": "findMedian", "expected_output": "0.0"}, {"input": "addNum 6\nfindMedian\naddNum 10\nfindMedian\naddNum 2\nfindMedian\naddNum 6\nfindMedian\naddNum 5\nfindMedian", "expected_output": "6.0\n8.0\n6.0\n6.0\n6.0"}, {"input": "addNum -1\nfindMedian\naddNum -2\nfindMedian\naddNum -3\nfindMedian", "expected_output": "-1.0\n-1.5\n-2.0"}, {"input": "addNum 10\nfindMedian\naddNum 10\nfindMedian", "expected_output": "10.0\n10.0"}, {"input": "addNum 0\naddNum 0\nfindMedian", "expected_output": "0.0"}]
        }
    },
    # 34. Backtracking
    {
        "title": "Subsets", "description": "Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.", "difficulty": "Medium", "tags": ["Backtracking", "Bit Manipulation"],
        "test_cases": {
            "sample": [{"input": "1 2 3", "expected_output": "\n1\n1,2\n1,2,3\n1,3\n2\n2,3\n3"}, {"input": "0", "expected_output": "\n0"}],
            "hidden": [{"input": "", "expected_output": ""}, {"input": "1", "expected_output": "\n1"}, {"input": "1 2", "expected_output": "\n1\n1,2\n2"}, {"input": "-1 0 1", "expected_output": "\n-1\n-1,0\n-1,0,1\n-1,1\n0\n0,1\n1"}, {"input": "10 20", "expected_output": "\n10\n10,20\n20"}, {"input": "5", "expected_output": "\n5"}]
        }
    },
    # 35. Backtracking
    {
        "title": "Combination Sum", "description": "Given an array of distinct integers `candidates` and a `target`, return a list of all unique combinations where numbers sum to `target`. The same number may be chosen from candidates an unlimited number of times.", "difficulty": "Medium", "tags": ["Array", "Backtracking"],
        "test_cases": {
            "sample": [{"input": "2 3 6 7\n7", "expected_output": "2,2,3\n7"}, {"input": "2 3 5\n8", "expected_output": "2,2,2,2\n2,3,3\n3,5"}, {"input": "2\n1", "expected_output": ""}],
            "hidden": [{"input": "1\n1", "expected_output": "1"}, {"input": "1\n2", "expected_output": "1,1"}, {"input": "1 2\n3", "expected_output": "1,1,1\n1,2"}, {"input": "7 3 2\n18", "expected_output": "2,2,2,2,2,2,2,2,2\n2,2,2,2,2,2,3,3\n2,2,2,2,3,7\n2,2,2,3,3,3,3\n2,2,7,7\n2,3,3,3,7\n3,3,3,3,3,3\n3,3,7,7"}, {"input": "8 7 4 3\n11", "expected_output": "3,4,4\n3,8\n4,7"}, {"input": "1\n7", "expected_output": "1,1,1,1,1,1,1"}, {"input": "10 20 30\n30", "expected_output": "10,10,10\n10,20\n30"}]
        }
    },
    # 36. Backtracking
    {
        "title": "Permutations", "description": "Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.", "difficulty": "Medium", "tags": ["Array", "Backtracking"],
        "test_cases": {
            "sample": [{"input": "1 2 3", "expected_output": "1,2,3\n1,3,2\n2,1,3\n2,3,1\n3,1,2\n3,2,1"}, {"input": "0 1", "expected_output": "0,1\n1,0"}, {"input": "1", "expected_output": "1"}],
            "hidden": [{"input": "", "expected_output": ""}, {"input": "a b", "expected_output": "a,b\nb,a"}, {"input": "10 20", "expected_output": "10,20\n20,10"}, {"input": "-1 0 1", "expected_output": "-1,0,1\n-1,1,0\n0,-1,1\n0,1,-1\n1,-1,0\n1,0,-1"}, {"input": "5", "expected_output": "5"}, {"input": "1 2 3 4", "expected_output": "1,2,3,4\n1,2,4,3\n1,3,2,4\n1,3,4,2\n1,4,2,3\n1,4,3,2\n2,1,3,4\n2,1,4,3\n2,3,1,4\n2,3,4,1\n2,4,1,3\n2,4,3,1\n3,1,2,4\n3,1,4,2\n3,2,1,4\n3,2,4,1\n3,4,1,2\n3,4,2,1\n4,1,2,3\n4,1,3,2\n4,2,1,3\n4,2,3,1\n4,3,1,2\n4,3,2,1"}]
        }
    },
    # 37. Backtracking
    {
        "title": "Word Search", "description": "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.", "difficulty": "Medium", "tags": ["Backtracking", "Matrix", "DFS"],
        "test_cases": {
            "sample": [{"input": "A B C E\nS F C S\nA D E E\nABCCED", "expected_output": "true"}, {"input": "A B C E\nS F C S\nA D E E\nSEE", "expected_output": "true"}, {"input": "A B C E\nS F C S\nA D E E\nABCB", "expected_output": "false"}],
            "hidden": [{"input": "a\na", "expected_output": "true"}, {"input": "a\nb", "expected_output": "false"}, {"input": "C A A\nA A A\nB C D\nAAB", "expected_output": "true"}, {"input": "a b\nc d\nacdb", "expected_output": "true"}, {"input": "a b\nc d\nefgh", "expected_output": "false"}, {"input": "A\nABC", "expected_output": "false"}, {"input": "A B C D\nS F E S\nA D E E\nABCESEEEFS", "expected_output": "true"}]
        }
    },
    # 38. Graphs
    {
        "title": "Number of Islands", "description": "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.", "difficulty": "Medium", "tags": ["Graph", "DFS", "BFS", "Matrix"],
        "test_cases": {
            "sample": [{"input": "11110\n11010\n11000\n00000", "expected_output": "1"}, {"input": "11000\n11000\n00100\n00011", "expected_output": "3"}],
            "hidden": [{"input": "1", "expected_output": "1"}, {"input": "0", "expected_output": "0"}, {"input": "000\n000\n000", "expected_output": "0"}, {"input": "111\n111\n111", "expected_output": "1"}, {"input": "10101", "expected_output": "3"}, {"input": "1\n1\n1", "expected_output": "1"}, {"input": "101\n010\n101", "expected_output": "5"}, {"input": "1000\n0100\n0010\n0001", "expected_output": "4"}, {"input": "111\n010\n111", "expected_output": "1"}]
        }
    },
    # 39. Graphs
    {
        "title": "Clone Graph", "description": "Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph. Each node in the graph contains a value and a list of its neighbors.", "difficulty": "Medium", "tags": ["Graph", "DFS", "BFS"],
        "test_cases": {
            "sample": [{"input": "2,4\n1,3\n2,4\n1,3", "expected_output": "2,4\n1,3\n2,4\n1,3"}, {"input": "", "expected_output": ""}, {"input": "1", "expected_output": "1"}],
            "hidden": [{"input": "2\n1", "expected_output": "2\n1"}, {"input": "2,3\n1,3\n1,2", "expected_output": "2,3\n1,3\n1,2"}, {"input": "2\n1,3\n2", "expected_output": "2\n1,3\n2"}]
        }
    },
    # 40. Graphs
    {
        "title": "Pacific Atlantic Water Flow", "description": "You are given an `m x n` integer matrix `heights` representing the height of each unit cell in a continent. Return a list of grid coordinates `result[i] = [ri, ci]` where water can flow from cell `(ri, ci)` to both the Pacific and Atlantic oceans.", "difficulty": "Medium", "tags": ["Graph", "DFS", "BFS", "Matrix"],
        "test_cases": {
            "sample": [{"input": "1 2 2 3 5\n3 2 3 4 4\n2 4 5 3 1\n6 7 1 4 5\n5 1 1 2 4", "expected_output": "0,4\n1,3\n1,4\n2,2\n3,0\n3,1\n4,0"}],
            "hidden": [{"input": "1", "expected_output": "0,0"}, {"input": "1 2\n3 4", "expected_output": "0,1\n1,0\n1,1"}, {"input": "10 10 10\n10 1 10\n10 10 10", "expected_output": "0,0\n0,1\n0,2\n1,0\n1,2\n2,0\n2,1\n2,2"}]
        }
    },
    # 41. Graphs
    {
        "title": "Course Schedule", "description": "There are a total of `numCourses` courses you have to take, labeled from 0 to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`. Return `true` if you can finish all courses. Otherwise, return `false`.", "difficulty": "Medium", "tags": ["Graph", "Topological Sort"],
        "test_cases": {
            "sample": [{"input": "2\n1,0", "expected_output": "true"}, {"input": "2\n1,0\n0,1", "expected_output": "false"}, {"input": "1\n", "expected_output": "true"}],
            "hidden": [{"input": "3\n1,0\n2,0", "expected_output": "true"}, {"input": "3\n1,0\n0,2\n2,1", "expected_output": "false"}, {"input": "4\n1,0\n2,1\n3,2", "expected_output": "true"}, {"input": "4\n1,0\n2,1\n3,2\n0,3", "expected_output": "false"}, {"input": "5\n", "expected_output": "true"}, {"input": "5\n1,0\n2,0\n3,1\n4,1", "expected_output": "true"}, {"input": "20\n0,10\n3,18\n5,5\n6,11\n11,14\n13,1\n15,1\n17,4", "expected_output": "false"}]
        }
    },
    # 42. Dynamic Programming
    {
        "title": "Climbing Stairs", "description": "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?", "difficulty": "Easy", "tags": ["DP", "Memoization"],
        "test_cases": {
            "sample": [{"input": "2", "expected_output": "2"}, {"input": "3", "expected_output": "3"}, {"input": "1", "expected_output": "1"}],
            "hidden": [{"input": "4", "expected_output": "5"}, {"input": "5", "expected_output": "8"}, {"input": "6", "expected_output": "13"}, {"input": "10", "expected_output": "89"}, {"input": "20", "expected_output": "10946"}, {"input": "30", "expected_output": "1346269"}, {"input": "40", "expected_output": "165580141"}, {"input": "45", "expected_output": "1836311903"}, {"input": "0", "expected_output": "1"}, {"input": "7", "expected_output": "21"}, {"input": "8", "expected_output": "34"}]
        }
    },
    # 43. Dynamic Programming
    {
        "title": "Coin Change", "description": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up `amount`. If that amount of money cannot be made up, return -1.", "difficulty": "Medium", "tags": ["DP", "Array", "BFS"],
        "test_cases": {
            "sample": [{"input": "1 2 5\n11", "expected_output": "3"}, {"input": "2\n3", "expected_output": "-1"}, {"input": "1\n0", "expected_output": "0"}],
            "hidden": [{"input": "1\n1", "expected_output": "1"}, {"input": "1\n2", "expected_output": "2"}, {"input": "2 5\n11", "expected_output": "-1"}, {"input": "186 419 83 408\n6249", "expected_output": "20"}, {"input": "1 2147483647\n2", "expected_output": "2"}, {"input": "1 5 10 25\n100", "expected_output": "4"}, {"input": "1 5 10 25\n99", "expected_output": "9"}, {"input": "3 5\n7", "expected_output": "-1"}, {"input": "7\n7", "expected_output": "1"}, {"input": "10\n9", "expected_output": "-1"}, {"input": "1 2 5\n100", "expected_output": "20"}]
        }
    },
    # 44. Dynamic Programming
    {
        "title": "Longest Increasing Subsequence", "description": "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.", "difficulty": "Medium", "tags": ["DP", "Array", "Binary Search"],
        "test_cases": {
            "sample": [{"input": "10 9 2 5 3 7 101 18", "expected_output": "4"}, {"input": "0 1 0 3 2 3", "expected_output": "4"}, {"input": "7 7 7 7 7 7 7", "expected_output": "1"}],
            "hidden": [{"input": "", "expected_output": "0"}, {"input": "1", "expected_output": "1"}, {"input": "1 2 3 4 5", "expected_output": "5"}, {"input": "5 4 3 2 1", "expected_output": "1"}, {"input": "1 3 6 7 9 4 10 5 6", "expected_output": "6"}, {"input": "3 10 2 1 20", "expected_output": "3"}, {"input": "3 4 -1 0 6 2 3", "expected_output": "4"}, {"input": "10 22 9 33 21 50 41 60 80", "expected_output": "6"}, {"input": "0", "expected_output": "1"}, {"input": "1 1 1", "expected_output": "1"}, {"input": "-1 -2 -3", "expected_output": "1"}]
        }
    },
    # 45. Dynamic Programming
    {
        "title": "House Robber", "description": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night. Given an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.", "difficulty": "Medium", "tags": ["DP", "Array"],
        "test_cases": {
            "sample": [{"input": "1 2 3 1", "expected_output": "4"}, {"input": "2 7 9 3 1", "expected_output": "12"}, {"input": "1", "expected_output": "1"}],
            "hidden": [{"input": "", "expected_output": "0"}, {"input": "10", "expected_output": "10"}, {"input": "1 10", "expected_output": "10"}, {"input": "10 1", "expected_output": "10"}, {"input": "2 1 1 2", "expected_output": "4"}, {"input": "6 3 10 8 2 10 3 5 10 2 3 6", "expected_output": "41"}, {"input": "0 0 0 0", "expected_output": "0"}, {"input": "100 1 1 100", "expected_output": "200"}, {"input": "4 1 2 7 5 3 1", "expected_output": "14"}, {"input": "20 20 20", "expected_output": "40"}]
        }
    },
    # 46. Dynamic Programming
    {
        "title": "Decode Ways", "description": "A message containing letters from A-Z can be encoded into numbers using the following mapping: 'A' -> '1', 'B' -> '2', ..., 'Z' -> '26'. To decode an encoded message, all the digits must be grouped then mapped back into letters using the reverse of the mapping above. Given a string `s` containing only digits, return the number of ways to decode it.", "difficulty": "Medium", "tags": ["DP", "String"],
        "test_cases": {
            "sample": [{"input": "12", "expected_output": "2"}, {"input": "226", "expected_output": "3"}, {"input": "06", "expected_output": "0"}],
            "hidden": [{"input": "1", "expected_output": "1"}, {"input": "0", "expected_output": "0"}, {"input": "10", "expected_output": "1"}, {"input": "27", "expected_output": "1"}, {"input": "111", "expected_output": "3"}, {"input": "1111", "expected_output": "5"}, {"input": "1212", "expected_output": "5"}, {"input": "12321", "expected_output": "3"}, {"input": "2101", "expected_output": "1"}, {"input": "1001", "expected_output": "0"}, {"input": "301", "expected_output": "0"}, {"input": "1111111111111111111111111", "expected_output": "131072"}]
        }
    },
    # 47. Dynamic Programming
    {
        "title": "Unique Paths", "description": "There is a robot on an `m x n` grid. The robot is initially located at the top-left corner. The robot tries to move to the bottom-right corner. The robot can only move either down or right at any point in time. Given the two integers `m` and `n`, return the number of possible unique paths that the robot can take to reach the bottom-right corner.", "difficulty": "Medium", "tags": ["DP", "Math", "Combinatorics"],
        "test_cases": {
            "sample": [{"input": "3\n7", "expected_output": "28"}, {"input": "3\n2", "expected_output": "3"}, {"input": "1\n1", "expected_output": "1"}],
            "hidden": [{"input": "1\n10", "expected_output": "1"}, {"input": "10\n1", "expected_output": "1"}, {"input": "2\n2", "expected_output": "2"}, {"input": "2\n3", "expected_output": "3"}, {"input": "3\n3", "expected_output": "6"}, {"input": "7\n3", "expected_output": "28"}, {"input": "10\n10", "expected_output": "48620"}, {"input": "23\n12", "expected_output": "193536720"}, {"input": "19\n13", "expected_output": "20160075"}, {"input": "4\n4", "expected_output": "20"}, {"input": "5\n5", "expected_output": "70"}]
        }
    },
    # 48. Greedy
    {
        "title": "Maximum Subarray", "description": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.", "difficulty": "Medium", "tags": ["Greedy", "Array", "DP"],
        "test_cases": {
            "sample": [{"input": "-2 1 -3 4 -1 2 1 -5 4", "expected_output": "6"}, {"input": "1", "expected_output": "1"}, {"input": "5 4 -1 7 8", "expected_output": "23"}],
            "hidden": [{"input": "-1", "expected_output": "-1"}, {"input": "-2 -1", "expected_output": "-1"}, {"input": "1 2 3", "expected_output": "6"}, {"input": "-1 -2 -3", "expected_output": "-1"}, {"input": "0", "expected_output": "0"}, {"input": "1 -1 1", "expected_output": "1"}, {"input": "8 -19 5 -4 20", "expected_output": "21"}, {"input": "2 3 -5 4 6", "expected_output": "10"}, {"input": "-1 1 2 -2 3", "expected_output": "4"}, {"input": "10 -2 -5 8", "expected_output": "11"}, {"input": "1 1 1 1", "expected_output": "4"}]
        }
    },
    # 49. Greedy
    {
        "title": "Jump Game", "description": "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return `true` if you can reach the last index, or `false` otherwise.", "difficulty": "Medium", "tags": ["Greedy", "Array", "DP"],
        "test_cases": {
            "sample": [{"input": "2 3 1 1 4", "expected_output": "true"}, {"input": "3 2 1 0 4", "expected_output": "false"}, {"input": "0", "expected_output": "true"}],
            "hidden": [{"input": "1", "expected_output": "true"}, {"input": "1 0 5", "expected_output": "false"}, {"input": "2 0", "expected_output": "true"}, {"input": "2 5 0 0", "expected_output": "true"}, {"input": "1 1 1 1", "expected_output": "true"}, {"input": "1 1 0 1", "expected_output": "false"}, {"input": "5 4 3 2 1 0 0", "expected_output": "false"}, {"input": "1 2 3", "expected_output": "true"}, {"input": "0 1", "expected_output": "false"}, {"input": "4 2 0 0 1 1 4 4 4 0 4 0", "expected_output": "true"}]
        }
    },
    # 50. Greedy
    {
        "title": "Gas Station", "description": "There are `n` gas stations along a circular route, where the amount of gas at the `i-th` station is `gas[i]`. You have a car with an unlimited gas tank and it costs `cost[i]` of gas to travel from the `i-th` station to its next station (`i + 1`). You begin the journey with an empty tank at one of the gas stations. Given two integer arrays `gas` and `cost`, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1.", "difficulty": "Medium", "tags": ["Greedy", "Array"],
        "test_cases": {
            "sample": [{"input": "1 2 3 4 5\n3 4 5 1 2", "expected_output": "3"}, {"input": "2 3 4\n3 4 3", "expected_output": "-1"}],
            "hidden": [{"input": "5\n5", "expected_output": "0"}, {"input": "1\n2", "expected_output": "-1"}, {"input": "2\n1", "expected_output": "0"}, {"input": "1 2\n2 1", "expected_output": "0"}, {"input": "2 0 1 3\n1 2 1 1", "expected_output": "0"}, {"input": "5 1 2 3 4\n4 4 1 5 1", "expected_output": "4"}, {"input": "3 1 1\n1 2 2", "expected_output": "0"}, {"input": "5 8 2 8\n6 5 6 6", "expected_output": "3"}, {"input": "2 0 3\n1 2 1", "expected_output": "0"}, {"input": "1 2 3\n3 2 1", "expected_output": "1"}]
        }
    }
]

def seed_database():
    print("Starting to seed the database...")
    Base.metadata.create_all(bind=engine)
    db = sessionmaker(autocommit=False, autoflush=False, bind=engine)()
    
    try:
        system_user = db.query(User).filter(User.id == SYSTEM_USER_ID).first()
        if not system_user:
            print(f"Error: System user with ID {SYSTEM_USER_ID} not found. Please create this user first.")
            return

        existing_titles = {problem[0] for problem in db.query(Problem.title).all()}
        problems_to_add = []

        for prob_data in DSA_PROBLEMS_50:
            if prob_data["title"] in existing_titles:
                continue

            new_problem = Problem(
                title=prob_data["title"],
                description=prob_data["description"],
                difficulty=prob_data["difficulty"],
                tags=prob_data.get("tags", []),
                constraints=prob_data.get("constraints", ""),
                contributor_id=SYSTEM_USER_ID,
                status="approved",
                test_cases=prob_data.get("test_cases", {})
            )
            problems_to_add.append(new_problem)

        if problems_to_add:
            db.add_all(problems_to_add)
            db.commit()
            print(f"Successfully added {len(problems_to_add)} new problems.")
        else:
            print("No new problems to add.")
            
    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()