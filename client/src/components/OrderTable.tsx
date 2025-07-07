import React from 'react';
import styled from 'styled-components';
import type { Order } from '../types/order';

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

interface OrderTableProps {
  orders: Order[];
  renderActions?: (order: Order) => React.ReactNode;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, renderActions }) => (
  <Table>
    <thead>
      <tr>
        <Th>Order ID</Th>
        <Th>Date</Th>
        <Th>Total</Th>
        <Th>Status</Th>
        <Th>Actions</Th>
      </tr>
    </thead>
    <tbody>
      {orders.map(order => (
        <tr key={order.id}>
          <Td>#{order.id}</Td>
          <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
          <Td>${order.total.toFixed(2)}</Td>
          <Td>{order.status}</Td>
          <Td>{renderActions ? renderActions(order) : null}</Td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default OrderTable;
