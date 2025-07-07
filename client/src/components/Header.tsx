import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/authSlice';

const Bar = styled.header`
  width: 100%;
  background: #3730a3;
  color: #fff;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const StyledLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;

const Header: React.FC = () => {
  const { user } = useAppSelector((state: any) => state.auth);
  const dispatch = useAppDispatch();
  return (
    <Bar>
      <StyledLink to="/">Shop</StyledLink>
      <Nav>
        {user ? (
          <>
            <StyledLink to="/cart">Cart</StyledLink>
            <StyledLink to="/orders">Orders</StyledLink>
            <StyledLink to="/profile">Profile</StyledLink>
            {user.role === 'admin' && <StyledLink to="/admin/products">Admin</StyledLink>}
            <button style={{ background: 'none', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }} onClick={() => dispatch(logout())}>Logout</button>
          </>
        ) : (
          <>
            <StyledLink to="/login">Login</StyledLink>
            <StyledLink to="/signup">Signup</StyledLink>
          </>
        )}
      </Nav>
    </Bar>
  );
};

export default Header;
