import math  # Fixed: Add this

num1 = float(input("insert the first number: "))
num2 = float(input("insert the second number: "))
operation = input("passIn the operation to perform: ").strip()  # Added strip()

if operation == "+":
    result = num1 + num2
elif operation == "-":  # Fixed order
    result = num1 - num2
elif operation == "*":
    result = num1 * num2
elif operation == "/":
    if num2 == 0:  # Fixed: Zero check
        result = "Cannot divide by zero!"
    else:
        result = num1 / num2
elif operation == "%":
    if num2 == 0:  # Fixed: Zero check
        result = "Cannot divide by zero!"
    else:
        result = num1 % num2
elif operation == "cos":
    result = math.cos(num1)  # Fixed: Use num1 only, proper 'and'
elif operation == "sin":
    result = math.sin(num1)
elif operation == "tan":
    result = math.tan(num1)
else:
    result = "invalid operation!"

print(result)
