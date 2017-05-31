# Functional Programming - Compose
## Description

The *composer* function compares an array of numbers to other arrays of numbers and aggregates the passing individual number into a result array

For example, if you have 3 arrays **[ 2,6,8 ]**, **[ 4,10,12 ]**, **[ 8,16,24 ]** and want to add only numbers from each array that is 2x the value of the previous number, the resulting array is **[ 14,42 ]** because 2+4+8=14 and 6+12+24 = 42 


##Usage
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
4. **array2**: array of numbers, ie. [6,7,8,9,10]
5. **arrayN**: array of numbers, ie. [11,12,13,14,15]

I recommend passing in an nested array of numbers and using [ES6's spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) such as:
```javascript 1.8
const array1=[1,2,3,4,5]
const array2=[6,7,8,9,10]
const array3=[11,12,13,14,15]

composer(conditionalFunc,outputFunc, ...[array1, array2, array3])

```

## Examples
### Passing a configuration object
   
```javascript
const {composer} = require('./index')
const sumVariableNumbers = (conditionalNumber) => (...i) => i.slice(0, conditionalNumber).reduce((c, n) => c + n, 0)

const multipleConditional = (conditionalNumber) => {
  return (...i) => {
    return i.slice(0).reduce((c, n, index) => {
      return (index === 0 || c * conditionalNumber === n) ? n : false
    })
  }
}


const a1 = [1, 2, 3, 4, 5]
const a2 = [6, 7, 8, 9, 10]

const configOptions = {
    numbers: [a1, a2],
    outputFunc: sumVariableNumbers(2),
    conditionalFunc: multipleConditional(2),
}
const result = composer(configOptions)
console.log('result', result) // [9, 12, 15]

```

### Passing a comma-separated argument list
```javascript
const {composer} = require('./index')
const sumVariableNumbers = (conditionalNumber) => (...i) => i.slice(0, conditionalNumber).reduce((c, n) => c + n, 0)

const multipleConditional = (conditionalNumber) => {
  return (...i) => {
    return i.slice(0).reduce((c, n, index) => {
      return (index === 0 || c * conditionalNumber === n) ? n : false
    })
  }
}


const b1 = [4, 6, 10]
const b2 = [8, 12, 20]
const b3 = [16, 24, 40]
const b4 = [32, 48, 80]

const result = composer(multipleConditional(2), sumVariableNumbers(4), b1, b2, b3, b4)
console.log('result', result) // [60, 90, 150]

```
## Testing
type "npm run test" in the project root directory to see some examples 