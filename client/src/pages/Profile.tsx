import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import Button from '../components/Button';
import Input from '../components/Input';
import { setUser, logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

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

const Info = styled.div`
  margin-bottom: 1.5rem;
  color: #222;
  font-size: 1.1rem;
`;

const ErrorMsg = styled.div`
  color: #ef4444;
  font-weight: 600;
  text-align: center;
  margin: 1rem 0 0.5rem 0;
`;

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  // Inject dummy user if not present
  const { user } = useAppSelector((state: any) => state.auth);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      dispatch(setUser({
        id: 1,
        name: 'Demo User',
        email: 'demo@example.com',
        password: '',
        role: 'user',
        createdAt: '',
        updatedAt: ''
      }));
      setName('Demo User');
    } else {
      setName(user.name);
    }
  }, [user, dispatch]);
  React.useEffect(() => {
    if (!user) {
      // Don't navigate, just render the dummy user
      // navigate('/login');
    }
  }, [user]);
  if (!user) return null;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name) {
      setError('Name is required');
      return;
    }
    // Simulate update (replace with real API call)
    dispatch(setUser({ ...user, name }));
    setSuccess('Profile updated!');
    setPassword('');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>Profile</Title>
        <Info>
          <div><b>Email:</b> {user.email}</div>
        </Info>
        <Form onSubmit={handleUpdate}>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="New Password (not implemented)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled
          />
          <Button type="submit">Update</Button>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          {success && <div style={{ color: '#22c55e', textAlign: 'center', marginTop: 8 }}>{success}</div>}
        </Form>
        <Button variant="secondary" style={{ marginTop: 24 }} onClick={handleLogout}>Logout</Button>
      </Container>
    </>
  );
};

export default Profile;
