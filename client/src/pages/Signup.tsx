import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { signup as signupApi, login as loginApi } from '../api';

const GlobalStyle = createGlobalStyle`
  body {
    background: linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%);
    min-height: 100vh;
    font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
  }
`;

const Container = styled.div`
  max-width: 400px;
  margin: 4rem auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 32px #6366f122;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #3730a3;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const ErrorMsg = styled.div`
  color: #ef4444;
  font-weight: 600;
  text-align: center;
  margin: 1rem 0 0.5rem 0;
`;

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await signupApi(name, email, password);
      if (!res.ok) {
        setError(res.data?.error || 'Signup failed');
        setLoading(false);
        return;
      }
      // Auto-login after signup
      const loginRes = await loginApi(email, password);
      if (loginRes.ok && loginRes.data.token) {
        localStorage.setItem('token', loginRes.data.token);
        navigate('/');
      } else {
        setError('Signup succeeded but login failed. Please try logging in.');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>Sign Up</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoFocus
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} style={{ fontSize: 18, padding: '0.7rem 2.5rem' }}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
          {error && <ErrorMsg>{error}</ErrorMsg>}
        </Form>
      </Container>
    </>
  );
};

export default Signup;
