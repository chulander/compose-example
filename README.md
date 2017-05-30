# Functional Programming - Compose
### Composer
The composer object accepts the following proper names and value types:
1. conditionalFunc: function (a,b) that applies a condition on a & b arguments
2. outputFunc: function (a,b) that applies an aggregation on a & b arguments
3. numbers: array of [numbers]

You may call the composer with the following signature
composer(configurationObject) or composer(conditionalFunc,outputFunc, array1,array2, ...arrayN)
   
```javascript 1.8
const {composer} = require('./index')

const a1 = [1, 2, 3, 4, 5]
const a2 = [6, 7, 8, 9, 10]
const sumVariableNumbers = (conditionalNumber) => (...i) => i.slice(0, conditionalNumber).reduce((c, n) => c + n, 0)
const multipleConditional = (conditionalNumber) => (a, b) => a * conditionalNumber === b

// configuration object way
const configOptions = {
    numbers: [a1, a2],
    outputFunc: sumVariableNumbers(2),
    conditionalFunc: multipleConditional(2),
}
const result = composer(configOptions)


// argument list way
const result2 = composer(multipleConditional(2), sumVariableNumbers(2), a1,a2)
```

"npm run test" to see some examples 