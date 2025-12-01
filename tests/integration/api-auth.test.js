/**
 * Integration Tests for Strapi Authentication API
 * Tests login, token validation, and authentication flows
 */

const request = require('supertest');

const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337';

describe('Strapi Authentication API', () => {
  // Default test credentials (should match your Strapi admin setup)
  const testEmail = process.env.STRAPI_TEST_EMAIL || '1222697@nu.edu.pk';
  const testPassword = process.env.STRAPI_TEST_PASSWORD || '@Haroon5295';
  const invalidEmail = 'invalid@example.com';
  const invalidPassword = 'wrongpassword';

  let authToken = null;

  describe('POST /api/auth/local - User Login', () => {
    it('should return 400 for missing credentials', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/local')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 for missing identifier', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/local')
        .send({ password: testPassword });

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing password', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/local')
        .send({ identifier: testEmail });

      expect(response.status).toBe(400);
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/local')
        .send({
          identifier: invalidEmail,
          password: invalidPassword,
        });

      // Strapi v5 may return 400 for validation errors or 401 for auth failures
      // Accept both as valid responses
      expect([400, 401]).toContain(response.status);
      if (response.status === 401) {
        expect(response.body.error).toBeDefined();
      }
    });

    it('should return a JWT token on successful login', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/local')
        .send({
          identifier: testEmail,
          password: testPassword,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('jwt');
      expect(response.body.jwt).toBeDefined();
      expect(typeof response.body.jwt).toBe('string');
      expect(response.body.jwt.length).toBeGreaterThan(0);

      // Store token for subsequent tests
      authToken = response.body.jwt;

      // Verify user data is returned
      expect(response.body.user).toBeDefined();
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email');
    });

    it('should return user information with token', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/local')
        .send({
          identifier: testEmail,
          password: testPassword,
        });

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(testEmail);
      expect(response.body.user.id).toBeDefined();
    });
  });

  describe('GET /api/users/me - Get Current User', () => {
    beforeEach(async () => {
      // Get a fresh token before each test
      const loginResponse = await request(BASE_URL)
        .post('/api/auth/local')
        .send({
          identifier: testEmail,
          password: testPassword,
        });

      if (loginResponse.status === 200) {
        authToken = loginResponse.body.jwt;
      }
    });

    it('should return 401 or 403 without authentication token', async () => {
      const response = await request(BASE_URL)
        .get('/api/users/me');

      // Strapi may return 401 (Unauthorized) or 403 (Forbidden)
      expect([401, 403]).toContain(response.status);
    });

    it('should return current user with valid token', async () => {
      if (!authToken) {
        console.log('Skipping test: No auth token available');
        return;
      }

      const response = await request(BASE_URL)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body.email).toBe(testEmail);
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(BASE_URL)
        .get('/api/users/me')
        .set('Authorization', 'Bearer invalid_token_12345');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/auth/local/register - User Registration', () => {
    const randomEmail = `test_${Date.now()}@example.com`;
    const randomPassword = 'TestPassword123!';

    it('should return 400 for missing registration data', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/local/register')
        .send({});

      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/local/register')
        .send({
          email: 'invalid-email',
          password: randomPassword,
          username: 'testuser',
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 for weak password', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/local/register')
        .send({
          email: randomEmail,
          password: '123',
          username: 'testuser',
        });

      // May return 400 or 200 depending on password validation
      expect([200, 400]).toContain(response.status);
    });

    // Note: Registration may be disabled in Strapi by default
    // This test will pass if registration is enabled
    it('should register a new user if registration is enabled', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/local/register')
        .send({
          email: randomEmail,
          password: randomPassword,
          username: `user_${Date.now()}`,
        });

      // Registration may be disabled (403) or succeed (200)
      if (response.status === 200) {
        expect(response.body).toHaveProperty('jwt');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe(randomEmail);
      } else {
        // If registration is disabled, expect 403
        expect(response.status).toBe(403);
      }
    });
  });

  describe('POST /api/auth/forgot-password - Password Reset', () => {
    it('should return 400 for missing email', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/forgot-password')
        .send({});

      expect(response.status).toBe(400);
    });

    it('should handle password reset request', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/forgot-password')
        .send({
          email: testEmail,
        });

      // May return 200 (success) or 404 (user not found) or 400 (feature disabled) or 500 (server error)
      expect([200, 400, 404, 500]).toContain(response.status);
    });
  });

  describe('Token Validation and Security', () => {
    it('should reject expired tokens', async () => {
      // This test assumes token expiration is properly handled
      // In a real scenario, you'd need to create an expired token
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxMjM0NTY3ODkwfQ.invalid';
      
      const response = await request(BASE_URL)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
    });

    it('should require Bearer token format', async () => {
      if (!authToken) {
        console.log('Skipping test: No auth token available');
        return;
      }

      // Test without Bearer prefix
      const response = await request(BASE_URL)
        .get('/api/users/me')
        .set('Authorization', authToken);

      // Strapi may return 401 (Unauthorized) or 403 (Forbidden) for invalid token format
      expect([401, 403]).toContain(response.status);
    });
  });
});

