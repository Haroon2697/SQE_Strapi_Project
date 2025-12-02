import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import ProductCard from '../components/ProductCard';
import { GET_PRODUCT } from '../graphql/queries';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  pricing: {
    priceRange: {
      start: {
        gross: {
          amount: 99.99,
          currency: 'USD'
        }
      }
    }
  }
};

const mocks = [
  {
    request: {
      query: GET_PRODUCT,
      variables: { id: '1' }
    },
    result: {
      data: { product: mockProduct }
    }
  }
];

describe('ProductCard', () => {
  it('renders product information', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProductCard product={mockProduct} />
      </MockedProvider>
    );

    expect(await screen.findByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('handles add to cart click', () => {
    const onAddToCart = jest.fn();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProductCard product={mockProduct} onAddToCart={onAddToCart} />
      </MockedProvider>
    );

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct.id);
  });
});

