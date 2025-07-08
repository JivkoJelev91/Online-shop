import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import Input from '../components/Input';
import Button from '../components/Button';
import styled, { createGlobalStyle } from 'styled-components';
import type { Product } from '../types/product';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api';

const GlobalStyle = createGlobalStyle`
  body {
    background: linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%);
    min-height: 100vh;
    font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
  }
`;

const HeaderBar = styled.header`
  width: 100%;
  background: #4f46e5;
  color: #fff;
  padding: 1.5rem 0 1rem 0;
  box-shadow: 0 2px 12px rgba(79,70,229,0.08);
  margin-bottom: 2rem;
`;

const ShopTitle = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin: 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2.5rem;
`;

const StyledSelect = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #c7d2fe;
  background: #fff;
  font-size: 1rem;
  color: #3730a3;
  box-shadow: 0 1px 4px rgba(79,70,229,0.04);
  transition: border 0.2s;
  &:focus {
    border: 1.5px solid #6366f1;
    outline: none;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  max-width: 240px;
  height: 160px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 2px 12px #6366f133;
  margin-bottom: 12px;
`;

const CardInfo = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StockBadge = styled.span<{ inStock: boolean }>`
  background: ${({ inStock }) => (inStock ? '#22c55e' : '#ef4444')};
  color: #fff;
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 13px;
  font-weight: 500;
`;

const Price = styled.span`
  font-weight: 700;
  color: #4f46e5;
  font-size: 18px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  font-weight: 600;
  font-size: 16px;
  margin-top: 8px;
  background: #4f46e5;
`;

const CardWrapper = styled.div`
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  &:hover {
    box-shadow: 0 6px 24px #6366f144;
    transform: translateY(-2px) scale(1.02);
  }
`;

const getProductImage = (name: string) =>
  `https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&w=240&h=160&fit=crop&random=${encodeURIComponent(name)}`;

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('price-asc');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // TODO: Replace with real auth check
  const isAuthenticated = true;

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError('Could not load products.'));
  }, []);

  const filtered = products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'stock') return b.stock - a.stock;
      return 0;
    });

  return (
    <>
      <GlobalStyle />
      <HeaderBar>
        <ShopTitle>🛒 Modern Online Shop</ShopTitle>
      </HeaderBar>
      <Container>
        {error && <div style={{color:'#ef4444',textAlign:'center',marginBottom:20}}>{error}</div>}
        <Controls>
          <Input
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 300, boxShadow: '0 1px 4px #6366f122', border: '1.5px solid #6366f1' }}
          />
          <StyledSelect value={sort} onChange={e => setSort(e.target.value)}>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock">Stock</option>
          </StyledSelect>
        </Controls>
        <Grid>
          {filtered.map(product => (
            <CardWrapper key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
              <ProductCard product={product}>
                <ProductImage
                  src={getProductImage(product.name)}
                  alt={product.name}
                />
                <CardInfo>
                  <StockBadge inStock={product.stock > 0}>
                    {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                  </StockBadge>
                  <Price>${product.price.toFixed(2)}</Price>
                </CardInfo>
                {isAuthenticated && (
                  <StyledButton disabled={product.stock === 0}>
                    Add to Cart
                  </StyledButton>
                )}
              </ProductCard>
            </CardWrapper>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Home;
