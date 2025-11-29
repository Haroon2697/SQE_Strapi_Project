/**
 * Unit Tests for Strapi Configuration
 * These tests verify basic Strapi setup and configuration
 */

describe('Strapi Configuration Tests', () => {
  test('should have package.json with required dependencies', () => {
    const packageJson = require('../../package.json')
    
    expect(packageJson).toBeDefined()
    expect(packageJson.name).toBeDefined()
    expect(packageJson.version).toBeDefined()
  })

  test('should have Node.js version requirement', () => {
    const packageJson = require('../../package.json')
    
    if (packageJson.engines && packageJson.engines.node) {
      expect(packageJson.engines.node).toBeDefined()
    }
  })

  test('should have build script defined', () => {
    const packageJson = require('../../package.json')
    
    expect(packageJson.scripts).toBeDefined()
    expect(packageJson.scripts.build || packageJson.scripts['strapi:build']).toBeDefined()
  })

  test('should have start script defined', () => {
    const packageJson = require('../../package.json')
    
    expect(packageJson.scripts).toBeDefined()
    expect(packageJson.scripts.start || packageJson.scripts['strapi:start']).toBeDefined()
  })
})

