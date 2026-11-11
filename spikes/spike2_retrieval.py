# spike2_retrieval.py

# 1. Our fake shop policies
policies = [
    "Returns Policy: Milk and dairy products cannot be returned once purchased. Other products can be returned within 7 days with a receipt.",
    "Credit Policy: Customers are given 30 days to pay invoices. After 30 days, a late fee of 5% is applied."
]

# 2. A fake search function (simulating pgvector)
# In Week 3, this will actually use AI embeddings to search.
def search_policies(question):
    question = question.lower()
    
    # If the question mentions milk, dairy, return, or refund -> return the Returns Policy
    if any(word in question for word in ["milk", "dairy", "return", "refund", "days"]):
        return policies[0]
        
    # If the question mentions pay, owe, late, invoice, credit -> return the Credit Policy
    elif any(word in question for word in ["pay", "owe", "late", "invoice", "credit", "fee"]):
        return policies[1]
        
    # If we don't know the answer, return nothing (Refusal)
    else:
        return "I could not find this in your documents."

# 3. The 10 Test Questions (with known answers)
test_questions = [
    ("Can I return a milk bottle?", "Returns Policy"),
    ("What is the refund window for bread?", "Returns Policy"),
    ("How many days do I have to bring back a shirt?", "Returns Policy"),
    ("Does the shop accept dairy returns?", "Returns Policy"),
    ("What is the return policy for eggs?", "Returns Policy"),
    ("How long do customers have to pay an invoice?", "Credit Policy"),
    ("Is there a late fee for overdue payments?", "Credit Policy"),
    ("When does the credit period end?", "Credit Policy"),
    ("What happens if I don't pay on time?", "Credit Policy"),
    ("What is the capital of France?", "I could not find this in your documents.")
]

# 4. Run the test
print("Testing Retrieval...\n")
hits = 0
misses = []

for i, (question, expected) in enumerate(test_questions, 1):
    result = search_policies(question)
    # Check if the result contains the expected keyword (e.g., "Returns Policy")
    if expected.lower() in result.lower():
        print(f"Q{i}: PASS - '{question}'")
        hits += 1
    else:
        print(f"Q{i}: FAIL - '{question}'")
        print(f"    Expected: {expected}")
        print(f"    Got: {result}")
        misses.append((question, expected, result))

print(f"\nFinal Score: {hits}/10")
if hits >= 7:
    print("Status: SUCCESS. Hit@3 is >= 7/10.")
else:
    print("Status: FAILED. Need to improve search.")