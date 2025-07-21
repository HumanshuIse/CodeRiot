import json
from sqlalchemy.orm import sessionmaker
from app.db.database import engine # Make sure this import path is correct
from app.models.problem import Problem # Your SQLAlchemy model
from app.models.user import User # <-- FIX: Import the User model to resolve the relationship

# --- Configuration ---
# IMPORTANT: Before running, make sure you have a user in your 'users' table
# that can be the "contributor" for these problems.
# For example, a system admin user with ID = 1.
SYSTEM_USER_ID = 1 

# --- Problem Data ---
# A curated list of 50 foundational DSA problems.
DSA_PROBLEMS_50 = [
    # Arrays & Hashing
    {"title": "Two Sum", "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.", "difficulty": "Easy", "tags": ["Array", "Hash Table"], "constraints": "2 <= nums.length <= 10^4"},
    {"title": "Contains Duplicate", "description": "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.", "difficulty": "Easy", "tags": ["Array", "Hash Table", "Set"], "constraints": "1 <= nums.length <= 10^5"},
    {"title": "Valid Anagram", "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.", "difficulty": "Easy", "tags": ["String", "Hash Table", "Sorting"], "constraints": "s.length == t.length"},
    {"title": "Group Anagrams", "description": "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.", "difficulty": "Medium", "tags": ["Array", "String", "Hash Table"], "constraints": "1 <= strs.length <= 10^4"},
    {"title": "Top K Frequent Elements", "description": "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements.", "difficulty": "Medium", "tags": ["Array", "Hash Table", "Heap", "Quickselect"], "constraints": "1 <= nums.length <= 10^5"},
    {"title": "Product of Array Except Self", "description": "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.", "difficulty": "Medium", "tags": ["Array", "Prefix Sum"], "constraints": "2 <= nums.length <= 10^5"},
    {"title": "Longest Consecutive Sequence", "description": "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.", "difficulty": "Medium", "tags": ["Array", "Hash Table", "Set"], "constraints": "0 <= nums.length <= 10^5"},
    
    # Two Pointers
    {"title": "Valid Palindrome", "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.", "difficulty": "Easy", "tags": ["String", "Two Pointers"], "constraints": "1 <= s.length <= 2 * 10^5"},
    {"title": "3Sum", "description": "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.", "difficulty": "Medium", "tags": ["Array", "Two Pointers", "Sorting"], "constraints": "3 <= nums.length <= 3000"},
    {"title": "Container With Most Water", "description": "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`. Find two lines that together with the x-axis form a container, such that the container contains the most water.", "difficulty": "Medium", "tags": ["Array", "Two Pointers", "Greedy"], "constraints": "n == height.length"},

    # Sliding Window
    {"title": "Best Time to Buy and Sell Stock", "description": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.", "difficulty": "Easy", "tags": ["Array", "Sliding Window"], "constraints": "1 <= prices.length <= 10^5"},
    {"title": "Longest Substring Without Repeating Characters", "description": "Given a string `s`, find the length of the longest substring without repeating characters.", "difficulty": "Medium", "tags": ["String", "Sliding Window", "Hash Table"], "constraints": "0 <= s.length <= 5 * 10^4"},

    # Stack
    {"title": "Valid Parentheses", "description": "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.", "difficulty": "Easy", "tags": ["Stack", "String"], "constraints": "1 <= s.length <= 10^4"},
    {"title": "Min Stack", "description": "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.", "difficulty": "Medium", "tags": ["Stack", "Design"], "constraints": "Methods pop, top and getMin operations will always be called on non-empty stacks."},

    # Binary Search
    {"title": "Binary Search", "description": "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return -1.", "difficulty": "Easy", "tags": ["Array", "Binary Search"], "constraints": "1 <= nums.length <= 10^4"},
    {"title": "Search a 2D Matrix", "description": "You are given an `m x n` integer matrix `matrix` with the following two properties: Each row is sorted in non-decreasing order. The first integer of each row is greater than the last integer of the previous row.", "difficulty": "Medium", "tags": ["Array", "Binary Search", "Matrix"], "constraints": "m == matrix.length"},

    # Linked List
    {"title": "Reverse Linked List", "description": "Given the `head` of a singly linked list, reverse the list, and return the reversed list.", "difficulty": "Easy", "tags": ["Linked List", "Recursion"], "constraints": "The number of nodes in the list is the range [0, 5000]."},
    {"title": "Merge Two Sorted Lists", "description": "You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists into one sorted list.", "difficulty": "Easy", "tags": ["Linked List", "Recursion"], "constraints": "The number of nodes in both lists is in the range [0, 50]."},
    {"title": "Reorder List", "description": "You are given the head of a singly linked list. The list can be represented as: L0 → L1 → … → Ln - 1 → Ln. Reorder the list to be on the following form: L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …", "difficulty": "Medium", "tags": ["Linked List", "Two Pointers", "Stack"], "constraints": "The number of nodes in the list is in the range [1, 5 * 10^4]."},
    {"title": "Remove Nth Node From End of List", "description": "Given the `head` of a linked list, remove the `n-th` node from the end of the list and return its head.", "difficulty": "Medium", "tags": ["Linked List", "Two Pointers"], "constraints": "The number of nodes in the list is sz."},
    {"title": "Linked List Cycle", "description": "Given `head`, the head of a linked list, determine if the linked list has a cycle in it.", "difficulty": "Easy", "tags": ["Linked List", "Two Pointers", "Hash Table"], "constraints": "The number of the nodes in the list is in the range [0, 10^4]."},

    # Trees
    {"title": "Invert Binary Tree", "description": "Given the `root` of a binary tree, invert the tree, and return its root.", "difficulty": "Easy", "tags": ["Tree", "DFS", "BFS", "Recursion"], "constraints": "The number of nodes in the tree is in the range [0, 100]."},
    {"title": "Maximum Depth of Binary Tree", "description": "Given the `root` of a binary tree, return its maximum depth.", "difficulty": "Easy", "tags": ["Tree", "DFS", "BFS", "Recursion"], "constraints": "The number of nodes in the tree is in the range [0, 10^4]."},
    {"title": "Same Tree", "description": "Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not.", "difficulty": "Easy", "tags": ["Tree", "DFS", "BFS", "Recursion"], "constraints": "The number of nodes in both trees is in the range [0, 100]."},
    {"title": "Subtree of Another Tree", "description": "Given the roots of two binary trees `root` and `subRoot`, return `true` if there is a subtree of `root` with the same structure and node values of `subRoot` and `false` otherwise.", "difficulty": "Easy", "tags": ["Tree", "DFS", "Recursion"], "constraints": "The number of nodes in the root tree is in the range [1, 2000]."},
    {"title": "Lowest Common Ancestor of a BST", "description": "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.", "difficulty": "Easy", "tags": ["Tree", "BST", "DFS"], "constraints": "The number of nodes in the tree is in the range [2, 10^5]."},
    {"title": "Binary Tree Level Order Traversal", "description": "Given the `root` of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).", "difficulty": "Medium", "tags": ["Tree", "BFS"], "constraints": "The number of nodes in the tree is in the range [0, 2000]."},
    {"title": "Validate Binary Search Tree", "description": "Given the `root` of a binary tree, determine if it is a valid binary search tree (BST).", "difficulty": "Medium", "tags": ["Tree", "BST", "DFS", "Recursion"], "constraints": "The number of nodes in the tree is in the range [1, 10^4]."},
    {"title": "Kth Smallest Element in a BST", "description": "Given the `root` of a binary search tree, and an integer `k`, return the `k-th` smallest value (1-indexed) of all the values of the nodes in the tree.", "difficulty": "Medium", "tags": ["Tree", "BST", "DFS", "Inorder Traversal"], "constraints": "The number of nodes in the tree is n."},
    {"title": "Binary Tree Maximum Path Sum", "description": "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root. Given the `root` of a binary tree, return the maximum path sum of any non-empty path.", "difficulty": "Hard", "tags": ["Tree", "DFS", "Recursion", "Dynamic Programming"], "constraints": "The number of nodes in the tree is in the range [1, 3 * 10^4]."},
    
    # Heap / Priority Queue
    {"title": "Kth Largest Element in a Stream", "description": "Design a class to find the `k-th` largest element in a stream. Note that it is the `k-th` largest element in the sorted order, not the `k-th` distinct element.", "difficulty": "Easy", "tags": ["Heap", "Priority Queue", "Design"], "constraints": "1 <= k <= 10^4"},
    {"title": "Last Stone Weight", "description": "You are given an array of integers `stones` where `stones[i]` is the weight of the `i-th` stone. We are playing a game with the stones. On each turn, we choose the heaviest two stones and smash them together. If the stones are equal, both are destroyed. If not, the smaller stone is destroyed and the larger stone's new weight is the difference. Return the weight of the last remaining stone, or 0 if none are left.", "difficulty": "Easy", "tags": ["Heap", "Priority Queue", "Simulation"], "constraints": "1 <= stones.length <= 30"},
    {"title": "Find Median from Data Stream", "description": "The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values. Implement the MedianFinder class.", "difficulty": "Hard", "tags": ["Heap", "Priority Queue", "Design", "Two Heaps"], "constraints": "At most 5 * 10^4 calls will be made to addNum and findMedian."},

    # Backtracking
    {"title": "Subsets", "description": "Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.", "difficulty": "Medium", "tags": ["Array", "Backtracking", "Bit Manipulation"], "constraints": "1 <= nums.length <= 10"},
    {"title": "Combination Sum", "description": "Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of `candidates` where the chosen numbers sum to `target`.", "difficulty": "Medium", "tags": ["Array", "Backtracking"], "constraints": "1 <= candidates.length <= 30"},
    {"title": "Permutations", "description": "Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.", "difficulty": "Medium", "tags": ["Array", "Backtracking"], "constraints": "1 <= nums.length <= 6"},
    {"title": "Word Search", "description": "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.", "difficulty": "Medium", "tags": ["Array", "Backtracking", "Matrix", "DFS"], "constraints": "m == board.length"},

    # Graphs
    {"title": "Number of Islands", "description": "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands.", "difficulty": "Medium", "tags": ["Graph", "DFS", "BFS", "Matrix"], "constraints": "m == grid.length"},
    {"title": "Clone Graph", "description": "Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.", "difficulty": "Medium", "tags": ["Graph", "DFS", "BFS", "Hash Table"], "constraints": "The number of nodes in the graph is in the range [0, 100]."},
    {"title": "Pacific Atlantic Water Flow", "description": "You are given an `m x n` integer matrix `heights` representing the height of each unit cell in a continent. The Pacific ocean touches the continent's top and left edges, and the Atlantic ocean touches the continent's bottom and right edges. Water can flow from a cell to an adjacent cell if the adjacent cell's height is less than or equal to the current cell's height. Return a list of grid coordinates where water can flow to both the Pacific and Atlantic oceans.", "difficulty": "Medium", "tags": ["Graph", "DFS", "BFS", "Matrix"], "constraints": "m == heights.length"},
    {"title": "Course Schedule", "description": "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`. Return `true` if you can finish all courses. Otherwise, return `false`.", "difficulty": "Medium", "tags": ["Graph", "DFS", "BFS", "Topological Sort"], "constraints": "1 <= numCourses <= 2000"},

    # Dynamic Programming
    {"title": "Climbing Stairs", "description": "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?", "difficulty": "Easy", "tags": ["Dynamic Programming", "Memoization", "Math"], "constraints": "1 <= n <= 45"},
    {"title": "Coin Change", "description": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount.", "difficulty": "Medium", "tags": ["Dynamic Programming", "Array", "BFS"], "constraints": "1 <= coins.length <= 12"},
    {"title": "Longest Increasing Subsequence", "description": "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.", "difficulty": "Medium", "tags": ["Dynamic Programming", "Array", "Binary Search"], "constraints": "1 <= nums.length <= 2500"},
    {"title": "House Robber", "description": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night. Given an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.", "difficulty": "Medium", "tags": ["Dynamic Programming", "Array"], "constraints": "1 <= nums.length <= 100"},
    {"title": "Decode Ways", "description": "A message containing letters from A-Z can be encoded into numbers using the following mapping: 'A' -> '1', 'B' -> '2', ..., 'Z' -> '26'. To decode an encoded message, all the digits must be grouped then mapped back into letters using the reverse of the mapping above. Given a string `s` containing only digits, return the number of ways to decode it.", "difficulty": "Medium", "tags": ["Dynamic Programming", "String"], "constraints": "1 <= s.length <= 100"},
    {"title": "Unique Paths", "description": "There is a robot on an `m x n` grid. The robot is initially located at the top-left corner (i.e., `grid[0][0]`). The robot tries to move to the bottom-right corner (i.e., `grid[m - 1][n - 1]`). The robot can only move either down or right at any point in time. Given the two integers `m` and `n`, return the number of possible unique paths that the robot can take to reach the bottom-right corner.", "difficulty": "Medium", "tags": ["Dynamic Programming", "Math", "Combinatorics"], "constraints": "1 <= m, n <= 100"},
    
    # Greedy
    {"title": "Maximum Subarray", "description": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.", "difficulty": "Medium", "tags": ["Greedy", "Array", "Divide and Conquer", "Dynamic Programming"], "constraints": "1 <= nums.length <= 10^5"},
    {"title": "Jump Game", "description": "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return `true` if you can reach the last index, or `false` otherwise.", "difficulty": "Medium", "tags": ["Greedy", "Array", "Dynamic Programming"], "constraints": "1 <= nums.length <= 10^4"}
]

# Create a new session to interact with the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def seed_database():
    """
    Populates the database with the pre-defined problem set.
    """
    print("Starting to seed the database...")
    
    # Fetch all existing titles in one go for efficiency
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
            # --- IMPORTANT ---
            contributor_id=SYSTEM_USER_ID, # Assigning to the system user
            status="approved" # Approving so it can be used in matchmaking
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
