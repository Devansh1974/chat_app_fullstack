# 💬 Chatty - Modern Full-Stack Real-Time Chat Platform

<div align="center">
  <img src="frontend/public/logo.png" alt="Chatty Logo" width="120" />
  <h3>Seamless, low-latency messaging crafted with the PERN stack</h3>

  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
  [![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

---

🚀 **Live Demo:** [https://chatty-onlinechattingapp.onrender.com](https://chatty-onlinechattingapp.onrender.com)

---

## 📸 Screenshots

![Login Page](frontend/assets/Login.png)
![Settings](frontend/assets/setting.png)
![Themes](frontend/assets/themes.png)

---

## ✨ Complete Feature Overview

### ⚡ 1. Real-Time Chat Experience
- **Instant Messaging:** Bi-directional real-time communication powered by **Socket.IO** with near-zero latency.
- **Live Typing Feedback:** Dual visual indicators — a pulse status in the chat header and an animated 3-dot bouncing bubble inside the conversation when the other user is actively typing.
- **In-App Audio Chimes:** Custom notification sounds synthesized via the **Web Audio API** with zero external `.mp3` asset dependencies (100% reliable, no 404s).
- **Unread Message Badges:** Real-time counter pills badge contacts who sent messages while their conversation wasn't active.
- **Delivery Status Ticks:** Outgoing messages display WhatsApp-style double checkmarks (`CheckCheck`) confirming delivery.
- **Interactive Emoji Picker:** Built-in categorized popover (Smileys, Gestures, Hearts, Food & Fun) to insert emojis instantly into any message.
- **Quick Message Copy:** Hover over any message to copy its text to the clipboard with 1 click.
- **In-Chat Message Search:** Search icon in the active conversation header filters and highlights matching messages on the fly.
- **Floating Scroll-To-Bottom:** Dynamic downward button appears when scrolling up through chat history to smoothly glide back to the latest message.

### 👤 2. Zero-Friction Authentication & Guest Access
- **1-Click "Continue as Guest":** Evaluators, recruiters, and friends can explore the app instantly without creating an account or entering passwords. The server auto-provisions a guest user on the fly if one does not exist.
- **Instant Demo Switcher:** Quick demo buttons (*Priya*, *Rohan*) let you test two-way real-time messaging between regular and Incognito windows in seconds.
- **Secure Auth Pipeline:** JSON Web Tokens (JWT) stored in `HttpOnly`, `SameSite=None`, `Secure` cookies to prevent XSS and support cross-domain deployments. Passwords hashed using `bcryptjs`.

### 🎨 3. UI/UX & Design System
- **Transparent Brand Logo:** Vibrant neon gradient chat bubbles with 100% transparent background that seamlessly integrates across light and dark themes.
- **32 DaisyUI Themes:** Full support for themes including Cyberpunk, Synthwave, Retro, Coffee, Cupcake, Night, and Forest with instant live preview.
- **Responsive Layout:** Optimized for mobile phones, tablets, laptops, and ultra-wide displays.
- **Client-Side Image Optimization:** Auto-compresses camera images via HTML5 Canvas before uploading to Cloudinary, preventing `PayloadTooLargeError` and speeding up transfers.

---

## 🐘 Database Architecture: How It Works Under The Hood

```mermaid
graph TD
    A[React Client] -->|HTTP / REST| B[Express.js Server]
    A <-->|WebSockets| C[Socket.IO Gateway]
    B -->|Prisma Client| D[Prisma ORM Layer]
    D -->|PostgreSQL Connection Pool| E[(Neon Serverless Postgres)]
```

### 1. Relational Tables & Strict Foreign Keys
Unlike NoSQL document stores where data references can break, **PostgreSQL** enforces strict relational integrity at the engine level using **Foreign Keys**:

```prisma
model User {
  id               String    @id @default(uuid())
  email            String    @unique
  fullName         String
  password         String
  profilePic       String    @default("")
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  sentMessages     Message[] @relation("SentMessages")
  receivedMessages Message[] @relation("ReceivedMessages")
}

model Message {
  id         String   @id @default(uuid())
  senderId   String
  receiverId String
  text       String?
  image      String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  sender     User     @relation("SentMessages", fields: [senderId], references: [id], onDelete: Cascade)
  receiver   User     @relation("ReceivedMessages", fields: [receiverId], references: [id], onDelete: Cascade)

  @@index([senderId, receiverId])
}
```

* **Cascade Deletion (`onDelete: Cascade`):** If a user account is deleted, all their associated messages are cleaned up automatically.
* **Composite B-Tree Indexing (`@@index([senderId, receiverId])`):** Ensures queries fetching conversations between any two users execute in sub-millisecond time.

### 2. How Queries Flow (Step-by-Step)
1. **User Login / Guest Access:**
   `prisma.user.findUnique({ where: { email } })` checks the indexed `email` column. If logging in as guest and no account exists, `prisma.user.create()` generates one instantly.
2. **Retrieving Conversation History:**
   ```javascript
   const messages = await prisma.message.findMany({
     where: {
       OR: [
         { senderId: myId, receiverId: friendId },
         { senderId: friendId, receiverId: myId },
       ],
     },
     orderBy: { createdAt: "asc" },
   });
   ```
   PostgreSQL uses the composite index to find all messages between the two IDs and sorts them chronologically.
3. **Preserving Frontend Compatibility:**
   PostgreSQL uses `id` (UUID). Our controllers return `{ ...record, _id: record.id }`, ensuring the existing frontend code remains 100% compatible.

### 3. Why Neon Serverless PostgreSQL?
* **No IP Whitelisting Roadblocks:** Cloud hosts (Render, Railway) use dynamic IP addresses that frequently trigger connection timeout errors on MongoDB Atlas. Neon uses secure connection strings with SSL, connecting instantly on any host.
* **Connection Pooling:** Uses PgBouncer pooling (`-pooler` connection string) to handle thousands of concurrent queries without exhausting database connections.

---

## 🛠️ Getting Started

### ⚙️ Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- A free PostgreSQL database from [Neon.tech](https://neon.tech)
- Cloudinary credentials for image storage

---

### 🔧 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Devansh1974/chat_app_fullstack.git
   cd chat_app_fullstack
   ```

2. **Install dependencies:**
   ```bash
   npm install --prefix backend
   npm install --prefix frontend
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in `backend/` (see `backend/.env.example`):
   ```env
   PORT=5001
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key

   # Your Neon PostgreSQL Connection String:
   DATABASE_URL="postgresql://username:password@ep-something.us-east-2.aws.neon.tech/neondb?sslmode=require"

   # Cloudinary Credentials:
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Sync Schema & Seed Demo Accounts:**
   ```bash
   # Push tables directly to Neon PostgreSQL
   npm run db:push --prefix backend

   # Populate demo users (Priya, Rohan, Sneha, etc.)
   npm run seed --prefix backend
   ```

5. **Start Development Servers:**
   ```bash
   # Backend (http://localhost:5001)
   npm run dev --prefix backend

   # Frontend (http://localhost:5173)
   npm run dev --prefix frontend
   ```

6. **Inspect Database via Prisma Studio GUI:**
   ```bash
   npm run db:studio --prefix backend
   ```
   Opens an interactive database dashboard at `http://localhost:5555`.

---

## ☁️ Deployment (Render / Railway)

1. Connect your repository to **Render** as a Web Service.
2. Build Command: `npm run build`
3. Start Command: `npm start`
4. Environment Variables:
   - `DATABASE_URL` (Your Neon connection string)
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `NODE_ENV=production`

---

## 📄 License
This project is open source and available under the [ISC License](LICENSE).

## 👨‍💻 Author
Crafted by **[Devansh Singh](https://www.linkedin.com/in/devanshsingh2006)**
