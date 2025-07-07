# E-commerce Frontend (Vite + React + TypeScript + Tailwind CSS + Redux Toolkit)

This project is a modular, maintainable e-commerce frontend that connects to an existing backend. It uses:
- **Vite** for fast builds
- **React** for UI
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management

## Features
- Product browsing, search, and filters
- Product detail page
- Authentication (login/signup)
- Cart management
- Checkout and order confirmation
- Order history
- Admin: product CRUD, view all orders
- Role-based UI

## Project Structure
- `src/pages`: Page components (Home, Product, Cart, Login, Signup, Orders, Admin)
- `src/components`: Reusable UI components (Button, ProductCard, Input, Modal, etc.)
- `src/store`: Redux slices (authSlice, productSlice, cartSlice, orderSlice)
- `src/types`: TypeScript types for backend models

## Setup
```sh
npm install
npm run dev
```

## Tailwind CSS
Tailwind is configured in `tailwind.config.js` and `postcss.config.js`. Directives are included in `src/index.css`.

## VS Code Tasks
- `dev`: Start development server
- `build`: Build for production

---
For workspace-specific Copilot instructions, see `.github/copilot-instructions.md`.
