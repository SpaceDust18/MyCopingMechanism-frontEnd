# MyCopingMechanism Frontend

A responsive React-based frontend for the **MyCopingMechanism** platform — a mental wellness and self-care application designed to encourage daily reflections, community sharing, and healthy habits.

This repo houses the **user-facing interface**, styled with a clean, modern glassmorphism UI. It integrates with the backend API (Express + PostgreSQL) to provide authentication, posting, reflections, and interactive features.

---

## ✨ Features

- **Authentication**: Register, log in, and manage user profiles with JWT-secured sessions.  
- **Daily Reflections**: Post, edit, and delete reflections in real time using Socket.IO.  
- **Posts & Blog**: View and create posts (with admin-only new post feature).  
- **Nutrition & Hobbies Sections**: Lifestyle-focused areas for wellness resources.  
- **Comments & Messaging**: Connected comments system with ownership checks.  
- **Search**: Utility to search across posts.  
- **Modern UI**: Glassmorphism theme with Orbitron font and responsive layouts.  
- **Error Handling**: Custom 404 page and graceful fallbacks.  

---

## 🛠 Tech Stack

- **Frontend**: React, React Router, Vite  
- **State Management**: useState, Context (planned for cart/order style state)  
- **Real-Time**: Socket.IO client integration  
- **Styling**: Custom CSS (glassmorphism + neon)  
- **Backend (separate repo)**: Express, PostgreSQL, JWT Auth  

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/MyCopingMechanism-frontend.git
cd MyCopingMechanism-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 🔑 Environment Variables

Create a `.env` file in the project root with:

```
VITE_API_BASE_URL=http://localhost:5050
```

Point this to your backend server (local or deployed).

---

## 📂 Project Structure

```
src/
├── App.jsx                # Main app entry, routes
├── api/                   # API configuration
├── hooks/                 # Custom React hooks (socket, auth, etc.)
├── SiteComponents/        # Forms, Sections, Utility Components
│   ├── Forms/             # Login, Register, NewPost, etc.
│   ├── Sections/          # Profile, About, Nutrition, Reflections, etc.
│   └── Home.jsx           # Landing page
├── pages/                 # Page-level components (ReflectionsPage, etc.)
├── styles/                # CSS files (glassmorphism theme)
└── main.jsx               # React entry point
```

---

## 📸 Screenshots

_Example UI (add screenshots here):_
- Login / Register  
- Daily Reflections  
- Blog / Posts  
- Profile Page  

---

## 🧪 Testing

- Manual testing with local backend (`npm run dev`).  
- API routes tested with Postman.  
- Socket.IO events tested in browser console.  

---

## 🌱 Future Enhancements

- Global notifications system (new comments, messages, reflections).  
- Context-based state management for smoother data flow.  
- Rich text editor for posts and reflections.  
- User profile customization (avatars, bios, saved content).  
- Mobile-first refinements and accessibility improvements.  
- Deployment on **Vercel/Netlify** (frontend) and **Render/Railway** (backend).  
- **Glassmorphism-inspired CSS style guide** to unify visuals across all sections.  

---

## 👩‍💻 Author

Developed by **Claudia Arias** — aspiring full-stack developer with a focus on building meaningful, user-friendly applications that promote wellness and community.

---
