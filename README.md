# Functional Programming - Compose
### Composer
The composer object accepts following:
1. conditionalFunc (a function with (a,b) arguments that applies some condition)
2. outputFunc (a function with (a,b) arguments that aggregates the two)
3. numbers (an array of numbers)

You may call the composer with the following signature
composer(configurationObject) or composer(conditionalFunc,outputFunc, array1,array2, arrayN......)

If a configuration object is passed, the properties must be as follows:
   1. outputFunc (function with (a,b) arguments)
   2. conditionalFunc (function with (a,b) arguments)
   3. numbers (array)
   
```javascript 1.8
const {composer} = require('./index')

const a1 = [1, 2, 3, 4, 5]
const a2 = [6, 7, 8, 9, 10]
const sumVariableNumbers = (n) => (...i) => i.slice(0, n).reduce((c, n) => c + n, 0)
const doubleConditional = (conditionalNumber) => (a, b) => a * conditionalNumber === b

// configuration object way
const configOptions = {
    numbers: [a1, a2],
    outputFunc: sumVariableNumbers(2),
    conditionalFunc: doubleConditional(2),
}
const result = composer(configOptions)


// argument list way
const result2 = composer(doubleConditional(2), sumVariableNumbers(2), a1,a2)
```