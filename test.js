const {composer} = require('./index')
const {expect} = require('chai')

const a1 = [1, 2, 3, 4, 5]
const a2 = [6, 7, 8, 9, 10]
const a3 = [18, 20, 22, 24, 26, 28, 30]
const a4 = [54, 72]
const a5 = [36, 40, 44, 48, 52, 56, 60]
const sumVariableNumbers = (n) => (...i) => i.slice(0, n).reduce((c, n) => c + n, 0)
const doubleConditional = (conditionalNumber) => (a, b) => a * conditionalNumber === b
const evenConditional = (a, b) => a % 2 === 0 && b % 2 === 0
const greaterThanConditional = (conditionalNumber) => (a, b) => a >= conditionalNumber && b >= conditionalNumber
const compositeConditional = (multiplierNumber, greaterThanNumber) => {
  return (a, b) => {
    return doubleConditional(multiplierNumber)(a, b) &&
      greaterThanConditional(greaterThanNumber)(a, b) &&
      evenConditional(a, b)
  }
}

describe('Composer', () => {
  describe('Passing in a single configuration object', () => {
    it('expects a single configuration object as an argument', () => {
      const configOptions = {
        numbers: [a1, a2],
        outputFunc: sumVariableNumbers(2),
        conditionalFunc: doubleConditional(2),
      }
      const result = composer(configOptions)
      expect(result).to.be.an('array').that.includes(9, 12, 15)
    })
    it('expect an error to be throw if configuration object is missing a conditionalFunc property or is not a function', () => {
      const configOptions = {
        numbers: [a1, a2],
        outputFunc: sumVariableNumbers(2),
        // conditionalFunc: doubleConditional(2),
      }

      expect(function () {
        const result = composer(configOptions)
      }).to.throw(TypeError)

      expect(function () {
        const result = composer(Object.assign({}, configOptions, {
            conditionalFunc: 1
          })
        )
      }).to.throw(TypeError)
    })
    it('expect an error to be throw if configuration object is missing a outputFunc property or is not a function', () => {
      const configOptions = {
        numbers: [a1, a2],
        // outputFunc: sumVariableNumbers(2),
        conditionalFunc: doubleConditional(2),
      }

      expect(function () {
        const result = composer(configOptions)
      }).to.throw(TypeError)

      expect(function () {
        const result = composer(Object.assign({}, configOptions, {
            outputFunc: 1
          })
        )
      }).to.throw(TypeError)

    })
    it('expect an error to be throw if configuration object is missing a numbers property or is not an array', () => {
      const configOptions = {
        // numbers: [a1, a2],
        outputFunc: sumVariableNumbers(2),
        conditionalFunc: doubleConditional(2),
      }

      expect(function () {
        const result = composer(configOptions)
      }).to.throw(TypeError)
      expect(function () {
        const result = composer(Object.assign({}, configOptions, {
            numbers: 1
          })
        )
      }).to.throw(TypeError)
    })
    it('expects an empty array returned if numbers array only has a length of 1', () => {
      const configOptions = {
        numbers: [a1],
        outputFunc: sumVariableNumbers(2),
        conditionalFunc: doubleConditional(2),
      }
      expect(composer(configOptions)).to.be.an('array').that.is.empty
    })
  })

  describe('Passing in a comma-separated argument list', () => {
    it('expects comma-delimited arguments as an alternative', () => {
      const result = composer(doubleConditional(2), sumVariableNumbers(2), a1, a2)
      expect(result).to.be.an('array').that.includes(9, 12, 15)
    })
    it('expect an error to be throw if conditionalFunc not a function', () => {

      expect(function () {
        const result = composer(undefined, sumVariableNumbers(2), a1, a2)
      }).to.throw(TypeError)

      expect(function () {
        const result = composer(1, sumVariableNumbers(2), a1, a2)
      }).to.throw(TypeError)
    })
    it('expect an error to be throw if outputFunc not a function', () => {
      expect(function () {
        const result = composer(doubleConditional(2), undefined, a1, a2)
      }).to.throw(TypeError)

      expect(function () {
        const result = composer(doubleConditional(2), 1, a1, a2)
      }).to.throw(TypeError)

    })
    it('expect an error to be throw if numbers not an array', () => {
      expect(function () {
        const result = composer(doubleConditional(2), sumVariableNumbers(2), undefined)
      }).to.throw(TypeError)

      expect(function () {
        const result = composer(doubleConditional(2), sumVariableNumbers(2), 1)
      }).to.throw(TypeError)
    })
    it('expects an empty array returned if only a single array is passed at the 3rd argument (argument list ===3)', () => {
      expect(composer(doubleConditional(2), sumVariableNumbers(2), a1)).to.be.an('array').that.is.empty
    })
  })
  describe('Accuracy Test - conditionalFunc=(a * 2) === b | outputFunc=a+b', () => {
    it(`expects [[${a1}],[${a2}]] to equal [9,12,15] because 3+6=9, 4+8=12, and 5+10=15`, () => {
      const configOptions = {
        numbers: [a1, a2],
        outputFunc: sumVariableNumbers(2),
        conditionalFunc: doubleConditional(2),
      }
      const result = composer(configOptions)
      expect(result).to.be.an('array').to.have.members([9, 12, 15])
    })
    it(`expects [[${a1}],[${a2}],[${a3}]] to equal [27, 36,45] because 9+18=27, 12+24=36, and 15+30=45`, () => {
      const configOptions = {
        numbers: [a1, a2, a3],
        outputFunc: sumVariableNumbers(2),
        conditionalFunc: doubleConditional(2),
      }
      const result = composer(configOptions)
      // console.log('what is result', result)
      expect(result).to.be.an('array').to.have.members([27, 36, 45])
    })
    it(`expects [[${a1}],[${a2}],[${a3},[${a4}]]] to equal [81, 108] because 27+54=81, and 36+72=108`, () => {
      const configOptions = {
        numbers: [a1, a2, a3, a4],
        outputFunc: sumVariableNumbers(2),
        conditionalFunc: doubleConditional(2),
      }
      const result = composer(configOptions)
      expect(result).to.be.an('array').to.have.members([81, 108])
    })
  })
  describe('Accuracy Test - conditionalFunc= both a & b are [>=2, even, and a*2===b] | outputFunc=a+b', () => {
    it(`expects [[${a1}],[${a2}]] to equal [12] because 4+8=12`, () => {
      const configOptions = {
        numbers: [a1, a2],
        outputFunc: sumVariableNumbers(2),
        conditionalFunc: compositeConditional(2, 2),
      }
      const result = composer(configOptions)
      // console.log('what is result1', result)
      expect(result).to.be.an('array').to.have.members([12])
    })
  })
  describe('Accuracy Test - conditionalFunc= both a & b are [>=22, even, and a*2===b] | outputFunc=a+b', () => {
    it(`expects [[${a3}],[${a5}]] to equal [66,72,78,84,90] because 22+44=66, 24+48=72, 26+52=78, 28+56=84, 30+60=90`, () => {
      const configOptions = {
        numbers: [a3, a5],
        outputFunc: sumVariableNumbers(2),
        conditionalFunc: compositeConditional(2, 22),
      }
      const result = composer(configOptions)
      // console.log('what is result2', result)
      expect(result).to.be.an('array').to.have.members([66, 72, 78, 84, 90])
    })
  })
})