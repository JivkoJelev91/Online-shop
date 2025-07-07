import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = (props) => <StyledInput {...props} />;

export default Input;
