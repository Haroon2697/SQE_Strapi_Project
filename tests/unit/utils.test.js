/**
 * Unit Tests for Utility Functions
 */

describe('Utility Functions', () => {
  test('should validate email format', () => {
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    expect(isValidEmail('admin@strapi.io')).toBe(true)
    expect(isValidEmail('invalid-email')).toBe(false)
    expect(isValidEmail('test@domain')).toBe(false)
  })

  test('should format date correctly', () => {
    const formatDate = (date) => {
      return new Date(date).toISOString().split('T')[0]
    }

    const testDate = new Date('2024-01-15')
    expect(formatDate(testDate)).toBe('2024-01-15')
  })

  test('should sanitize string input', () => {
    const sanitizeInput = (input) => {
      return input.trim().replace(/[<>]/g, '')
    }

    expect(sanitizeInput('  test  ')).toBe('test')
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script')
  })
})

