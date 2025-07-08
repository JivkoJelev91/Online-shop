export type CartItem = {
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    stock?: number;
  };
};

export type OrderItemInput = {
  productId: number;
  quantity: number;
  price: number;
};
