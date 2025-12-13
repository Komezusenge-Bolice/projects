#include <stdio.h>
#include <stdlib.h> // Required for malloc and realloc
#include <stdbool.h> // Required for boolean type

// -------------------------------------------------------------------------
// Helper function to dynamically add an element (simulates array.push())
// -------------------------------------------------------------------------
int* array_push(int* arr, int* currentSize, int newValue) {
    // 1. Increase the size counter
    int newSize = *currentSize + 1;

    // 2. Reallocate memory for the new size (currentSize * sizeof(int) + 1 * sizeof(int))
    // We use a temporary pointer for safe reallocation
    int* temp = (int*)realloc(arr, newSize * sizeof(int));
    
    if (temp == NULL) {
        printf("Error: Memory reallocation failed.\n");
        return arr; // Return original array if reallocation fails
    }
    
    // 3. Update the array pointer and the size variable in the main function
    arr = temp;
    *currentSize = newSize;

    // 4. Add the new value to the last position
    arr[newSize - 1] = newValue; 

    return arr;
}

// -------------------------------------------------------------------------
// The main function (equivalent to JavaScript's 'divisors')
// -------------------------------------------------------------------------
int* divisors(int number, int* diVisorsLength) {
    // C arrays are not dynamic, so we start with NULL and 0 size, 
    // and rely on the push helper function for memory allocation.
    int* diVisors = NULL; 
    *diVisorsLength = 0; // The length must be tracked by a pointer

    // Equivalent to: for(let i = 1; i <= number; ++i)
    for (int i = 1; i <= number; ++i) {
        // Equivalent to: number % i == 0 ? diVisors.push(i) : null;
        if (number % i == 0) {
            diVisors = array_push(diVisors, diVisorsLength, i);
        }
    }
    
    // -------------------------------------------------------------------------
    // Equivalent to the nested 'bolice' function logic
    // -------------------------------------------------------------------------
    
    // Equivalent to: let bob = diVisors.length;
    int bob = *diVisorsLength; 
    
    // Equivalent to the ternary and console.log(primalityResult);
    if (bob != 2) {
        printf("%d is not a prime.\n", number);
    } else {
        printf("%d is a prime .\n", number);
    }
    
    // No direct equivalent to 'bolice()' call needed, as logic is executed above.

    // Equivalent to: return diVisors;
    return diVisors;
}

// -------------------------------------------------------------------------
// Main function where execution starts
// -------------------------------------------------------------------------
int main() {
    int testNumber = 8998465; 
    int divisorCount; // Variable to receive the size of the returned array
    
    printf("Processing: %d\n", testNumber);
    
    // Call the function and get the pointer to the array and the count
    int* resultDivisors = divisors(testNumber, &divisorCount);

    // Print the final list of divisors
    printf("Divisors found: ");
    for (int i = 0; i < divisorCount; i++) {
        printf("%d", resultDivisors[i]);
        if (i < divisorCount - 1) {
            printf(", ");
        }
    }
    printf("\n");

    // Clean up dynamically allocated memory
    free(resultDivisors);

    return 0;
}