# 📺 MovieCapstoneProject

## Welcome to the **MovieCapstoneProject** – a powerful movie recommendation system built for our final capstone! 🍿🎓  
This project helps users discover new films based on preferences, trends, and intelligent algorithms.

## ⚙️ Tech Stack

- 🖥️ **Frontend**: React.js and React Native Expo  
- 🐍 **Backend**: Django, Python  
- 🗃️ **Database**: MySQL with AWS RDS  
- 🌐 **API Integration**: TMDb / IMDb APIs  
- ☁️ **Cloud Hosting**: AWS (for backend and DB deployment)


## 🚀 Features

- ⭐ **Personalized Recommendations** – Tailored to individual preferences and ratings  
- 🔍 **Search Functionality** – Discover movies and TV shows  
- 🧠 **AI Chatbot** – Ask for suggestions or explore actors, genres, moods  
- 📅 **Track Watch History** – Mark content as completed or saved for later  
- 🔄 **Filter & Sort Options** – Organize by genre, rating, or viewing status  
- 🔐 **Secure User Accounts** – Sign-up/login, profile management, and settings

## 📁 Project Structure

```bash
MovieCapstoneProject/
├── CapstoneProject/             # ⚛️ React Native frontend (Expo)
│   ├── api/                     # 📡 API calls to backend
│   ├── assets/                  # 🖼️ Icons, images, and static files
│   ├── components/              # 🧩 Reusable React components
│   ├── App.js                   # 🚀 Root component
│   ├── index.js                 # 📦 Entry point
│   ├── package.json             # 📦 Project metadata and dependencies
│   └── app.json                 # ⚙️ Expo configuration

├── moviecapstone/              # 🐍 Django backend
│   ├── backend/                # 🧠 API logic and recommendation engine
│   ├── moviecapstone/          # ⚙️ Django app config
│   ├── models.py               # 🧾 Database models
│   ├── db.sqlite3              # 🗃️ Local dev database (SQLite)
│   ├── manage.py               # ⚙️ Django project manager
│   └── .gitignore              # 🚫 Files to ignore in version control

└── README.md                   # 📘 Project documentation
```
## 🛠️ Installation

### 1. Clone the repo

```bash
git clone https://github.com/Abelaash/MovieCapstoneProject.git
cd MovieCapstoneProject
```
### 2. 🌐 Frontend Setup (CapstoneProject folder)
```bash
cd CapstoneProject
# Install dependencies
npm install

# Start the server
npm start
```
### 3.  🐍 Backend Setup (MovieCapstone folder)
```bash
cd moviecapstone

#Create and activate virtual environment
python -m venv venv

# On Windows
venv\Scripts\activate 

# On macOS/Linux
source venv/bin/activate 

# Start the Django server
python manage.py runserver


