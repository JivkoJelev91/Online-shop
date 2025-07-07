import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import styled, { createGlobalStyle } from 'styled-components';
import type { Product } from '../types/product';

const GlobalStyle = createGlobalStyle`
  body {
    background: linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%);
    min-height: 100vh;
    font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
  }
`;

const Container = styled.div`
  max-width: 700px;
  margin: 3rem auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 32px #6366f122;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProductImage = styled.img`
  width: 100%;
  max-width: 340px;
  height: 220px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 2px 12px #6366f133;
  margin-bottom: 2rem;
`;

const Name = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #3730a3;
  margin-bottom: 0.5rem;
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #4f46e5;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const StockBadge = styled.span<{ inStock: boolean }>`
  background: ${({ inStock }) => (inStock ? '#22c55e' : '#ef4444')};
  color: #fff;
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 1.5rem;
  display: inline-block;
`;

const AddToCartForm = styled.form`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1.5rem;
`;

const ErrorMsg = styled.div`
  color: #ef4444;
  font-weight: 600;
  margin: 2rem 0;
`;

const LoadingMsg = styled.div`
  color: #6366f1;
  font-weight: 600;
  margin: 2rem 0;
`;

const getProductImage = (name: string) =>
  `https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&w=340&h=220&fit=crop&random=${encodeURIComponent(name)}`;

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 99.99,
    stock: 10,
    createdAt: '',
    updatedAt: '',
    description: 'High quality wireless headphones with noise cancellation.'
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 149.99,
    stock: 5,
    createdAt: '',
    updatedAt: '',
    description: 'Track your fitness and notifications in style.'
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    price: 59.99,
    stock: 20,
    createdAt: '',
    updatedAt: '',
    description: 'Portable and powerful sound for any occasion.'
  },
  {
    id: 4,
    name: 'Gaming Mouse',
    price: 39.99,
    stock: 15,
    createdAt: '',
    updatedAt: '',
    description: 'Precision and comfort for gamers.'
  },
  {
    id: 5,
    name: '4K Monitor',
    price: 299.99,
    stock: 7,
    createdAt: '',
    updatedAt: '',
    description: 'Ultra HD display for work and play.'
  },
  {
    id: 6,
    name: 'Mechanical Keyboard',
    price: 89.99,
    stock: 12,
    createdAt: '',
    updatedAt: '',
    description: 'Tactile keys and RGB lighting.'
  },
  {
    id: 7,
    name: 'Smartphone',
    price: 699.99,
    stock: 8,
    createdAt: '',
    updatedAt: '',
    description: 'Latest model with stunning display and camera.'
  },
  {
    id: 8,
    name: 'Tablet',
    price: 399.99,
    stock: 6,
    createdAt: '',
    updatedAt: '',
    description: 'Portable and powerful for work and play.'
  },
  {
    id: 9,
    name: 'Fitness Tracker',
    price: 49.99,
    stock: 18,
    createdAt: '',
    updatedAt: '',
    description: 'Track your steps, sleep, and more.'
  },
  {
    id: 10,
    name: 'Drone',
    price: 499.99,
    stock: 3,
    createdAt: '',
    updatedAt: '',
    description: 'Capture stunning aerial footage.'
  },
  {
    id: 11,
    name: 'VR Headset',
    price: 249.99,
    stock: 4,
    createdAt: '',
    updatedAt: '',
    description: 'Immersive virtual reality experience.'
  },
  {
    id: 12,
    name: 'Portable SSD',
    price: 129.99,
    stock: 14,
    createdAt: '',
    updatedAt: '',
    description: 'Fast and reliable storage on the go.'
  },
];

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        // fallback to mock data
        const fallback = mockProducts.find(p => String(p.id) === String(id));
        if (fallback) {
          setProduct(fallback);
          setLoading(false);
        } else {
          setError('Product not found.');
          setLoading(false);
        }
      });
  }, [id]);

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add to cart logic
    alert(`Added ${quantity} to cart!`);
  };

  if (loading) return <LoadingMsg>Loading product...</LoadingMsg>;
  if (error) return <ErrorMsg>{error}</ErrorMsg>;
  if (!product) return null;

  return (
    <>
      <GlobalStyle />
      <Container>
        <ProductImage src={getProductImage(product.name)} alt={product.name} />
        <Name>{product.name}</Name>
        <Price>${product.price.toFixed(2)}</Price>
        <Description>{product.description}</Description>
        <StockBadge inStock={product.stock > 0}>
          {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
        </StockBadge>
        <AddToCartForm onSubmit={handleAddToCart}>
          <Input
            type="number"
            min={1}
            max={product.stock}
            value={quantity}
            onChange={e => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
            style={{ width: 80 }}
            disabled={product.stock === 0}
          />
          <Button type="submit" disabled={product.stock === 0}>
            Add to Cart
          </Button>
        </AddToCartForm>
      </Container>
    </>
  );
};

export default ProductDetail;
