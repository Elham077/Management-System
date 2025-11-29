# **Management Information System (MIS)**

Welcome to the MIS (Management Information System) repository!
This project is built using the MERN stack and provides a complete solution for managing tasks, expenses, and user operations in an organized and efficient way.

## **Features**

* **User Authentication:** Secure login and registration system.
* **Task Management:** Create, edit, update, and delete tasks easily.
* **Expense Tracking:** Record and manage expenses in a simple and fast interface.
* **Full CRUD Operations:** Update or delete all records, including Tasks and Expenses.
* **View All Records:** Access and review stored data with proper permissions.
* **Clean UI:** Simple and user-friendly interface for smooth interaction.

## **Getting Started**

To get started with this project, follow these steps:

1. Fork this repository

2. Clone this repository to your local machine:

```bash
git clone https://github.com/Elham077/Management-System.git
```

3. Install the required dependencies for both the backend and frontend:

```bash
cd Management-System
cd backend && npm install
cd ../ && cd frontend && npm install
```

4. Make a .env file in the server and copy the following line:

```bash
MONGO_URI = mongodb://127.0.0.1:27017/abc
JWT_Token = yourr token
JWT_Expire = 30d
AdminInviteToken = as_you_wish
```

5. Configure the database connection in the backend. You can use MongoDB Atlas or a local MongoDB server.

6. Start the backend server:

```bash
cd backend && npm start
```

7. Start the frontend application:

```bash
cd frontend && npm start
```

8. Access the application in your web browser at: [http://localhost:3000](http://localhost:3000)

If you have any questions or need assistance, feel free to reach out.

Happy Coding!
