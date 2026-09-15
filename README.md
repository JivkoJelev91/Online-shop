# 🛒 Online Shop

A full-stack e-commerce application built with **React, TypeScript, Node.js, Express, Prisma, and PostgreSQL**. The project provides a complete shopping experience with authentication, product browsing, cart management, checkout, order history, and an admin interface for managing products and orders.

## ✨ Features

### Customer

* Browse, search, and filter products
* View detailed product information
* User registration and authentication
* Add and manage items in the shopping cart
* Checkout and order confirmation
* View order history

### Admin

* Product CRUD operations
* View and manage orders
* Role-based access and protected admin functionality

## 🏗️ Project Structure

```text
online-shop/
├── client/        # React frontend
├── server/        # Express backend
└── README.md
```

### Frontend

Built with:

* React
* TypeScript
* Vite
* Tailwind CSS
* Redux Toolkit

The frontend contains the application UI, state management, authentication flows, product pages, cart, checkout, orders, and admin interface.

### Backend

Built with:

* Node.js
* Express
* TypeScript
* Prisma
* PostgreSQL
* Zod

The backend provides the API, authentication, product and order management, cart operations, and protected admin endpoints.

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/JivkoJelev91/Online-shop.git
cd Online-shop
```

Install and run the frontend:

```bash
cd client
npm install
npm run dev
```

Install and run the backend:

```bash
cd server
npm install
npm run dev
```

The backend requires environment variables for the database connection and other server configuration. See the server README for details.

## 📚 Documentation

For more detailed information, see the README files for each part of the project:

* [Frontend Documentation](./client/README.md)
* [Backend Documentation](./server/README.md)

## 🛠️ Tech Stack

| Area             | Technology              |
| ---------------- | ----------------------- |
| Frontend         | React, TypeScript, Vite |
| Styling          | Tailwind CSS            |
| State Management | Redux Toolkit           |
| Backend          | Node.js, Express        |
| Database         | PostgreSQL              |
| ORM              | Prisma                  |
| Validation       | Zod                     |
| Database Hosting | Neon                    |

## 🎯 Project Goal

This project demonstrates a complete full-stack e-commerce architecture, connecting a modern React frontend with a TypeScript-based REST API and PostgreSQL database.
