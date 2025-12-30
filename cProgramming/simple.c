#include <stdio.h>

int main()
{
    int a, b = 5;
    int i;

    for (a = 1; a <= b; ++a)
    {
        for (i = 1; i <= a; ++i)
        {
            printf("*");
        }
        printf("\n");
    }

    return 0;
}
