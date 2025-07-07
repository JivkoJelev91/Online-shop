import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Side = styled.aside`
  width: 220px;
  background: #f3f4f6;
  min-height: 100vh;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const StyledLink = styled(Link)`
  color: #3730a3;
  text-decoration: none;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;

const Sidebar: React.FC = () => (
  <Side>
    <StyledLink to="/admin/products">Products</StyledLink>
    <StyledLink to="/admin/orders">Orders</StyledLink>
  </Side>
);

export default Sidebar;
