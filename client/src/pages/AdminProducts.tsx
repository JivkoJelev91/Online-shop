import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../store/productSlice';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
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
  max-width: 900px;
  margin: 3rem auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 32px #6366f122;
  padding: 2.5rem 2rem;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #3730a3;
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

const ActionBtn = styled(Button)`
  font-size: 0.95rem;
  padding: 0.4rem 1.1rem;
  margin: 0 0.2rem;
`;

const ErrorMsg = styled.div`
  color: #ef4444;
  font-weight: 600;
  text-align: center;
  margin: 1rem 0 0.5rem 0;
`;

const AdminProducts: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(state => state.products);
  const { user } = useAppSelector(state => state.auth);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({ name: '', price: 0, stock: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    // if (!user || user.role !== 'admin') {
    //   navigate('/');
    // } else {
        setMockProducts([
          {
            id: 1,
            name: 'Wireless Headphones',
            price: 99.99,
            stock: 10,
            createdAt: '2025-07-01T10:00:00Z',
            updatedAt: '2025-07-01T10:00:00Z',
            description: 'High quality wireless headphones with noise cancellation.'
          },
          {
            id: 2,
            name: 'Smart Watch',
            price: 149.99,
            stock: 5,
            createdAt: '2025-07-02T10:00:00Z',
            updatedAt: '2025-07-02T10:00:00Z',
            description: 'Track your fitness and notifications in style.'
          },
          
        ]);
    // }
  }, [dispatch, user, navigate]);

  // Fallback mock products state
  const [mockProducts, setMockProducts] = useState<Product[]>([]);
  const displayProducts = mockProducts.length > 0 ? mockProducts : products;

  const openCreate = () => {
    setEditProduct(null);
    setForm({ name: '', price: 0, stock: 0 });
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setForm(product);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editProduct) {
      dispatch(updateProduct({ id: editProduct.id, data: form }));
    } else {
      dispatch(createProduct(form));
    }
    setModalOpen(false);
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <TitleRow>
          <Title>Admin: Manage Products</Title>
          <Button onClick={openCreate} style={{ fontSize: 16, padding: '0.5rem 1.5rem' }}>+ Add Product</Button>
        </TitleRow>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Price</Th>
              <Th>Stock</Th>
              <Th>Created At</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {displayProducts.map(product => (
              <tr key={product.id}>
                <Td>{product.name}</Td>
                <Td>${product.price.toFixed(2)}</Td>
                <Td>{product.stock}</Td>
                <Td>{new Date(product.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <ActionBtn variant="secondary" onClick={() => openEdit(product)}>Edit</ActionBtn>
                  <ActionBtn variant="secondary" onClick={() => handleDelete(product.id)}>Delete</ActionBtn>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: 16 }}>{editProduct ? 'Edit Product' : 'Add Product'}</h3>
            <Input
              type="text"
              placeholder="Name"
              value={form.name || ''}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              style={{ marginBottom: 12 }}
            />
            <Input
              type="number"
              placeholder="Price"
              value={form.price?.toString() || ''}
              onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
              required
              min={0}
              step={0.01}
              style={{ marginBottom: 12 }}
            />
            <Input
              type="number"
              placeholder="Stock"
              value={form.stock?.toString() || ''}
              onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))}
              required
              min={0}
              step={1}
              style={{ marginBottom: 20 }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">{editProduct ? 'Save' : 'Create'}</Button>
            </div>
          </form>
        </Modal>
      </Container>
    </>
  );
};

export default AdminProducts;
