function divisors(number){
var diVisors = [];

    for(let i = 1; i<=number; ++i){
        number%i == 0 
        ? diVisors.push(i)
        : null;
    }
    // function to check whether the given number is a prime or not .
    const bolice = () => { 
        let bob = diVisors.length;
        
        const primalityResult = bob != 2 
            ? `${number} is not a prime.`
            : `${number} is a prime .`;
        
        console.log(primalityResult); 
    };
    
    bolice();
    
    return diVisors;
}

console.log(divisors(8998465));