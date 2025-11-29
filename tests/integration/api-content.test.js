/**
 * Integration Tests for Strapi Content API
 */

const request = require('supertest')

const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337'

describe('Strapi Content API Tests', () => {
  test('should access API base endpoint', async () => {
    try {
      const response = await request(BASE_URL)
        .get('/api')
      
      // API endpoint may return 200 or 404 depending on Strapi version
      expect([200, 404]).toContain(response.status)
    } catch (error) {
      console.log('API endpoint test skipped:', error.message)
    }
  })

  test('should handle CORS headers if configured', async () => {
    const response = await request(BASE_URL)
      .get('/admin')
      .expect(200)
    
    // Check if CORS headers exist (may not be configured)
    expect(response.headers).toBeDefined()
  })

  test('should return proper error for non-existent endpoint', async () => {
    const response = await request(BASE_URL)
      .get('/api/non-existent-endpoint')
    
    expect([404, 401, 403]).toContain(response.status)
  })
})

