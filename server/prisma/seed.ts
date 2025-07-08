import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const products = [
  { id: 1, name: 'Wireless Headphones', price: 99.99, stock: 10, description: 'High quality wireless headphones with noise cancellation.' },
  { id: 2, name: 'Smart Watch', price: 149.99, stock: 5, description: 'Track your fitness and notifications in style.' },
  { id: 3, name: 'Bluetooth Speaker', price: 59.99, stock: 20, description: 'Portable and powerful sound for any occasion.' },
  { id: 4, name: 'Gaming Mouse', price: 39.99, stock: 15, description: 'Precision and comfort for gamers.' },
  { id: 5, name: '4K Monitor', price: 299.99, stock: 7, description: 'Ultra HD display for work and play.' },
  { id: 6, name: 'Mechanical Keyboard', price: 89.99, stock: 12, description: 'Tactile keys and RGB lighting.' },
  { id: 7, name: 'Smartphone', price: 699.99, stock: 8, description: 'Latest model with stunning display and camera.' },
  { id: 8, name: 'Tablet', price: 399.99, stock: 6, description: 'Portable and powerful for work and play.' },
  { id: 9, name: 'Fitness Tracker', price: 49.99, stock: 18, description: 'Track your steps, sleep, and more.' },
  { id: 10, name: 'Drone', price: 499.99, stock: 3, description: 'Capture stunning aerial footage.' },
  { id: 11, name: 'VR Headset', price: 249.99, stock: 4, description: 'Immersive virtual reality experience.' },
  { id: 12, name: 'Portable SSD', price: 129.99, stock: 14, description: 'Fast and reliable storage on the go.' },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
  }
  console.log('Seeded products!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
