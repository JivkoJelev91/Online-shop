import React, { useState } from 'react';
import Button from '../components/Button';
import styled, { createGlobalStyle } from 'styled-components';
import type { Product } from '../types/product';
import { useNavigate } from 'react-router-dom';

const GlobalStyle = createGlobalStyle`
  body {
    background: linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%);
    min-height: 100vh;
    font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
  }
`;

const Container = styled.div`
  max-width: 700px;
  margin: 3rem auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 32px #6366f122;
  padding: 2.5rem 2rem;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #3730a3;
  margin-bottom: 2rem;
`;

const CartList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CartItemBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f3f4f6;
  border-radius: 10px;
  padding: 1.2rem 1rem;
  box-shadow: 0 1px 6px #6366f111;
`;

const ItemInfo = styled.div`
  flex: 2;
`;

const ItemName = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #3730a3;
`;

const ItemPrice = styled.div`
  color: #4f46e5;
  font-weight: 600;
  margin-top: 0.2rem;
`;

const LineTotal = styled.div`
  font-weight: 700;
  color: #111;
  min-width: 80px;
  text-align: right;
`;

const Summary = styled.div`
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1.5px solid #e0e7ff;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Subtotal = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: #4f46e5;
  margin-bottom: 1.2rem;
`;

const SuccessMsg = styled.div`
  color: #22c55e;
  font-weight: 700;
  text-align: center;
  margin: 2rem 0 1rem 0;
  font-size: 1.2rem;
`;

// Mock cart data for demo
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 99.99,
    stock: 10,
    createdAt: '',
    updatedAt: '',
    description: 'High quality wireless headphones with noise cancellation.'
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 149.99,
    stock: 5,
    createdAt: '',
    updatedAt: '',
    description: 'Track your fitness and notifications in style.'
  },
];

const initialCart = [
  { product: mockProducts[0], quantity: 2 },
  { product: mockProducts[1], quantity: 1 },
];

const Checkout: React.FC = () => {
  const [cart] = useState(initialCart);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with real API call
    setSuccess(true);
    setTimeout(() => navigate('/orders'), 1200);
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>Checkout</Title>
        <form onSubmit={handleOrder}>
          <CartList>
            {cart.map((item, idx) => (
              <CartItemBox key={item.product.id}>
                <ItemInfo>
                  <ItemName>{item.product.name}</ItemName>
                  <ItemPrice>${item.product.price.toFixed(2)}</ItemPrice>
                </ItemInfo>
                <div>x{item.quantity}</div>
                <LineTotal>${(item.product.price * item.quantity).toFixed(2)}</LineTotal>
              </CartItemBox>
            ))}
          </CartList>
          <Summary>
            <Subtotal>Subtotal: ${subtotal.toFixed(2)}</Subtotal>
            <Button type="submit" style={{ fontSize: 18, padding: '0.7rem 2.5rem' }}>
              Confirm Order
            </Button>
          </Summary>
          {success && <SuccessMsg>Order placed! Redirecting...</SuccessMsg>}
        </form>
      </Container>
    </>
  );
};

export default Checkout;
