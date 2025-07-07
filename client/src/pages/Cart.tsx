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
  max-width: 800px;
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

const QuantityBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QtyButton = styled(Button)`
  padding: 0.2rem 0.7rem;
  font-size: 1.1rem;
  min-width: 32px;
`;

const RemoveButton = styled(Button)`
  background: #ef4444;
  color: #fff;
  font-size: 0.95rem;
  margin-left: 1rem;
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

const EmptyState = styled.div`
  text-align: center;
  color: #888;
  font-size: 1.2rem;
  margin: 3rem 0;
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
  {
    id: 3,
    name: 'Bluetooth Speaker',
    price: 59.99,
    stock: 20,
    createdAt: '',
    updatedAt: '',
    description: 'Portable and powerful sound for any occasion.'
  },
];

const initialCart = [
  { product: mockProducts[0], quantity: 2 },
  { product: mockProducts[1], quantity: 1 },
];

const Cart: React.FC = () => {
  const [cart, setCart] = useState(initialCart);
  const navigate = useNavigate();

  const handleQty = (idx: number, delta: number) => {
    setCart(cart =>
      cart.map((item, i) =>
        i === idx
          ? { ...item, quantity: Math.max(1, Math.min(item.product.stock, item.quantity + delta)) }
          : item
      )
    );
  };

  const handleRemove = (idx: number) => {
    setCart(cart => cart.filter((_, i) => i !== idx));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <>
        <GlobalStyle />
        <Container>
          <Title>Your Cart</Title>
          <EmptyState>Your cart is empty.</EmptyState>
        </Container>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>Your Cart</Title>
        <CartList>
          {cart.map((item, idx) => (
            <CartItemBox key={item.product.id}>
              <ItemInfo>
                <ItemName>{item.product.name}</ItemName>
                <ItemPrice>${item.product.price.toFixed(2)}</ItemPrice>
              </ItemInfo>
              <QuantityBox>
                <QtyButton onClick={() => handleQty(idx, -1)} disabled={item.quantity <= 1}>-</QtyButton>
                <span>{item.quantity}</span>
                <QtyButton onClick={() => handleQty(idx, 1)} disabled={item.quantity >= item.product.stock}>+</QtyButton>
                <RemoveButton onClick={() => handleRemove(idx)} type="button">Remove</RemoveButton>
              </QuantityBox>
              <LineTotal>${(item.product.price * item.quantity).toFixed(2)}</LineTotal>
            </CartItemBox>
          ))}
        </CartList>
        <Summary>
          <Subtotal>Subtotal: ${subtotal.toFixed(2)}</Subtotal>
          <Button onClick={() => navigate('/checkout')} style={{ fontSize: 18, padding: '0.7rem 2.5rem' }}>
            Checkout
          </Button>
        </Summary>
      </Container>
    </>
  );
};

export default Cart;
