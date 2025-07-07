import React from 'react';
import styled from 'styled-components';
import type { Product } from '../types/product';

const Card = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  }
`;

const Title = styled.h2`
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
`;

const Price = styled.div`
  font-weight: bold;
  color: #007bff;
  margin-bottom: 0.5rem;
`;

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  children?: React.ReactNode;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, children }) => (
  <Card onClick={onClick}>
    <Title>{product.name}</Title>
    <Price>${product.price.toFixed(2)}</Price>
    <div>{product.description}</div>
    {children}
  </Card>
);

export default ProductCard;
