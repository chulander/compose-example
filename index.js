'use strict'
function composer (config, outputFunc, ...numberArrays) {
  let configMissingProps
  const conditionalFunction = config && config.conditionalFunc
    ? config.conditionalFunc
    : config
  const outputFunction = config && config.outputFunc
    ? config.outputFunc
    : outputFunc
  const functionCallType = typeof config === 'object'
    ? 'configObject'
    : 'argumentList'

  ///////////////////////////////////////////////////////////
  // error handling start  //////////////////////////////////
  ///////////////////////////////////////////////////////////

  // checks if first parameter is an object
  if (typeof config === 'object') {
    if (!config.conditionalFunc ||
      (config && typeof config.conditionalFunc !== 'function')) {
      configMissingProps = Object.assign({}, {
        conditionalFunc: 'missing or is not a function',
      })
    }
    if (!config.outputFunc ||
      (config && typeof config.outputFunc !== 'function')) {
      configMissingProps = Object.assign({}, configMissingProps, {
        outputFunc: 'missing or is not a function',
      })
    }
    if (!config.numbers || (config && !Array.isArray(config.numbers))) {
      configMissingProps = Object.assign({}, configMissingProps, {
        numbers: 'missing or is not an array',
      })
    }
  }
  else {
    // assume that comma separated arguments were passed
    if (typeof config !== 'function') {
      configMissingProps = Object.assign({}, {
        conditionalFunc: '1st argument is missing or is not a function',
      })
    }
    if (typeof outputFunc !== 'function') {
      configMissingProps = Object.assign({}, configMissingProps, {
        outputFunc: '2nd argument is missing or is not a function',
      })
      // throw new TypeError(`composer: calling with argument list - Missing conditionalFunc and/or outputFunc argument`)
    }
    if (numberArrays && !Array.isArray(numberArrays[0])) {
      configMissingProps = Object.assign({}, configMissingProps, {
        numbers: '3rd argument is missing or is not an array',
      })
    }
  }

  // throw error if configMissingProps is truthy
  if (configMissingProps) {
    throw new TypeError(
      `composer: calling with ${functionCallType} - Missing required ${functionCallType ===
      'configObject' ? 'properties' : 'argument(s)'} ${JSON.stringify(
        configMissingProps)}`)
  }

  ///////////////////////////////////////////////////////////
  // logic handling  start  /////////////////////////////////
  ///////////////////////////////////////////////////////////

  // clone array to prevent mutation via pass-by-reference (it's a shallow copy)
  // since Javascript objects are by reference
  const cloneArrays = functionCallType === 'configObject'
    ? config.numbers.slice(0)
    : numberArrays.slice(0)

  const initialValue = config.initialValue || []

  // only run recursive iteration if there's at least 1 element
  if (cloneArrays.length) {
    const array = cloneArrays.shift()
    return array.reduce((c, n) => {
      if (cloneArrays.length) {
        // standardize recursive call to use configObj pattern
        const baseConfig = functionCallType === 'configObject'
          ? config
          : {
            conditionalFunc: conditionalFunction,
            outputFunc: outputFunction,
          }
        const configObj = {
          numbers: cloneArrays,
          initialValue: [...initialValue, n],
        }

        const result = composer(Object.assign({}, baseConfig, configObj))
        c.push(...result)
      }
      else {
        if (conditionalFunction(...initialValue, n)) {
          const result = outputFunction(...initialValue, n)
          c.push(result)
        }
      }
      return c
    }, [])
  }
  else {
    // returns empty array if there's no element
    return []
  }
}

module.exports = {
  composer,
}

const b1 = [4, 6, 10]
const b2 = [8, 12, 20]
const b3 = [16, 24, 40]
const b4 = [32, 48, 80]
const sumVariableNumbers = (conditionalNumber) => (...i) => i.slice(0,
  conditionalNumber).reduce((c, n) => c + n, 0)
const multipleConditional = (conditionalNumber) => (...i) => i.slice(0).
reduce((c, n, index) => {
  return (index === 0 || c * conditionalNumber === n) ? n : false
})

const r = composer({
  conditionalFunc: multipleConditional(2),
  outputFunc: sumVariableNumbers(4),
  numbers: [b1, b2, b3, b4],
})

console.log('what is r', r)