# The Global World - Full Website

This is a professional trading platform for **The Global World**, featuring a Node.js + Express.js backend, MongoDB database, and React.js frontend with Tailwind CSS. It includes user authentication, admin controls, trading, deposit/withdraw, KYC verification, unique user IDs, and manual balance adjustments.

## Features
- User registration/login with JWT authentication and unique random IDs
- Admin panel with full control over users, trades, balances, and KYC
- Trading system with invisible admin override for win/loss outcomes
- Deposit/withdraw requests handled via customer support
- KYC verification with Aadhaar, PAN, and document uploads
- Responsive, professional frontend with live chat placeholder
- MongoDB for storing users, trades, transactions, and KYC data
- Admin ability to add/subtract balance points manually

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

## Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd the-global-world
   ```

2. Install dependencies:
   ```bash
   npm run install-all
   ```

3. Create `backend/.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/the_global_world
   JWT_SECRET=<your-jwt-secret>
   PORT=5000
   ```

4. Create `root/.env`:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

5. Create `backend/uploads/` for KYC documents:
   ```bash
   mkdir backend/uploads
   ```

6. Start the application:
   ```bash
   npm start
   ```
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

## Deployment Guide
1. **Build Frontend**:
   ```bash
   npm run build
   ```

2. **Host on Platform** (e.g., Heroku):
   ```bash
   heroku create the-global-world
   heroku config:set MONGO_URI=<your-mongodb-uri>
   heroku config:set JWT_SECRET=<your-jwt-secret>
   heroku config:set NODE_ENV=production
   heroku config:set REACT_APP_API_URL=https://the-global-world.herokuapp.com
   git push heroku main
   ```

3. **MongoDB Setup**:
   - Use MongoDB Atlas or local MongoDB.
   - Update `MONGO_URI` in `backend/.env`.

4. **Environment Variables**:
   - Set `NODE_ENV=production`.
   - Update `REACT_APP_API_URL` to your deployed backend URL.

5. **SSL/TLS**:
   - Use HTTPS via Heroku or configure Nginx.

6. **KYC Storage**:
   - Use AWS S3 for document uploads in production (update `backend/routes/kyc.js`).

7. **Testing**:
   - Test APIs with Postman:
     ```bash
     curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
     ```
   - Access frontend at `http://localhost:3000` or deployed URL.

## API Endpoints
- **Auth**:
  - `POST /api/auth/register` - Register (username, email, password, returns userId)
  - `POST /api/auth/login` - Login (email, password, returns userId)
- **Admin**:
  - `GET /api/admin/users` - List users with IDs
  - `POST /api/admin/trade-control` - Set trade outcome
  - `POST /api/admin/balance-adjust` - Adjust user balance (userId, amount, action: 'add'/'subtract')
  - `POST /api/admin/kyc/approve` - Approve/reject KYC
- **Trade**:
  - `POST /api/trade` - Place trade (amount)
- **Transaction**:
  - `POST /api/deposit` - Request deposit (amount)
  - `POST /api/withdraw` - Request withdrawal (amount)
- **KYC**:
  - `POST /api/kyc` - Submit KYC (aadhar, pan, documents)
  - `GET /api/kyc/status` - Check KYC status

## MongoDB Database Structure
- **Users**:
  ```json
  { "_id": ObjectId, "userId": String, "username": String, "email": String, "password": String, "isAdmin": Boolean, "balance": Number, "createdAt": Date, "updatedAt": Date }
  ```
- **Trades**:
  ```json
  { "_id": ObjectId, "userId": ObjectId, "amount": Number, "outcome": String, "adminOverride": Boolean, "status": String, "createdAt": Date }
  ```
- **Transactions**:
  ```json
  { "_id": ObjectId, "userId": ObjectId, "type": String, "amount": Number, "status": String, "createdAt": Date }
  ```
- **KYC**:
  ```json
  { "_id": ObjectId, "userId": ObjectId, "aadhar": String, "pan": String, "documents": [String], "status": String, "createdAt": Date }
  ```

## Notes
- **Admin Control**: You have full control via the admin panel to manage users, set trade outcomes, adjust balances, and approve KYC.
- **User IDs**: Each user gets a unique random ID (UUID) on signup, visible in the admin panel.
- **Payments**: Deposits/withdrawals require customer support approval. Contact support via live chat (placeholder in frontend).
- **Live Chat**: Placeholder included; integrate Tawk.to or similar for production.
- **Security**: Use HTTPS and a strong `JWT_SECRET`. No personal funds are required for operation.
- **Frontend**: Professional design with Tailwind CSS, accessible to all users.

## Creating the ZIP File