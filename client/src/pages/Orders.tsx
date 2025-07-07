import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOrders } from '../store/orderSlice';
import type { Order } from '../types/order';
import Button from '../components/Button';

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

const OrderBox = styled.div`
  background: #f3f4f6;
  border-radius: 10px;
  box-shadow: 0 1px 6px #6366f111;
  margin-bottom: 1.5rem;
  padding: 1.2rem 1rem;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const OrderId = styled.div`
  font-weight: 700;
  color: #3730a3;
`;

const OrderMeta = styled.div`
  color: #555;
  font-size: 0.95rem;
`;

const OrderStatus = styled.div`
  font-weight: 600;
  color: #4f46e5;
`;

const OrderTotal = styled.div`
  font-weight: 700;
  color: #111;
`;

const ItemsList = styled.ul`
  margin-top: 1rem;
  padding-left: 1.2rem;
`;

const Item = styled.li`
  margin-bottom: 0.7rem;
  color: #222;
`;

const ErrorMsg = styled.div`
  color: #ef4444;
  font-weight: 600;
  text-align: center;
  margin: 1rem 0 0.5rem 0;
`;

// Fallback mock orders for demo
const mockOrders: Order[] = [
  {
    id: 101,
    userId: 1,
    status: 'Delivered',
    total: 249.97,
    createdAt: '2025-07-01T10:00:00Z',
    updatedAt: '2025-07-02T10:00:00Z',
    items: [
      { id: 1, orderId: 101, productId: 1, quantity: 2, price: 99.99 },
      { id: 2, orderId: 101, productId: 2, quantity: 1, price: 49.99 },
    ],
  },
  {
    id: 102,
    userId: 1,
    status: 'Processing',
    total: 149.99,
    createdAt: '2025-07-05T14:30:00Z',
    updatedAt: '2025-07-05T14:30:00Z',
    items: [
      { id: 3, orderId: 102, productId: 3, quantity: 1, price: 149.99 },
    ],
  },
];

const Orders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector(state => state.orders);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showMock, setShowMock] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders())
      .unwrap()
      .catch(() => setShowMock(true));
  }, [dispatch]);

  const displayOrders = showMock ? mockOrders : orders;

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>My Orders</Title>
        {loading && <div>Loading orders...</div>}
        {error && !showMock && <ErrorMsg>{error}</ErrorMsg>}
        {displayOrders.length === 0 && !loading && <div>No orders found.</div>}
        {displayOrders.map((order: Order) => (
          <OrderBox key={order.id}>
            <OrderHeader onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
              <div>
                <OrderId>Order #{order.id}</OrderId>
                <OrderMeta>{new Date(order.createdAt).toLocaleDateString()}</OrderMeta>
              </div>
              <div style={{ textAlign: 'right' }}>
                <OrderStatus>{order.status}</OrderStatus>
                <OrderTotal>${order.total.toFixed(2)}</OrderTotal>
              </div>
            </OrderHeader>
            {expanded === order.id && (
              <ItemsList>
                {order.items.map(item => (
                  <Item key={item.id}>
                    <span>Product #{item.productId}</span> &mdash; x{item.quantity} &mdash; ${item.price.toFixed(2)}
                  </Item>
                ))}
              </ItemsList>
            )}
          </OrderBox>
        ))}
      </Container>
    </>
  );
};

export default Orders;
