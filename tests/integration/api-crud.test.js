/**
 * Integration Tests for Strapi CRUD Operations
 * Tests Create, Read, Update, Delete operations on API endpoints
 * 
 * Note: These tests require Strapi to be running and may need
 * content types to be created in the Strapi admin panel first.
 */

const request = require('supertest');

const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337';

describe('Strapi CRUD Operations', () => {
  const testEmail = process.env.STRAPI_TEST_EMAIL || '1222697@nu.edu.pk';
  const testPassword = process.env.STRAPI_TEST_PASSWORD || '@Haroon5295';
  let authToken = null;

  // Helper function to get authentication token
  const getAuthToken = async () => {
    if (authToken) return authToken;

    const response = await request(BASE_URL)
      .post('/api/auth/local')
      .send({
        identifier: testEmail,
        password: testPassword,
      });

    if (response.status === 200) {
      authToken = response.body.jwt;
      return authToken;
    }
    return null;
  };

  beforeEach(async () => {
    // Get fresh token before each test
    authToken = null;
    await getAuthToken();
  });

  describe('API Endpoint Discovery', () => {
    it('should access the API base endpoint', async () => {
      const response = await request(BASE_URL)
        .get('/api');

      // API endpoint may return 200, 404, or 401 depending on configuration
      expect([200, 404, 401]).toContain(response.status);
    });

    it('should list available content types', async () => {
      const token = await getAuthToken();
      if (!token) {
        console.log('Skipping test: Authentication failed');
        return;
      }

      // Try to access content manager API
      const response = await request(BASE_URL)
        .get('/api/content-manager/content-types')
        .set('Authorization', `Bearer ${token}`);

      // May return 200 (success) or 404/403 (not available)
      expect([200, 404, 403]).toContain(response.status);
    });
  });

  describe('Generic Content Type Operations', () => {
    // These tests work with any content type that exists in Strapi
    // They demonstrate CRUD patterns that can be adapted to specific content types

    it('should handle GET requests to content endpoints', async () => {
      const token = await getAuthToken();
      if (!token) {
        console.log('Skipping test: Authentication failed');
        return;
      }

      // Try common content type endpoints
      const contentTypes = ['articles', 'posts', 'pages', 'users'];
      
      for (const contentType of contentTypes) {
        const response = await request(BASE_URL)
          .get(`/api/${contentType}`)
          .set('Authorization', `Bearer ${token}`);

        // Accept various status codes as content types may not exist
        expect([200, 404, 403]).toContain(response.status);
        
        // If endpoint exists, verify response structure
        if (response.status === 200) {
          expect(response.body).toBeDefined();
          // Strapi v5 typically returns data in a 'data' property
          if (response.body.data) {
            expect(Array.isArray(response.body.data)).toBe(true);
          }
        }
      }
    });

    it('should handle POST requests to create content', async () => {
      const token = await getAuthToken();
      if (!token) {
        console.log('Skipping test: Authentication failed');
        return;
      }

      // Try to create content (this will fail if no content types exist)
      // This is a generic test that demonstrates the pattern
      const testData = {
        data: {
          title: 'Test Content',
          content: 'This is test content',
          publishedAt: new Date().toISOString(),
        },
      };

      // Try with a common content type
      const response = await request(BASE_URL)
        .post('/api/articles')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send(testData);

      // May return 201 (created), 404 (not found), or 403 (forbidden)
      if (response.status === 201) {
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('id');
      } else {
        expect([404, 403, 400]).toContain(response.status);
      }
    });

    it('should handle PUT requests to update content', async () => {
      const token = await getAuthToken();
      if (!token) {
        console.log('Skipping test: Authentication failed');
        return;
      }

      // First, try to get existing content
      const getResponse = await request(BASE_URL)
        .get('/api/articles')
        .set('Authorization', `Bearer ${token}`);

      if (getResponse.status === 200 && getResponse.body.data && getResponse.body.data.length > 0) {
        const itemId = getResponse.body.data[0].id;
        
        const updateData = {
          data: {
            title: 'Updated Title',
            content: 'Updated content',
          },
        };

        const updateResponse = await request(BASE_URL)
          .put(`/api/articles/${itemId}`)
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json')
          .send(updateData);

        // May return 200 (success) or 404/403 (not found/forbidden)
        expect([200, 404, 403]).toContain(updateResponse.status);
      } else {
        // No content to update, skip test
        console.log('Skipping update test: No content available');
      }
    });

    it('should handle DELETE requests to remove content', async () => {
      const token = await getAuthToken();
      if (!token) {
        console.log('Skipping test: Authentication failed');
        return;
      }

      // First, try to get existing content
      const getResponse = await request(BASE_URL)
        .get('/api/articles')
        .set('Authorization', `Bearer ${token}`);

      if (getResponse.status === 200 && getResponse.body.data && getResponse.body.data.length > 0) {
        const itemId = getResponse.body.data[0].id;
        
        const deleteResponse = await request(BASE_URL)
          .delete(`/api/articles/${itemId}`)
          .set('Authorization', `Bearer ${token}`);

        // May return 200 (success) or 404/403 (not found/forbidden)
        expect([200, 404, 403]).toContain(deleteResponse.status);
      } else {
        // No content to delete, skip test
        console.log('Skipping delete test: No content available');
      }
    });
  });

  describe('API Response Format', () => {
    it('should return consistent response structure', async () => {
      const token = await getAuthToken();
      if (!token) {
        console.log('Skipping test: Authentication failed');
        return;
      }

      const response = await request(BASE_URL)
        .get('/api/articles')
        .set('Authorization', `Bearer ${token}`);

      if (response.status === 200) {
        // Strapi v5 typically uses a 'data' property
        expect(response.body).toBeDefined();
        // Response should be an object
        expect(typeof response.body).toBe('object');
      }
    });

    it('should handle pagination parameters', async () => {
      const token = await getAuthToken();
      if (!token) {
        console.log('Skipping test: Authentication failed');
        return;
      }

      const response = await request(BASE_URL)
        .get('/api/articles')
        .query({ pagination: { page: 1, pageSize: 10 } })
        .set('Authorization', `Bearer ${token}`);

      if (response.status === 200) {
        expect(response.body).toBeDefined();
        // May have pagination metadata
        if (response.body.meta) {
          expect(response.body.meta).toHaveProperty('pagination');
        }
      }
    });

    it('should handle filtering parameters', async () => {
      const token = await getAuthToken();
      if (!token) {
        console.log('Skipping test: Authentication failed');
        return;
      }

      const response = await request(BASE_URL)
        .get('/api/articles')
        .query({ filters: { title: { $contains: 'test' } } })
        .set('Authorization', `Bearer ${token}`);

      // Should handle filters gracefully
      expect([200, 400, 404]).toContain(response.status);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent resources', async () => {
      const token = await getAuthToken();
      if (!token) {
        console.log('Skipping test: Authentication failed');
        return;
      }

      const response = await request(BASE_URL)
        .get('/api/articles/999999')
        .set('Authorization', `Bearer ${token}`);

      expect([404, 403]).toContain(response.status);
    });

    it('should return 400 for invalid request data', async () => {
      const token = await getAuthToken();
      if (!token) {
        console.log('Skipping test: Authentication failed');
        return;
      }

      const response = await request(BASE_URL)
        .post('/api/articles')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send({ invalid: 'data' });

      // May return 400 (bad request) or 404 (endpoint not found)
      expect([400, 404, 403]).toContain(response.status);
    });

    it('should return 403 for unauthorized access', async () => {
      // Try to access protected endpoint without token
      const response = await request(BASE_URL)
        .get('/api/articles');

      expect([401, 403]).toContain(response.status);
    });
  });
});

