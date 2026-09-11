# 💬 Chatty - Real-Time Full-Stack Chat Application

**Chatty** is a modern, high-performance, real-time chat application built using the **PERN** stack (**PostgreSQL**, **Express.js**, **React.js**, **Node.js**) with **Prisma ORM** and **Socket.IO** for instant, low-latency messaging.

🚀 **Live Demo:** [https://chatty-onlinechattingapp.onrender.com](https://chatty-onlinechattingapp.onrender.com)

---

## 📸 Screenshots

![Login Page](frontend/assets/Login.png)
![Settings](frontend/assets/setting.png)
![Themes](frontend/assets/themes.png)

---

## ✨ Features & Upgrades

- ⚡ **Instant Real-Time Messaging:** Powered by **Socket.IO** with bi-directional event streaming.
- 🐘 **PostgreSQL & Prisma ORM:** Strict relational integrity with foreign keys, composite indexing, and type-safe database queries.
- 👤 **1-Click "Continue as Guest" Access:** Explore the full application instantly without registration or email verification.
- 👥 **Quick Demo Account Switcher:** One-click login as seeded demo users (*Priya*, *Rohan*) for easy dual-window real-time testing.
- ⌨️ **Live Typing Indicators:** Dual visual feedback with header status and animated 3-dot typing bubbles.
- 🔔 **In-App Audio Chimes:** Crystal-clear harmonic notification sounds generated using the **Web Audio API** (zero external assets required).
- 🔴 **Unread Message Badges:** Real-time badge counters track unseen incoming messages per conversation.
- 🔍 **Contact Search Filter:** Instantly filter contacts by name directly in the sidebar.
- 🖼️ **Client-Side Image Optimization:** Auto-resizes high-resolution camera photos via HTML5 Canvas before upload to prevent payload errors and accelerate Cloudinary delivery.
- 🎨 **32 Dynamic DaisyUI Themes:** Full dark/light/retro/cyberpunk theme customization with instant preview.
- 📱 **Fully Responsive:** Seamless layout crafted for mobile devices, tablets, and desktops.

---

## 🧑‍💻 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, DaisyUI, Axios, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL, Prisma ORM (Hosted on Neon Serverless) |
| **WebSockets** | Socket.IO |
| **Authentication** | JWT (JSON Web Tokens), HttpOnly Secure Cookies, bcryptjs |
| **Media Storage** | Cloudinary API |
| **State Management** | Zustand |

---

## 🛠️ Getting Started

### ⚙️ Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- A free PostgreSQL connection string (e.g. from [Neon.tech](https://neon.tech) or Supabase)
- Cloudinary account for media attachments

---

### 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Devansh1974/chat_app_fullstack.git
   cd chat_app_fullstack
   ```

2. **Install all dependencies:**
   ```bash
   npm install --prefix backend
   npm install --prefix frontend
   ```

3. **Configure Environment Variables:**
   Create a `.env` file inside `backend/` (refer to `backend/.env.example`):
   ```env
   PORT=5001
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key

   # PostgreSQL Connection String (Neon.tech or Supabase)
   DATABASE_URL="postgresql://username:password@ep-something.us-east-2.aws.neon.tech/neondb?sslmode=require"

   # Cloudinary Credentials
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Push Database Schema & Seed Demo Users:**
   ```bash
   # Push tables (User, Message) to PostgreSQL
   npm run db:push --prefix backend

   # Seed demo accounts
   npm run seed --prefix backend
   ```

5. **Start Local Development Servers:**
   ```bash
   # Start backend (http://localhost:5001)
   npm run dev --prefix backend

   # In a new terminal, start frontend (http://localhost:5173)
   npm run dev --prefix frontend
   ```

6. **Open Visual Database GUI (Prisma Studio):**
   ```bash
   npm run db:studio --prefix backend
   ```
   Open `http://localhost:5555` to view, query, and edit your live PostgreSQL database records.

---

## ☁️ Deployment (e.g. Render / Railway)

1. Connect your repository to **Render** as a Web Service.
2. Set the build command:
   ```bash
   npm run build
   ```
3. Set the start command:
   ```bash
   npm start
   ```
4. In the **Environment** settings, add:
   - `DATABASE_URL` (Your Neon PostgreSQL connection string)
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `NODE_ENV=production`

---

## 📄 License

This project is open source and available under the [ISC License](LICENSE).

---

## 👨‍💻 Author

Crafted by **[Devansh Singh](https://www.linkedin.com/in/devanshsingh2006)**
