import time
password = input("Enter password: ")
start = time.time()
chars = "abcdefghifklmnopqrstuvwxyz"
guess = []
for val in range(5):
    a = [i for i in chars]
    for y in range(val):
        a= [x+i for i in chars for x in a]
    guess += a
    if password in guess:
        break
end = time.time()
clock = str(end - start)
print("your password: "+password)
print("time taken: "+clock)
    