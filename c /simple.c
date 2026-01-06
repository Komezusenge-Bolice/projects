#include <stdio.h>
int main()
{
    int arr[5] = {10, 20, 30, 40, 50};
    int *ptr = arr;

    printf("Address of arr[0]: %p\n", (void *)&arr[0]);
    printf("Address of arr[1]: %p\n", (void *)&arr[1]);
    printf("Address of arr[2]: %p\n", (void *)&arr[2]);
    printf("Address of arr[3]: %p\n", (void *)&arr[3]);
    printf("Address of arr[4]: %p\n", (void *)&arr[4]);

    printf("\nUsing pointer arithmetic:\n");
    for (int i = 0; i < 5; i++)
    {
        printf("Address of arr[%d]: %p\n", i, (void *)(ptr + i));
    }

    return 0;
}