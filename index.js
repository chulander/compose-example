'use strict'
function composer (config, outputFunc, ...numberArrays) {
  const conditionalFunction = config && config.conditionalFunc ? config.conditionalFunc : config
  const outputFunction = config && config.outputFunc ? config.outputFunc : outputFunc

  const _reducerHelper = (array1, array2) => {
    return array1.reduce((c, n) => {
      return array2.reduce((cur, next) => {
        if (conditionalFunction(n, next)) {
          // console.log("what is n", n)
          // console.log("what is next", next)
          const output = outputFunction(n, next)
          cur.push(output)
        }
        return cur
      }, c)
    }, [])
  }

  const functionCallType = typeof config === 'object' ? 'configObject' : 'argumentList'

  // checks if first parameter is an object
  if (typeof config === 'object') {
    let configMissingProps
    if (!config.conditionalFunc || (config && typeof config.conditionalFunc !== 'function')){
      configMissingProps = Object.assign({}, {
        conditionalFunc: 'missing or is not a function'
      })
    }
    if (!config.outputFunc || (config && typeof config.outputFunc !== 'function')){
      configMissingProps = Object.assign({}, configMissingProps, {
        outputFunc: 'missing or is not a function'
      })
    }
    if (!config.numbers || (config && !Array.isArray(config.numbers))) {
      configMissingProps = Object.assign({}, configMissingProps, {
        numbers: 'missing or is not an array'
      })
    }

    if (configMissingProps) {
      throw new TypeError(`composer: calling with config object - Missing required properties ${JSON.stringify(configMissingProps)}`)
    }

  }
  // assume that comma separated arguments were passed
  else {
    if (typeof config !== 'function' || typeof outputFunc !== 'function') {
      throw new TypeError(`composer: calling with argument list - Missing conditionalFunc and/or outputFunc argument`)
    }
    if (!Array.isArray(numberArrays[0])) {
      throw new TypeError(`composer: calling with argument list - 3rd argument is not an array`)
    }
  }

  const cloneArrays = functionCallType === 'configObject' ? config.numbers.slice(0) : numberArrays.slice(0)
  // console.log('what is cloneArray', cloneArrays)
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
  else {
    // returns empty array if there's only 1
    return []
  }
}

module.exports = {
  composer
}