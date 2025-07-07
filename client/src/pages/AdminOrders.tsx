import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOrders } from '../store/orderSlice';
import type { Order } from '../types/order';
import type { User } from '../types/user';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const GlobalStyle = createGlobalStyle`
  body {
    background: linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%);
    min-height: 100vh;
    font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
  }
`;

const Container = styled.div`
  max-width: 1000px;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
`;

const Th = styled.th`
  background: #f3f4f6;
  color: #3730a3;
  font-weight: 700;
  padding: 0.8rem 0.5rem;
  border-bottom: 2px solid #e0e7ff;
`;

const Td = styled.td`
  padding: 0.7rem 0.5rem;
  border-bottom: 1px solid #e0e7ff;
  text-align: center;
`;

const StatusSelect = styled.select`
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

const ExpandBtn = styled(Button)`
  font-size: 0.95rem;
  padding: 0.3rem 1rem;
`;

const ItemsList = styled.ul`
  margin: 0.5rem 0 1.5rem 2rem;
  padding: 0;
  list-style: disc inside;
`;

const Item = styled.li`
  margin-bottom: 0.5rem;
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
    status: 'Pending',
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
    userId: 2,
    status: 'Shipped',
    total: 149.99,
    createdAt: '2025-07-05T14:30:00Z',
    updatedAt: '2025-07-05T14:30:00Z',
    items: [
      { id: 3, orderId: 102, productId: 3, quantity: 1, price: 149.99 },
    ],
  },
];

// Fallback mock users for demo
const mockUsers: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', password: '', role: 'user', createdAt: '', updatedAt: '' },
  { id: 2, name: 'Bob', email: 'bob@example.com', password: '', role: 'user', createdAt: '', updatedAt: '' },
];

const AdminOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector(state => state.orders);
  const { user } = useAppSelector(state => state.auth);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showMock, setShowMock] = useState(false);
  const [statusMap, setStatusMap] = useState<{ [id: number]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    // if (!user || user.role !== 'admin') {
    //   navigate('/');
    // } else {
      dispatch(fetchOrders())
        .unwrap()
        .catch(() => setShowMock(true));
    // }
  }, [dispatch, user, navigate]);

  const displayOrders = showMock ? mockOrders : orders;

  // Find user name by userId (mock only)
  const getUserName = (userId: number) => {
    const u = mockUsers.find(u => u.id === userId);
    return u ? u.name : `User #${userId}`;
  };

  const handleStatusChange = (orderId: number, newStatus: string) => {
    setStatusMap(s => ({ ...s, [orderId]: newStatus }));
    // TODO: dispatch updateOrderStatus(orderId, newStatus) when backend ready
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>Admin: All Orders</Title>
        {error && !showMock && <ErrorMsg>{error}</ErrorMsg>}
        <Table>
          <thead>
            <tr>
              <Th>Order ID</Th>
              <Th>User</Th>
              <Th>Date</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {displayOrders.map(order => (
              <React.Fragment key={order.id}>
                <tr>
                  <Td>#{order.id}</Td>
                  <Td>{getUserName(order.userId)}</Td>
                  <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
                  <Td>${order.total.toFixed(2)}</Td>
                  <Td>
                    <StatusSelect
                      value={statusMap[order.id] || order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Completed">Completed</option>
                    </StatusSelect>
                  </Td>
                  <Td>
                    <ExpandBtn variant="secondary" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                      {expanded === order.id ? 'Hide Items' : 'Show Items'}
                    </ExpandBtn>
                  </Td>
                </tr>
                {expanded === order.id && (
                  <tr>
                    <Td colSpan={6} style={{ background: '#f9fafb' }}>
                      <ItemsList>
                        {order.items.map(item => (
                          <Item key={item.id}>
                            Product #{item.productId} &mdash; x{item.quantity} &mdash; ${item.price.toFixed(2)}
                          </Item>
                        ))}
                      </ItemsList>
                    </Td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default AdminOrders;
