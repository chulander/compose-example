'use strict'
function composer (config, outputFunc, ...numberArrays) {
  let configMissingProps
  const conditionalFunction = config && config.conditionalFunc ? config.conditionalFunc : config
  const outputFunction = config && config.outputFunc ? config.outputFunc : outputFunc
  const functionCallType = typeof config === 'object' ? 'configObject' : 'argumentList'


  ///////////////////////////////////////////////////////////
  // helper function  ///////////////////////////////////////
  ///////////////////////////////////////////////////////////
  const _reducerHelper = (array1, array2) => {
    return array1.reduce((c, n) => {
      return array2.reduce((cur, next) => {
        if (conditionalFunction(n, next)) {
          const output = outputFunction(n, next)
          cur.push(output)
        }
        return cur
      }, c)
    }, [])
  }

  ///////////////////////////////////////////////////////////
  // error handling start  //////////////////////////////////
  ///////////////////////////////////////////////////////////

  // checks if first parameter is an object
  if (typeof config === 'object') {
    if (!config.conditionalFunc || (config && typeof config.conditionalFunc !== 'function')) {
      configMissingProps = Object.assign({}, {
        conditionalFunc: 'missing or is not a function'
      })
    }
    if (!config.outputFunc || (config && typeof config.outputFunc !== 'function')) {
      configMissingProps = Object.assign({}, configMissingProps, {
        outputFunc: 'missing or is not a function'
      })
    }
    if (!config.numbers || (config && !Array.isArray(config.numbers))) {
      configMissingProps = Object.assign({}, configMissingProps, {
        numbers: 'missing or is not an array'
      })
    }

  }
  // assume that comma separated arguments were passed
  else {
    if (typeof config !== 'function') {
      configMissingProps = Object.assign({}, {
        conditionalFunc: '1st argument is missing or is not a function'
      })
    }
    if (typeof outputFunc !== 'function') {
      configMissingProps = Object.assign({}, configMissingProps, {
        outputFunc: '2nd argument is missing or is not a function'
      })
      // throw new TypeError(`composer: calling with argument list - Missing conditionalFunc and/or outputFunc argument`)
    }
    if (numberArrays && !Array.isArray(numberArrays[0])) {
      configMissingProps = Object.assign({}, configMissingProps, {
        numbers: '3rd argument is missing or is not an array'
      })
    }
  }

  // throw error if configMissingProps is truthy
  if (configMissingProps) {
    throw new TypeError(`composer: calling with ${functionCallType} - Missing required ${functionCallType === 'configObject' ? 'properties' : 'argument(s)'} ${JSON.stringify(configMissingProps)}`)
  }

  ///////////////////////////////////////////////////////////
  // logic handling  start  /////////////////////////////////
  ///////////////////////////////////////////////////////////

  // clone array to prevent mutation via pass-by-reference (it's a shallow copy)
  // since Javascript objects are by reference
  const cloneArrays = functionCallType === 'configObject' ? config.numbers.slice(0) : numberArrays.slice(0)

  // only run recursive iteration if there's at least 2 elements
  if (cloneArrays.length >= 2) {
    const array1 = cloneArrays.shift()
    const array2 = cloneArrays.shift()
    const resultArray = _reducerHelper(array1, array2)

    return (cloneArrays.length)
      ? functionCallType === 'configObject'
        ? composer(Object.assign({}, config, {
          numbers: [resultArray, ...cloneArrays]
        }))
        : composer(config, outputFunc, resultArray, ...cloneArrays)
      : resultArray
  }
  // returns empty array if there's only 1
  else {
    return []
  }
}

module.exports = {
  composer
}