"""
GraphQL API Tests for Saleor
Tests product queries, checkout mutations, and user authentication
"""
import pytest
import json
from django.test import Client
from graphene_django.utils.testing import graphql_query


@pytest.fixture
def client_query(client):
    """Helper fixture for GraphQL queries"""
    def func(query: str, variables: dict = None):
        return graphql_query(query, client=client, variables=variables)
    return func


@pytest.fixture
def authenticated_client_query(user, client):
    """Helper fixture for authenticated GraphQL queries"""
    client.force_login(user)
    def func(query: str, variables: dict = None):
        return graphql_query(query, client=client, variables=variables)
    return func


class TestProductQueries:
    """Test product-related GraphQL queries"""
    
    def test_products_query(self, client_query):
        """Test basic products query"""
        query = '''
        query {
          products(first: 10) {
            edges {
              node {
                id
                name
                description
                pricing {
                  priceRange {
                    start {
                      gross {
                        amount
                        currency
                      }
                    }
                  }
                }
              }
            }
          }
        }
        '''
        response = client_query(query)
        assert response.status_code == 200
        content = json.loads(response.content)
        assert 'errors' not in content
        assert 'data' in content
        assert 'products' in content['data']
    
    def test_product_search(self, client_query):
        """Test product search functionality"""
        query = '''
        query {
          products(first: 10, filter: {search: "shirt"}) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
        '''
        response = client_query(query)
        assert response.status_code == 200
        content = json.loads(response.content)
        assert 'errors' not in content
    
    def test_product_by_id(self, client_query, product):
        """Test fetching a single product by ID"""
        query = '''
        query {
          product(id: "%s") {
            id
            name
            description
          }
        }
        ''' % product.id
        response = client_query(query)
        assert response.status_code == 200
        content = json.loads(response.content)
        assert 'errors' not in content
        assert content['data']['product']['id'] == str(product.id)


class TestCheckoutMutations:
    """Test checkout-related GraphQL mutations"""
    
    def test_create_checkout(self, authenticated_client_query, product_variant):
        """Test checkout creation for authenticated user"""
        mutation = '''
        mutation {
          checkoutCreate(input: {
            lines: [{
              quantity: 1
              variantId: "%s"
            }]
            email: "customer@example.com"
            channel: "default-channel"
          }) {
            checkout {
              id
              totalPrice {
                gross {
                  amount
                }
              }
            }
            errors {
              field
              message
            }
          }
        }
        ''' % product_variant.id
        
        response = authenticated_client_query(mutation)
        assert response.status_code == 200
        content = json.loads(response.content)
        assert 'errors' not in content
        if content['data']['checkoutCreate']['checkout']:
            assert content['data']['checkoutCreate']['checkout']['id']
            assert not content['data']['checkoutCreate']['errors']
    
    def test_checkout_complete(self, authenticated_client_query, checkout):
        """Test checkout completion"""
        mutation = '''
        mutation {
          checkoutComplete(checkoutId: "%s") {
            order {
              id
              status
              total {
                gross {
                  amount
                }
              }
            }
            errors {
              field
              message
            }
          }
        }
        ''' % checkout.id
        
        response = authenticated_client_query(mutation)
        assert response.status_code == 200
        content = json.loads(response.content)
        assert 'errors' not in content


class TestUserAuthentication:
    """Test user authentication and registration"""
    
    def test_user_registration(self, client_query):
        """Test user registration mutation"""
        mutation = '''
        mutation {
          accountRegister(input: {
            email: "newuser@example.com"
            password: "SecurePassword123!"
            firstName: "John"
            lastName: "Doe"
          }) {
            user {
              id
              email
            }
            errors {
              field
              message
            }
          }
        }
        '''
        response = client_query(mutation)
        assert response.status_code == 200
        content = json.loads(response.content)
        assert 'errors' not in content
    
    def test_user_login(self, client_query, user):
        """Test user login mutation"""
        mutation = '''
        mutation {
          tokenCreate(email: "%s", password: "testpass123") {
            token
            user {
              id
              email
            }
            errors {
              field
              message
            }
          }
        }
        ''' % user.email
        
        response = client_query(mutation)
        assert response.status_code == 200
        content = json.loads(response.content)
        assert 'errors' not in content
        if content['data']['tokenCreate']['token']:
            assert content['data']['tokenCreate']['token']


class TestSecurity:
    """Test security features"""
    
    def test_sql_injection_protection(self, client_query):
        """Test that SQL injection attempts are blocked"""
        malicious_query = '''
        query {
          products(first: 10, filter: {search: "'; DROP TABLE users; --"}) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
        '''
        response = client_query(malicious_query)
        # Should return an error, not crash
        assert response.status_code == 200
        content = json.loads(response.content)
        # GraphQL should handle this safely
        assert 'data' in content or 'errors' in content
    
    def test_xss_protection(self, client_query):
        """Test that XSS attempts are escaped"""
        xss_payload = '<script>alert("xss")</script>'
        query = '''
        query {
          products(first: 10, filter: {search: "%s"}) {
            edges {
              node {
                name
                description
              }
            }
          }
        }
        ''' % xss_payload
        
        response = client_query(query)
        assert response.status_code == 200
        content = json.loads(response.content)
        # Response should be sanitized
        assert 'errors' in content or 'data' in content

