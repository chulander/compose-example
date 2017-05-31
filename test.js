const {composer} = require('./index')
const {expect} = require('chai')

const a1 = [1, 2, 3, 4, 5]
const a2 = [6, 7, 8, 9, 10]
const a3 = [18, 20, 22, 24, 26, 28, 30]
const a4 = [36, 40, 44, 48, 52, 56, 60]

const b1 = [4, 6, 10]
const b2 = [8, 12, 20]
const b3 = [16, 24, 40]
const b4 = [32, 48, 80]
const sumVariableNumbers = (conditionalNumber) => {
  return (...i) => {
    return i.slice(0, conditionalNumber).reduce((c, n) => {
      return c + n
    }, 0)
  }
}
const multipleConditional = (conditionalNumber) => {
  return (...i) => {
    return i.slice(0).reduce((c, n, index) => {
      return (index === 0 || c * conditionalNumber === n) ? n : false
    })
  }
}

const evenConditional = (a, b) => a % 2 === 0 && b % 2 === 0
const greaterThanConditional = (conditionalNumber) => (a, b) => a >=
conditionalNumber && b >= conditionalNumber
const compositeConditional = (multiplierNumber, greaterThanNumber) => {
  return (a, b) => {
    return multipleConditional(multiplierNumber)(a, b) &&
      greaterThanConditional(greaterThanNumber)(a, b) &&
      evenConditional(a, b)
  }
}

