"""
Pytest configuration and fixtures for Saleor tests
"""
import pytest
from django.contrib.auth import get_user_model
from factory import Faker
from factory.django import DjangoModelFactory

User = get_user_model()


@pytest.fixture
def user(db):
    """Create a test user"""
    return User.objects.create_user(
        email='test@example.com',
        password='testpass123',
        first_name='Test',
        last_name='User'
    )


@pytest.fixture
def product(db):
    """Create a test product"""
    from saleor.product.models import Product
    return Product.objects.create(
        name='Test Product',
        description='Test Description',
        slug='test-product'
    )


@pytest.fixture
def product_variant(db, product):
    """Create a test product variant"""
    from saleor.product.models import ProductVariant
    return ProductVariant.objects.create(
        product=product,
        sku='TEST-SKU-001',
        price_amount=99.99
    )


@pytest.fixture
def checkout(db, user, product_variant):
    """Create a test checkout"""
    from saleor.checkout.models import Checkout
    checkout = Checkout.objects.create(
        user=user,
        email='customer@example.com'
    )
    from saleor.checkout.models import CheckoutLine
    CheckoutLine.objects.create(
        checkout=checkout,
        variant=product_variant,
        quantity=1
    )
    return checkout

