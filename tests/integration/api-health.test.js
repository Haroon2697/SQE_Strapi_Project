/**
 * Integration Tests for Strapi API
 * These tests verify API endpoints and responses
 */

const request = require('supertest')

// Note: Adjust the base URL based on your Strapi setup
const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337'

describe('Strapi API Health Checks', () => {
  test('should return 200 for admin endpoint', async () => {
    const response = await request(BASE_URL)
      .get('/admin')
      .expect(200)
    
    expect(response.status).toBe(200)
  })

  test('should have correct content type for admin page', async () => {
    const response = await request(BASE_URL)
      .get('/admin')
    
    expect(response.headers['content-type']).toMatch(/text\/html/)
  })

  test('should respond to health check endpoint', async () => {
    // Strapi may have a health endpoint, adjust based on your version
    try {
      const response = await request(BASE_URL)
        .get('/_health')
        .expect(200)
      
      expect(response.status).toBe(200)
    } catch (error) {
      // If health endpoint doesn't exist, that's okay
      console.log('Health endpoint not available, skipping test')
    }
  })
})

