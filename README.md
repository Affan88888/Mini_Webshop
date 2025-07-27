# 🛒 Mini Webshop

Welcome to **Mini Webshop**, a full-stack e-commerce web application built with **React** (frontend) and **FastAPI** (backend).  
This project showcases a simple webshop with user authentication, product management, and order processing.

---

## 🚀 Features

### User Types
- **Guest User**  
  Can browse products and view product details but must log in to add items to the cart or place orders.

- **Registered User**  
  Can browse, add products to cart and place orders.

- **Admin User**  
  Has all user privileges plus access to the admin dashboard where they can:  
  - Add new products  
  - Manage existing products (edit/delete)  
  - View and update orders (accept, deny, finish)

---

### Core Functionalities

- **User Authentication**  
  Sign up, login, and logout with JWT-based authentication stored securely in cookies.

- **Product Catalog**  
  Browse products, view detailed product pages with images and descriptions.

- **Shopping Cart**  
  Add/remove products, view cart contents, and place orders.

- **Order Management**  
  Customers can place orders with contact info (name, surname, email, phone, address).  
  Admins can view all orders with pagination, sort by date, and update order statuses.

- **Responsive Design**  
  Mobile-friendly UI for seamless experience on all devices.

---

## 📦 Getting Started

### Prerequisites
- Node.js & npm (for frontend)  
- Python 3.8+ & pip (for backend)  

### Backend Setup (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
2. (Optional) Create and activate a virtual environment:
     ```bash
    python -m venv venv
    source venv/bin/activate    # On macOS/Linux
    venv\Scripts\activate       # On Windows
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
4. Create a .env file in the backend directory to store environment variables:
   ```bash
    SECRET_KEY=your_secret_key_here
    ALGORITHM=HS256
    EXPIRATION_MINUTES=60
5. Run the backend server:
   ```bash
   python main.py
6. The API will be available at:
http://localhost:8000

### Frontend Setup (React)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
2. Install dependencies:
   ```bash
   npm install
3.  Start the development server:
    ```bash
    npm start
4. The React Frontend will be available at:
http://localhost:3000

### Additional notes: You will probably need to also modify frontend/src/config.js, to set the 
     API_BASE_URL = "http://localhost:8000"
and to also modify the cookie settings in the auth.py file because the code is setup for deployment right now.
### You can access the website on the following link: https://mini-webshop-taupe.vercel.app/
### You can access the FastAPI docs on the following link: https://mini-webshop-wjr0.onrender.com/docs










