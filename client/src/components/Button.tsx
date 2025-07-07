import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button<{
  variant?: 'primary' | 'secondary';
}>`
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  background: ${({ variant }) =>
    variant === 'secondary' ? '#eee' : '#007bff'};
  color: ${({ variant }) =>
    variant === 'secondary' ? '#333' : '#fff'};
  transition: background 0.2s;
  &:hover {
    background: ${({ variant }) =>
      variant === 'secondary' ? '#ddd' : '#0056b3'};
  }
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => (
  <StyledButton variant={variant} {...props}>{children}</StyledButton>
);

export default Button;
