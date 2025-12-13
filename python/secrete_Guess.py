import random

secret = random.randint(1, 100)  # Step 1
attempts = 0
max_attempts = 7

print("Guess my number (1-100)! You have 7 tries.")

while attempts < max_attempts:  # Step 2
    try:
        guess = int(input(f"Attempt {attempts+1}: "))  # Step 3
        attempts += 1
        
        if guess == secret:  # Step 4
            print(f"You win in {attempts} tries! It was {secret}")
            break
        elif guess < secret:
            print("Too low!")
        else:
            print("Too high!")
    except ValueError:
        print("Enter a number!")

else:  # No more attempts
    print(f"Game over! Secret was {secret}")
