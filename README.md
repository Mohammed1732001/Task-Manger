# 📦 Task-Manger

Task-Manger is a full-featured task management system built with the MERN Stack (MongoDB, Express.js, React, Node.js). It allows users to create and assign tasks to either individuals or teams, track task progress, and manage projects efficiently with proper role-based access control.

---

## ✅ Features

- 🔐 Role-based access (Owner, Manager, Team Leader, User)
- 🧾 Create and manage projects
- ✅ Add tasks with title, description, priority, status, and deadline
- 👤 Assign tasks to specific users or entire teams
- 🧠 Filter "Created By" dropdown to show only Owner, Manager, or Team Leader roles
- 👥 Dynamically load team members in "Assigned To User" after selecting a team
- 📅 Deadline field with date validation
- 🔄 Real-time state updates using React hooks

---

## 💻 Tech Stack

| Layer        | Technology                          |
|--------------|--------------------------------------|
| Frontend     | React.js, React Router, Bootstrap    |
| Backend      | Node.js, Express.js                  |
| Database     | MongoDB (via Mongoose)               |
| HTTP Client  | Axios                                |
| Authentication | JWT (JSON Web Token)              |
| State Management | React Hooks (`useState`, `useEffect`) |

---

## ⚙️ Installation
npm install

Create a .env file with the following values:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

npm start


