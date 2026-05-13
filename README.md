# Task Management System (TaskFlow)

## 📌 Project Overview
TaskFlow is a full-stack Task Management System designed to help users organize their daily tasks and notes efficiently. It features a robust role-based access control system, distinguishing between standard Users and Administrators. 

Users can manage their personal tasks and notes, while Administrators have access to a dedicated dashboard to oversee all users, assign tasks globally, and manage system-wide notes and metrics.

## 💻 Technology Stack Used

### Frontend
*   **Library:** React.js
*   **Routing:** React Router v7
*   **HTTP Client:** Axios
*   **Styling:** Custom CSS & CSS Modules (with modern glassmorphism UI)
*   **State Management:** React Hooks (useState, useEffect)

### Backend
*   **Framework:** Java Spring Boot
*   **Security:** Spring Security & JWT (JSON Web Tokens)
*   **Database:** PostgreSQL
*   **ORM:** Spring Data JPA / Hibernate

---

## 🚀 Setup and Run Instructions

### Prerequisites
*   Node.js (v16 or higher)
*   Java Development Kit (JDK 17 or higher)
*   PostgreSQL installed and running

### 1. Database Setup
1. Open pgAdmin or your PostgreSQL command line.
2. Create a new database named `task_db`.

### 2. Backend Setup
1. Navigate to the `backend` directory.
2. Run the application using the Maven wrapper:
   ```bash
   # Windows
   .\mvnw.cmd spring-boot:run

   # Mac/Linux
   ./mvnw spring-boot:run
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```

---

## 🔗 Live URLs (Local Development)

*   **Frontend Application:** ``
*   **Frontend Admin Portal:** ``
*   **Backend API Base URL:** ``

---

## 🔑 Demo Credentials

You can use the following credentials to test the system:

**Standard User:**
*   **Email:** `user@example.com`
*   **Password:** `password123`
*(Note: You can also register a new user from the Signup page)*

**Administrator:**
*   **Email:** `admin@gmail.com`
*   **Password:** `admin123`
*(Note: Must log in through the `/admin/login` portal)*

---

## 📚 API Documentation

### Authentication (`/auth`)
*   `POST /auth/register` - Register a new user
*   `POST /auth/login` - Authenticate user and receive JWT token
*   `GET /auth/profile` - Get logged-in user profile

### Tasks (`/tasks`)
*   `GET /tasks` - Get all tasks
*   `POST /tasks` - Create a new task
*   `GET /tasks/{id}` - Get task by ID
*   `PUT /tasks/{id}` - Update a task
*   `DELETE /tasks/{id}` - Delete a task
*   `GET /tasks/user/{userId}` - Get all tasks for a specific user

### User Notes (`/notes`)
*   `GET /notes?userId={id}` - Get all notes for a user
*   `POST /notes` - Create a new note
*   `PUT /notes/{id}` - Update a note
*   `DELETE /notes/{id}` - Delete a note

### Admin System (`/admin`) - *Requires Admin JWT*
*   `GET /admin/metrics` - Get system-wide statistics (total users, tasks, status counts)
*   `GET /admin/tasks` - Get all tasks across the system
*   `POST /admin/tasks` - Assign a task to any user
*   `PUT /admin/tasks/{id}` - Edit any task
*   `DELETE /admin/tasks/{id}` - Delete any task
*   `GET /admin/users` - Get a list of all registered users
*   `GET /admin/notes` - Get admin-specific system notes
*   `POST /admin/notes` - Create an admin note
*   `PUT /admin/notes/{id}` - Update an admin note
*   `DELETE /admin/notes/{id}` - Delete an admin note
