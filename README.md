# Functional Programming - Compose
## Composer

You may call the composer with the 1 of the 2 signatures:
1. composer(configurationObject)
2. composer(conditionalFunc, outputFunc, array1, array2, ...arrayN)

If passing a configuration object, the following property names and value types **are expected**:
1. **conditionalFunc**: function (a,b) that applies a condition on a & b arguments
2. **outputFunc**: function (a,b) that applies an aggregation on a & b arguments
3. **numbers**: array with elements that are an array of numbers, ie. [ [1,2,3,4,5], [6,7,8,9,10] ]

If passing an argument list, the follow argument order and types are expected:
1. **conditionalFunc**: function (a,b) that applies a condition on a & b arguments
2. **outputFunc**: function (a,b) that applies an aggregation on a & b arguments
3. **array1**: array of numbers, ie. [1,2,3,4,5]
4. **array2**: array of numbers, ie. [1,2,3,4,5]

note, I recommend passing in an nested array of numbers and using [ES6's spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) such as:
```javascript 1.8
const array1=[1,2,3,4,5]
const array2=[6,7,8,9,10]
const array3=[11,12,13,14,15]
composer(conditionalFunc,outputFunc, ...[array1,array2,array3])
```

## Examples
### Passing a configuration object
   
```javascript 1.8
const {composer} = require('./index')

const a1 = [1, 2, 3, 4, 5]
const a2 = [6, 7, 8, 9, 10]
const sumVariableNumbers = (conditionalNumber) => (...i) => i.slice(0, conditionalNumber).reduce((c, n) => c + n, 0)
const multipleConditional = (conditionalNumber) => (a, b) => a * conditionalNumber === b

const configOptions = {
    numbers: [a1, a2],
    outputFunc: sumVariableNumbers(2),
    conditionalFunc: multipleConditional(2),
}
const result = composer(configOptions)

```

### Passing a comma-separated argument list
```javascript 1.8
const {composer} = require('./index')

const a1 = [1, 2, 3, 4, 5]
const a2 = [6, 7, 8, 9, 10]

const result2 = composer(multipleConditional(2), sumVariableNumbers(2), a1, a2)

```
## Testing
type "npm run test" in the project root directory to see some examples 