# 🎬 Movie Explorer – Review Sentiment Analysis  

## 📌 Overview  
**Movie Explorer** is a full-stack web application where users can:  
- Browse and explore movies.  
- Sign up and log in securely.  
- View detailed movie information.  
- Post reviews and ratings.  
- Get **sentiment analysis** (positive / negative / neutral) for each review.  

The app is built using **HTML, CSS, JavaScript (frontend)** and **Node.js + Express + MongoDB (backend)**.  

---

## 🚀 Features  
- 🔐 User Authentication (Signup/Login with JWT)  
- 🎥 Movie browsing (list, search, details)  
- 📝 Review system with automatic **sentiment analysis**  
- 📊 Responsive UI for better experience  
- ✅ Database seeding with sample movies  

---

## 🛠️ Tech Stack  

**Frontend:**  
- HTML5, CSS3, JavaScript (Vanilla)  

**Backend:**  
- Node.js, Express.js  
- MongoDB (Mongoose ODM)  

**Other Tools:**  
- bcrypt.js & JWT for authentication  
- CORS & Nodemon for development  

---

## 📂 Project Structure  
---

```bash
Movie-Explorer/
│── index.html       # Homepage - movie grid
│── login.html       # Login page
│── signup.html      # Signup page
│── movie.html       # Movie details & reviews
│── script.js        # Homepage logic
│── login.js         # Login requests
│── signup.js        # Signup requests
│── movie.js         # Reviews & sentiment analysis
│
└── backend/         # Backend API
    ├── server.js
    ├── routes/
    ├── models/
    ├── controllers/
    ├── data/        # Sample movie data
    └── package.json
```
## 🚀 How to Use

1. Open the application.  
2. **Signup** → Create an account.  
3. **Login** → Enter credentials to access movies.  
4. **Browse movies** → Click on any movie to see details.  
5. **Add a review** → Instantly get its **sentiment analysis result**.  

---

## 🔮 Future Enhancements  

- 🌍 Integrate **TMDB API** for real movie data.  
- 🤖 Upgrade sentiment analysis with **advanced ML models**.  
- 📱 Make app fully **responsive for mobile devices**.  
- ☁️ Deploy backend (Render/Heroku) & frontend (Netlify/Vercel).  

---

## 👨‍💻 Tech Stack  

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express.js  
- **Database:** Sample JSON data *(future: MongoDB integration)*  
- **Extra:** Sentiment Analysis API  

# Clone repository
```bash
git clone https://github.com/your-username/movie-explorer.git
```

# Go to backend
```bash
cd movie-explorer/backend
```
# Install dependencies
```bash
npm install
```
# Seed database\
```
npm run seed
```
# Start backend
```
npm run dev
```
