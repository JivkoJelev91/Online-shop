import React from 'react';
import styled from 'styled-components';
import type { Product } from '../types/product';
import Input from './Input';
import Button from './Button';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

interface ProductFormProps {
  initial?: Partial<Product>;
  onSubmit: (data: Partial<Product>) => void;
  onCancel?: () => void;
  loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ initial = {}, onSubmit, onCancel, loading }) => {
  const [form, setForm] = React.useState<Partial<Product>>({
    name: initial.name || '',
    price: initial.price || 0,
    stock: initial.stock || 0,
    description: initial.description || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        name="name"
        type="text"
        placeholder="Name"
        value={form.name as string}
        onChange={handleChange}
        required
      />
      <Input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price?.toString() || ''}
        onChange={handleChange}
        required
        min={0}
        step={0.01}
      />
      <Input
        name="stock"
        type="number"
        placeholder="Stock"
        value={form.stock?.toString() || ''}
        onChange={handleChange}
        required
        min={0}
        step={1}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description as string}
        onChange={handleChange}
        style={{ minHeight: 60, borderRadius: 4, border: '1px solid #ccc', padding: 8 }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
      </div>
    </Form>
  );
};

export default ProductForm;
