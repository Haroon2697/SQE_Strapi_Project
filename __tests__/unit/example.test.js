// __tests__/unit/example.test.js
const { sum } = require('../../utils/math');

describe('Math Utilities', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
