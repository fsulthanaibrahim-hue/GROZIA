# spike1_tool_calling.py

# 1. Fake database tools
def sales_comparison(product):
    return {"product": product, "this_week": 150, "last_week": 300, "change": "-50%"}

def stock_status(product):
    return {"product": product, "current_stock": 0, "days_out_of_stock": 4}

# 2. Fake AI Brain
class FakeLLM:
    def __init__(self):
        self.step = 0

    def generate(self, prompt):
        self.step += 1
        
        if self.step == 1:
            return {"tool": "sales_comparison", "args": {"product": "Milk"}}
        elif self.step == 2:
            return {"tool": "stock_status", "args": {"product": "Milk"}}
        else:
            return {"tool": "final_answer", "args": {"text": "Sales for Milk dropped by 50% because it was out of stock for 4 days."}}

# 3. The Agent Loop
def run_agent():
    llm = FakeLLM()
    max_steps = 8
    step = 0
    
    print("Starting Agent...")
    print("User: Sales dropped this week. Why?")
    
    while step < max_steps:
        step += 1
        response = llm.generate("Sales dropped this week. Why?")
        tool_name = response["tool"]
        
        # TODO 1: Final Answer
        if tool_name == "final_answer":
            print("\nAI Final Answer:", response["args"]["text"])
            break
            
        # TODO 2: Check Sales
        elif tool_name == "sales_comparison":
            product_name = response["args"]["product"]
            result = sales_comparison(product_name)
            print(f"Step {step}: AI called sales_comparison for {product_name} -> {result}")
            
        # TODO 3: Check Stock
        elif tool_name == "stock_status":
            product_name = response["args"]["product"]
            result = stock_status(product_name)
            print(f"Step {step}: AI called stock_status for {product_name} -> {result}")

run_agent()