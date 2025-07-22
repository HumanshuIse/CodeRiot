import json
from sqlalchemy.orm import sessionmaker
from app.db.database import engine
from app.models.problem import Problem
from app.models.user import User

# --- Configuration ---
# IMPORTANT: Before running, ensure you have a user with this ID in your 'users' table.
SYSTEM_USER_ID = 1

# --- Problem Data ---
# A curated list of 50 foundational DSA problems with comprehensive test cases.
DSA_PROBLEMS_50 = [
    # Arrays & Hashing
    {
        "title": "Two Sum", "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.", "difficulty": "Easy", "tags": ["Array", "Hash Table"], "constraints": "2 <= nums.length <= 10^4",
        "test_cases": [
            {"input": "2 7 11 15\n9", "expected_output": "0 1"},
            {"input": "3 2 4\n6", "expected_output": "1 2"},
            {"input": "3 3\n6", "expected_output": "0 1"}
        ]
    },
    {
        "title": "Contains Duplicate", "description": "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.", "difficulty": "Easy", "tags": ["Array", "Hash Table", "Set"], "constraints": "1 <= nums.length <= 10^5",
        "test_cases": [
            {"input": "1 2 3 1", "expected_output": "true"},
            {"input": "1 2 3 4", "expected_output": "false"},
            {"input": "1 1 1 3 3 4 3 2 4 2", "expected_output": "true"}
        ]
    },
    {
        "title": "Valid Anagram", "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.", "difficulty": "Easy", "tags": ["String", "Hash Table", "Sorting"], "constraints": "s.length == t.length",
        "test_cases": [
            {"input": "anagram\nnagaram", "expected_output": "true"},
            {"input": "rat\ncar", "expected_output": "false"},
            {"input": "listen\nsilent", "expected_output": "true"}
        ]
    },
    {
        "title": "Group Anagrams", "description": "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.", "difficulty": "Medium", "tags": ["Array", "String", "Hash Table"], "constraints": "1 <= strs.length <= 10^4",
        "test_cases": [
            {"input": "eat tea tan ate nat bat", "expected_output": "ate,eat,tea\nbat\nnat,tan"},
            {"input": "a", "expected_output": "a"},
            {"input": "", "expected_output": ""}
        ]
    },
    {
        "title": "Top K Frequent Elements", "description": "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements.", "difficulty": "Medium", "tags": ["Array", "Hash Table", "Heap"], "constraints": "1 <= nums.length <= 10^5",
        "test_cases": [
            {"input": "1 1 1 2 2 3\n2", "expected_output": "1 2"},
            {"input": "1\n1", "expected_output": "1"},
            {"input": "4 1 -1 2 -1 2 3\n2", "expected_output": "-1 2"}
        ]
    },
    {
        "title": "Product of Array Except Self", "description": "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.", "difficulty": "Medium", "tags": ["Array", "Prefix Sum"], "constraints": "2 <= nums.length <= 10^5",
        "test_cases": [
            {"input": "1 2 3 4", "expected_output": "24 12 8 6"},
            {"input": "-1 1 0 -3 3", "expected_output": "0 0 9 0 0"}
        ]
    },
    {
        "title": "Longest Consecutive Sequence", "description": "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.", "difficulty": "Medium", "tags": ["Array", "Hash Table", "Set"], "constraints": "0 <= nums.length <= 10^5",
        "test_cases": [
            {"input": "100 4 200 1 3 2", "expected_output": "4"},
            {"input": "0 3 7 2 5 8 4 6 0 1", "expected_output": "9"}
        ]
    },
    # Two Pointers
    {
        "title": "Valid Palindrome", "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.", "difficulty": "Easy", "tags": ["String", "Two Pointers"], "constraints": "1 <= s.length <= 2 * 10^5",
        "test_cases": [
            {"input": "A man, a plan, a canal: Panama", "expected_output": "true"},
            {"input": "race a car", "expected_output": "false"},
            {"input": " ", "expected_output": "true"}
        ]
    },
    {
        "title": "3Sum", "description": "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.", "difficulty": "Medium", "tags": ["Array", "Two Pointers", "Sorting"], "constraints": "3 <= nums.length <= 3000",
        "test_cases": [
            {"input": "-1 0 1 2 -1 -4", "expected_output": "-1,-1,2\n-1,0,1"},
            {"input": "0 1 1", "expected_output": ""},
            {"input": "0 0 0", "expected_output": "0,0,0"}
        ]
    },
    {
        "title": "Container With Most Water", "description": "Find two lines that together with the x-axis form a container, such that the container contains the most water.", "difficulty": "Medium", "tags": ["Array", "Two Pointers", "Greedy"], "constraints": "n == height.length",
        "test_cases": [
            {"input": "1 8 6 2 5 4 8 3 7", "expected_output": "49"},
            {"input": "1 1", "expected_output": "1"}
        ]
    },
    # Sliding Window
    {
        "title": "Best Time to Buy and Sell Stock", "description": "You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.", "difficulty": "Easy", "tags": ["Array", "Sliding Window"], "constraints": "1 <= prices.length <= 10^5",
        "test_cases": [
            {"input": "7 1 5 3 6 4", "expected_output": "5"},
            {"input": "7 6 4 3 1", "expected_output": "0"}
        ]
    },
    {
        "title": "Longest Substring Without Repeating Characters", "description": "Given a string `s`, find the length of the longest substring without repeating characters.", "difficulty": "Medium", "tags": ["String", "Sliding Window", "Hash Table"], "constraints": "0 <= s.length <= 5 * 10^4",
        "test_cases": [
            {"input": "abcabcbb", "expected_output": "3"},
            {"input": "bbbbb", "expected_output": "1"},
            {"input": "pwwkew", "expected_output": "3"}
        ]
    },
    # Stack
    {
        "title": "Valid Parentheses", "description": "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.", "difficulty": "Easy", "tags": ["Stack", "String"], "constraints": "1 <= s.length <= 10^4",
        "test_cases": [
            {"input": "()", "expected_output": "true"},
            {"input": "()[]{}", "expected_output": "true"},
            {"input": "(]", "expected_output": "false"}
        ]
    },
    {
        "title": "Min Stack", "description": "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.", "difficulty": "Medium", "tags": ["Stack", "Design"], "constraints": "Methods will always be called on non-empty stacks for pop, top, and getMin.",
        "test_cases": [
            {"input": "push -2\npush 0\npush -3\ngetMin\npop\ntop\ngetMin", "expected_output": "-3\n0\n-2"}
        ]
    },
    # Binary Search
    {
        "title": "Binary Search", "description": "Given a sorted array of integers `nums` and a `target`, write a function to search `target` in `nums`. Return its index or -1.", "difficulty": "Easy", "tags": ["Array", "Binary Search"], "constraints": "1 <= nums.length <= 10^4",
        "test_cases": [
            {"input": "-1 0 3 5 9 12\n9", "expected_output": "4"},
            {"input": "-1 0 3 5 9 12\n2", "expected_output": "-1"}
        ]
    },
    {
        "title": "Search a 2D Matrix", "description": "You are given an `m x n` integer matrix `matrix` where each row is sorted and the first integer of each row is greater than the last integer of the previous row.", "difficulty": "Medium", "tags": ["Array", "Binary Search", "Matrix"], "constraints": "m == matrix.length",
        "test_cases": [
            {"input": "1 3 5 7\n10 11 16 20\n23 30 34 60\n3", "expected_output": "true"},
            {"input": "1 3 5 7\n10 11 16 20\n23 30 34 60\n13", "expected_output": "false"}
        ]
    },
    # Linked List
    {
        "title": "Reverse Linked List", "description": "Given the `head` of a singly linked list, reverse the list, and return the reversed list.", "difficulty": "Easy", "tags": ["Linked List", "Recursion"], "constraints": "The number of nodes is in [0, 5000].",
        "test_cases": [
            {"input": "1 2 3 4 5", "expected_output": "5 4 3 2 1"},
            {"input": "1 2", "expected_output": "2 1"},
            {"input": "", "expected_output": ""}
        ]
    },
    {
        "title": "Merge Two Sorted Lists", "description": "You are given the heads of two sorted linked lists. Merge the two lists into one sorted list.", "difficulty": "Easy", "tags": ["Linked List", "Recursion"], "constraints": "The number of nodes in both lists is in [0, 50].",
        "test_cases": [
            {"input": "1 2 4\n1 3 4", "expected_output": "1 1 2 3 4 4"},
            {"input": "\n", "expected_output": ""},
            {"input": "\n0", "expected_output": "0"}
        ]
    },
    {
        "title": "Reorder List", "description": "Given the head of a singly linked list L0→L1→…→Ln-1→Ln, reorder it to: L0→Ln→L1→Ln-1→…", "difficulty": "Medium", "tags": ["Linked List", "Two Pointers", "Stack"], "constraints": "The number of nodes is in [1, 5 * 10^4].",
        "test_cases": [
            {"input": "1 2 3 4", "expected_output": "1 4 2 3"},
            {"input": "1 2 3 4 5", "expected_output": "1 5 2 4 3"}
        ]
    },
    {
        "title": "Remove Nth Node From End of List", "description": "Given the `head` of a linked list, remove the `n-th` node from the end of the list and return its head.", "difficulty": "Medium", "tags": ["Linked List", "Two Pointers"], "constraints": "The number of nodes is sz.",
        "test_cases": [
            {"input": "1 2 3 4 5\n2", "expected_output": "1 2 3 5"},
            {"input": "1\n1", "expected_output": ""},
            {"input": "1 2\n1", "expected_output": "1"}
        ]
    },
    {
        "title": "Linked List Cycle", "description": "Given `head`, the head of a linked list, determine if the linked list has a cycle in it.", "difficulty": "Easy", "tags": ["Linked List", "Two Pointers", "Hash Table"], "constraints": "The number of nodes is in [0, 10^4].",
        "test_cases": [
            {"input": "3 2 0 -4\n1", "expected_output": "true"},
            {"input": "1 2\n0", "expected_output": "true"},
            {"input": "1\n-1", "expected_output": "false"}
        ]
    },
    # Trees
    {
        "title": "Invert Binary Tree", "description": "Given the `root` of a binary tree, invert the tree, and return its root.", "difficulty": "Easy", "tags": ["Tree", "DFS", "BFS", "Recursion"], "constraints": "The number of nodes is in [0, 100].",
        "test_cases": [
            {"input": "4 2 7 1 3 6 9", "expected_output": "4 7 2 9 6 3 1"},
            {"input": "2 1 3", "expected_output": "2 3 1"}
        ]
    },
    {
        "title": "Maximum Depth of Binary Tree", "description": "Given the `root` of a binary tree, return its maximum depth.", "difficulty": "Easy", "tags": ["Tree", "DFS", "BFS", "Recursion"], "constraints": "The number of nodes is in [0, 10^4].",
        "test_cases": [
            {"input": "3 9 20 null null 15 7", "expected_output": "3"},
            {"input": "1 null 2", "expected_output": "2"}
        ]
    },
    {
        "title": "Same Tree", "description": "Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not.", "difficulty": "Easy", "tags": ["Tree", "DFS", "BFS", "Recursion"], "constraints": "The number of nodes is in [0, 100].",
        "test_cases": [
            {"input": "1 2 3\n1 2 3", "expected_output": "true"},
            {"input": "1 2\n1 null 2", "expected_output": "false"},
            {"input": "1 2 1\n1 1 2", "expected_output": "false"}
        ]
    },
    {
        "title": "Subtree of Another Tree", "description": "Given the roots of two binary trees `root` and `subRoot`, return `true` if `subRoot` is a subtree of `root`.", "difficulty": "Easy", "tags": ["Tree", "DFS", "Recursion"], "constraints": "Nodes in root: [1, 2000].",
        "test_cases": [
            {"input": "3 4 5 1 2\n4 1 2", "expected_output": "true"},
            {"input": "3 4 5 1 2 null null null null 0\n4 1 2", "expected_output": "false"}
        ]
    },
    {
        "title": "Lowest Common Ancestor of a BST", "description": "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes.", "difficulty": "Easy", "tags": ["Tree", "BST", "DFS"], "constraints": "The number of nodes is in [2, 10^5].",
        "test_cases": [
            {"input": "6 2 8 0 4 7 9 null null 3 5\n2\n8", "expected_output": "6"},
            {"input": "6 2 8 0 4 7 9 null null 3 5\n2\n4", "expected_output": "2"}
        ]
    },
    {
        "title": "Binary Tree Level Order Traversal", "description": "Given the `root` of a binary tree, return the level order traversal of its nodes' values.", "difficulty": "Medium", "tags": ["Tree", "BFS"], "constraints": "The number of nodes is in [0, 2000].",
        "test_cases": [
            {"input": "3 9 20 null null 15 7", "expected_output": "3\n9,20\n15,7"},
            {"input": "1", "expected_output": "1"}
        ]
    },
    {
        "title": "Validate Binary Search Tree", "description": "Given the `root` of a binary tree, determine if it is a valid binary search tree (BST).", "difficulty": "Medium", "tags": ["Tree", "BST", "DFS", "Recursion"], "constraints": "The number of nodes is in [1, 10^4].",
        "test_cases": [
            {"input": "2 1 3", "expected_output": "true"},
            {"input": "5 1 4 null null 3 6", "expected_output": "false"}
        ]
    },
    {
        "title": "Kth Smallest Element in a BST", "description": "Given the `root` of a BST and an integer `k`, return the `k-th` smallest value (1-indexed).", "difficulty": "Medium", "tags": ["Tree", "BST", "DFS"], "constraints": "The number of nodes is n.",
        "test_cases": [
            {"input": "3 1 4 null 2\n1", "expected_output": "1"},
            {"input": "5 3 6 2 4 1\n3", "expected_output": "3"}
        ]
    },
    {
        "title": "Binary Tree Maximum Path Sum", "description": "Given the `root` of a non-empty binary tree, find the maximum path sum.", "difficulty": "Hard", "tags": ["Tree", "DFS", "Recursion", "DP"], "constraints": "Nodes in tree: [1, 3 * 10^4].",
        "test_cases": [
            {"input": "1 2 3", "expected_output": "6"},
            {"input": "-10 9 20 null null 15 7", "expected_output": "42"}
        ]
    },
    # Heap / Priority Queue
    {
        "title": "Kth Largest Element in a Stream", "description": "Design a class to find the `k-th` largest element in a stream.", "difficulty": "Easy", "tags": ["Heap", "Design"], "constraints": "1 <= k <= 10^4",
        "test_cases": [
            {"input": "3\n4 5 8 2\nadd 3\nadd 5\nadd 10\nadd 9\nadd 4", "expected_output": "4\n5\n5\n8\n8"}
        ]
    },
    {
        "title": "Last Stone Weight", "description": "Return the weight of the last remaining stone, or 0 if none are left.", "difficulty": "Easy", "tags": ["Heap", "Simulation"], "constraints": "1 <= stones.length <= 30",
        "test_cases": [
            {"input": "2 7 4 1 8 1", "expected_output": "1"},
            {"input": "1", "expected_output": "1"}
        ]
    },
    {
        "title": "Find Median from Data Stream", "description": "Implement the MedianFinder class.", "difficulty": "Hard", "tags": ["Heap", "Two Heaps", "Design"], "constraints": "At most 5 * 10^4 calls.",
        "test_cases": [
            {"input": "addNum 1\naddNum 2\nfindMedian\naddNum 3\nfindMedian", "expected_output": "1.5\n2.0"}
        ]
    },
    # Backtracking
    {
        "title": "Subsets", "description": "Given an integer array `nums` of unique elements, return all possible subsets (the power set).", "difficulty": "Medium", "tags": ["Backtracking", "Bit Manipulation"], "constraints": "1 <= nums.length <= 10",
        "test_cases": [
            {"input": "1 2 3", "expected_output": "\n1\n1,2\n1,2,3\n1,3\n2\n2,3\n3"},
            {"input": "0", "expected_output": "\n0"}
        ]
    },
    {
        "title": "Combination Sum", "description": "Given an array of distinct integers `candidates` and a `target`, return a list of all unique combinations where numbers sum to `target`.", "difficulty": "Medium", "tags": ["Array", "Backtracking"], "constraints": "1 <= candidates.length <= 30",
        "test_cases": [
            {"input": "2 3 6 7\n7", "expected_output": "2,2,3\n7"},
            {"input": "2 3 5\n8", "expected_output": "2,2,2,2\n2,3,3\n3,5"}
        ]
    },
    {
        "title": "Permutations", "description": "Given an array `nums` of distinct integers, return all the possible permutations.", "difficulty": "Medium", "tags": ["Array", "Backtracking"], "constraints": "1 <= nums.length <= 6",
        "test_cases": [
            {"input": "1 2 3", "expected_output": "1,2,3\n1,3,2\n2,1,3\n2,3,1\n3,1,2\n3,2,1"},
            {"input": "0 1", "expected_output": "0,1\n1,0"}
        ]
    },
    {
        "title": "Word Search", "description": "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.", "difficulty": "Medium", "tags": ["Backtracking", "Matrix", "DFS"], "constraints": "m == board.length",
        "test_cases": [
            {"input": "A B C E\nS F C S\nA D E E\nABCCED", "expected_output": "true"},
            {"input": "A B C E\nS F C S\nA D E E\nSEE", "expected_output": "true"},
            {"input": "A B C E\nS F C S\nA D E E\nABCB", "expected_output": "false"}
        ]
    },
    # Graphs
    {
        "title": "Number of Islands", "description": "Given an `m x n` 2D binary grid `grid`, return the number of islands.", "difficulty": "Medium", "tags": ["Graph", "DFS", "BFS", "Matrix"], "constraints": "m == grid.length",
        "test_cases": [
            {"input": "11110\n11010\n11000\n00000", "expected_output": "1"},
            {"input": "11000\n11000\n00100\n00011", "expected_output": "3"}
        ]
    },
    {
        "title": "Clone Graph", "description": "Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.", "difficulty": "Medium", "tags": ["Graph", "DFS", "BFS"], "constraints": "Nodes in graph: [0, 100].",
        "test_cases": [
            {"input": "2,4\n1,3\n2,4\n1,3", "expected_output": "2,4\n1,3\n2,4\n1,3"},
            {"input": "", "expected_output": ""}
        ]
    },
    {
        "title": "Pacific Atlantic Water Flow", "description": "Return a list of grid coordinates where water can flow to both the Pacific and Atlantic oceans.", "difficulty": "Medium", "tags": ["Graph", "DFS", "BFS", "Matrix"], "constraints": "m == heights.length",
        "test_cases": [
            {"input": "1 2 2 3 5\n3 2 3 4 4\n2 4 5 3 1\n6 7 1 4 5\n5 1 1 2 4", "expected_output": "0,4\n1,3\n1,4\n2,2\n3,0\n3,1\n4,0"}
        ]
    },
    {
        "title": "Course Schedule", "description": "Return `true` if you can finish all courses. Otherwise, return `false`.", "difficulty": "Medium", "tags": ["Graph", "Topological Sort"], "constraints": "1 <= numCourses <= 2000",
        "test_cases": [
            {"input": "2\n1,0", "expected_output": "true"},
            {"input": "2\n1,0\n0,1", "expected_output": "false"}
        ]
    },
    # Dynamic Programming
    {
        "title": "Climbing Stairs", "description": "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?", "difficulty": "Easy", "tags": ["DP", "Memoization"], "constraints": "1 <= n <= 45",
        "test_cases": [
            {"input": "2", "expected_output": "2"},
            {"input": "3", "expected_output": "3"},
            {"input": "5", "expected_output": "8"}
        ]
    },
    {
        "title": "Coin Change", "description": "Return the fewest number of coins that you need to make up `amount`. If that amount of money cannot be made up, return -1.", "difficulty": "Medium", "tags": ["DP", "Array", "BFS"], "constraints": "1 <= coins.length <= 12",
        "test_cases": [
            {"input": "1 2 5\n11", "expected_output": "3"},
            {"input": "2\n3", "expected_output": "-1"},
            {"input": "1\n0", "expected_output": "0"}
        ]
    },
    {
        "title": "Longest Increasing Subsequence", "description": "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.", "difficulty": "Medium", "tags": ["DP", "Array", "Binary Search"], "constraints": "1 <= nums.length <= 2500",
        "test_cases": [
            {"input": "10 9 2 5 3 7 101 18", "expected_output": "4"},
            {"input": "0 1 0 3 2 3", "expected_output": "4"},
            {"input": "7 7 7 7 7 7 7", "expected_output": "1"}
        ]
    },
    {
        "title": "House Robber", "description": "Given an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.", "difficulty": "Medium", "tags": ["DP", "Array"], "constraints": "1 <= nums.length <= 100",
        "test_cases": [
            {"input": "1 2 3 1", "expected_output": "4"},
            {"input": "2 7 9 3 1", "expected_output": "12"}
        ]
    },
    {
        "title": "Decode Ways", "description": "Given a string `s` containing only digits, return the number of ways to decode it.", "difficulty": "Medium", "tags": ["DP", "String"], "constraints": "1 <= s.length <= 100",
        "test_cases": [
            {"input": "12", "expected_output": "2"},
            {"input": "226", "expected_output": "3"},
            {"input": "06", "expected_output": "0"}
        ]
    },
    {
        "title": "Unique Paths", "description": "Given `m` and `n`, return the number of possible unique paths the robot can take to reach the bottom-right corner.", "difficulty": "Medium", "tags": ["DP", "Math", "Combinatorics"], "constraints": "1 <= m, n <= 100",
        "test_cases": [
            {"input": "3\n7", "expected_output": "28"},
            {"input": "3\n2", "expected_output": "3"}
        ]
    },
    # Greedy
    {
        "title": "Maximum Subarray", "description": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.", "difficulty": "Medium", "tags": ["Greedy", "Array", "DP"], "constraints": "1 <= nums.length <= 10^5",
        "test_cases": [
            {"input": "-2 1 -3 4 -1 2 1 -5 4", "expected_output": "6"},
            {"input": "1", "expected_output": "1"},
            {"input": "5 4 -1 7 8", "expected_output": "23"}
        ]
    },
    {
        "title": "Jump Game", "description": "You are given an integer array `nums`. Return `true` if you can reach the last index, or `false` otherwise.", "difficulty": "Medium", "tags": ["Greedy", "Array", "DP"], "constraints": "1 <= nums.length <= 10^4",
        "test_cases": [
            {"input": "2 3 1 1 4", "expected_output": "true"},
            {"input": "3 2 1 0 4", "expected_output": "false"}
        ]
    }
]


# Create a new session to interact with the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def seed_database():
    """
    Populates the database with the pre-defined problem set and their test cases.
    """
    print("Starting to seed the database...")

    existing_titles = {problem[0] for problem in db.query(Problem.title).all()}
    problems_to_add = []

    for prob_data in DSA_PROBLEMS_50:
        if prob_data["title"] in existing_titles:
            print(f"Skipping '{prob_data['title']}' as it already exists.")
            continue

        new_problem = Problem(
            title=prob_data["title"],
            description=prob_data["description"],
            difficulty=prob_data["difficulty"],
            tags=prob_data["tags"],
            constraints=prob_data["constraints"],
            contributor_id=SYSTEM_USER_ID,
            status="approved",
            test_cases=prob_data.get("test_cases", [])
        )
        problems_to_add.append(new_problem)

    if not problems_to_add:
        print("No new problems to add.")
        db.close()
        return

    try:
        print(f"Adding {len(problems_to_add)} new problems to the database...")
        db.add_all(problems_to_add)
        db.commit()
        print("Successfully seeded the database with new problems!")
    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()