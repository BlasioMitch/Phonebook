const average = require('../utils/for_testing').average

describe('average ', () => {
    test(' of one value is the value itself ',() => {
        expect(average([1])).toBe(1)
    })
    test('of many values to be right ', () => {
        expect(average([1,2,3,4,5])).toBe(3)
    })
    test('of an empty array to be zero', () => {
        expect(average([])).toBe(0)
    })
})