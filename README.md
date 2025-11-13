# 📅 InMyTime: Collaborative Time Polling App

**InMyTime** is a simple and effective polling application designed to easily determine the **best common availability** for all participants. Scheduling meetings or events just got easier!

## 🚀 Technologies Used (MERN Stack)

This project utilizes the **MERN stack** to build a modern and high-performance full-stack application:

* **MongoDB:** The NoSQL database for storing all poll and voting data.
* **Express.js:** The backend web application framework for Node.js, managing API routes.
* **React:** The JavaScript library used for building the user interface (frontend).
* **Node.js:** The runtime environment for executing the backend server code.

## ✨ Key Features

* **Easy Poll Creation:** Define the event title and select multiple proposed dates/time slots.
* **Anonymous Polling:** Users can submit their availability without requiring authentication (login/registration).
* **Common Time Detection:** Visual representation of all votes, with automatic highlighting of the most popular and commonly available time slots.
* **Shareable Links:** Easily distribute a unique URL for participants to access and vote on the poll.

## ⚙️ Installation and Setup

To run the application locally, both the backend (API) and the frontend (UI) must be set up and launched separately.

### Prerequisites

* **Node.js** (v18+ recommended)
* **npm** (v9+ recommended)
* **MongoDB** (A running local instance or a cloud-hosted MongoDB Atlas account)

### Repository Structure

The project is split into two main directories:

* `backend/`: Contains the Node.js/Express API and Mongoose models.
* `frontend/`: Contains the React application components and views.

### Configuration

Before launching, you must create an environment file to store sensitive data:

1.  **Backend Environment:** Create a file named **`.env`** inside the `backend/` folder and include your database connection string and server port:
    ```env
    PORT=5000
    MONGO_URI="mongodb+srv://<YOUR_USER>:<YOUR_PASSWORD>@cluster.mongodb.net/inMyTimeDB"
    ```
2.  **Frontend Environment (Optional):** Create a file named **`.env`** inside the `frontend/` folder to specify the API location:
    ```env
    REACT_APP_API_URL=http://localhost:5000/api
    ```

## 🤝 Contribution

If you would like to contribute to this project, please visit the [GitHub Issues page](https://github.com/KULLANICI_ADINIZ/inmytime-app/issues) or submit a Pull Request.

---