describe('Composer', () => {
  describe('Error Handling: typeError', () => {
    describe('Passing Configuration Object', () => {
      it('if conditionalFunc property missing / is not a function', () => {
        const configOptions = {
          numbers: [a1, a2],
          outputFunc: sumVariableNumbers(2),
          // conditionalFunc: multipleConditional(2),
        }
        expect(function () {
          const result = composer(configOptions)
        }).to.throw(TypeError)

        expect(function () {
          const configObj = Object.assign({}, configOptions, {
            conditionalFunc: 1,
          })
          const result = composer(configObj)
        }).to.throw(TypeError)
      })
      it('if outputFunc property is missing / or is not a function', () => {
        const configOptions = {
          numbers: [a1, a2],
          // outputFunc: sumVariableNumbers(2),
          conditionalFunc: multipleConditional(2),
        }
        expect(function () {
          const result = composer(configOptions)
        }).to.throw(TypeError)

        expect(function () {
          const configObj = Object.assign({}, configOptions, {
            outputFunc: 1,
          })
          const result = composer(configObj)
        }).to.throw(TypeError)
      })
      it('numbers property is missing / or is not an array', () => {
        const configOptions = {
          // numbers: [a1, a2],
          outputFunc: sumVariableNumbers(2),
          conditionalFunc: multipleConditional(2),
        }

        expect(function () {
          const result = composer(configOptions)
        }).to.throw(TypeError)

        expect(function () {
          const configObj = Object.assign({}, configOptions, {
            numbers: 1,
          })
          const result = composer(configObj)
        }).to.throw(TypeError)
      })
    })
    describe('Passing Argument List', () => {
      it('if argument #1 is missing / not a function', () => {

        expect(function () {
          const result = composer(undefined, sumVariableNumbers(2), a1, a2)
        }).to.throw(TypeError)

        expect(function () {
          const result = composer(1, sumVariableNumbers(2), a1, a2)
        }).to.throw(TypeError)
      })
      it('if argument #2 is missing / not a function', () => {
        expect(function () {
          const result = composer(multipleConditional(2), undefined, a1, a2)
        }).to.throw(TypeError)

        expect(function () {
          const result = composer(multipleConditional(2), 1, a1, a2)
        }).to.throw(TypeError)

      })
      it('if argument #3 is missing / not an array', () => {
        expect(function () {
          const result = composer(multipleConditional(2), sumVariableNumbers(2),
            undefined)
        }).to.throw(TypeError)

        expect(function () {
          const result = composer(multipleConditional(2), sumVariableNumbers(2),
            1)
        }).to.throw(TypeError)
      })
    })
  })
  describe('Argument Signature', () => {
    it('expects a single configuration object as an argument', () => {
      const configOptions = {
        numbers: [a1, a2],
        outputFunc: sumVariableNumbers(2),
        conditionalFunc: multipleConditional(2),
      }
      const result = composer(configOptions)
      expect(result).to.be.an('array').have.members([9, 12, 15])
    })
    it('expects comma-delimited arguments as an alternative', () => {
      const result = composer(multipleConditional(2), sumVariableNumbers(2), a1,
        a2)
      expect(result).to.be.an('array').that.includes(9, 12, 15)
    })
  })
  describe('Default Returned Value', () => {
    describe('Passing Configuration Object', () => {

      it('result array === input array[0] if array.length === 1', () => {
        const configOptions = {
          numbers: [a1],
          outputFunc: sumVariableNumbers(2),
          conditionalFunc: multipleConditional(2),
        }
        expect(composer(configOptions)).to.be.an('array').have.members(a1)
      })
    })

    describe('Passing Argument List', () => {
      it('result array === 3rd argument if arity ===3', () => {
        const result = composer(
          multipleConditional(2),
          sumVariableNumbers(2),
          a1)
        expect(result).to.be.an('array').have.members(a1)
      })
    })
  })
  describe('Accuracy Test', () => {
    describe('conditionalFunc=(a * 2) === b | outputFunc=a+b', () => {
      describe('comparing 2 arrays', () => {
        it(`[ [${a1}],[${a2}] ] === [9,12,15]`, () => {
          const configOptions = {
            numbers: [a1, a2],
            outputFunc: sumVariableNumbers(2),
            conditionalFunc: multipleConditional(2),
          }
          const result = composer(configOptions)
          expect(result).to.be.an('array').to.have.members([9, 12, 15])
        })
      })
      describe('comparing 3 arrays', () => {
        it(`[ [ ${b1}],[${b2}],[${b3}] ] === [28, 42, 70]`, () => {
          const configOptions = {
            numbers: [b1, b2, b3],
            outputFunc: sumVariableNumbers(3),
            conditionalFunc: multipleConditional(2),
          }
          const result = composer(configOptions)
          // console.log('what is result', result)
          expect(result).to.be.an('array').to.have.members([28, 42, 70])
        })
      })
      describe('comparing 4 arrays', () => {
        it(`[ [${b1}],[${b2}],[${b3},[${b4}] ] === [60, 90, 150]`, () => {
          const configOptions = {
            numbers: [b1, b2, b3, b4],
            outputFunc: sumVariableNumbers(4),
            conditionalFunc: multipleConditional(2),
          }
          const result = composer(configOptions)
          expect(result).to.be.an('array').to.have.members([60, 90, 150])
        })
      })
    })
    describe('conditionalFunc=[>=2, even, a*2===b] | outputFunc=a+b', () => {
      it(`[ [${a1}],[${a2}] ] === [12]`, () => {
        const configOptions = {
          numbers: [a1, a2],
          outputFunc: sumVariableNumbers(2),
          conditionalFunc: compositeConditional(2, 2),
        }
        const result = composer(configOptions)
        expect(result).to.be.an('array').to.have.members([12])
      })
    })
    describe('conditionalFunc=[>=22, even, a*2===b] | outputFunc=a+b', () => {
      it(`[ [${a3}],[${a4}] ] === [66,72,78,84,90]`, () => {
        const configOptions = {
          numbers: [a3, a4],
          outputFunc: sumVariableNumbers(2),
          conditionalFunc: compositeConditional(2, 22),
        }
        const result = composer(configOptions)
        // console.log('what is result2', result)
        expect(result).to.be.an('array').to.have.members([66, 72, 78, 84, 90])
      })
    })
  })

})