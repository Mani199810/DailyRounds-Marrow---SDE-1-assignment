# DailyRounds/Marrow - SDE I Assignment
![Image](https://github.com/user-attachments/assets/b204175e-b58b-420c-8179-aa5279cbc790)
![Image](https://github.com/user-attachments/assets/2f79d214-7259-4a6f-9d9d-97ebb3a193bb)
![Image](https://github.com/user-attachments/assets/d1ca3171-042e-4eb3-ada4-6dad7e35d054)



This project is a Full Stack web application built using the following technologies:

## Tech Stack

- Node.js (v18.x)
- Express.js
- MongoDB
- React.js
- Redux
- Multer (for file uploads)
- Passport.js (for OAuth authentication)
- Express Validator (for input validation)
- Helmet.js (for security enhancements)

## Installation and Setup

Follow these steps to clone and run the application locally:

### Clone the Repository
```bash
git clone https://github.com/Mani199810/DailyRounds-Marrow---SDE-1-assignment.git
cd DailyRounds-Marrow---SDE-1-assignment
```
### Environment Variables
Create a `.env` file in the root directory with the following keys:
```
PORT=5000
MONGO_URL=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

### Install Dependencies
cd server
npm install
cd client
npm install
```


### Start the Application
Run the following command to start both the backend and frontend:

### Individual Starts
To run only the backend:
cd server
npm run start-server
```

To run only the frontend:
```bash
npm run start
```

- The server will run on `http://localhost:5000`
- The client will run on `http://localhost:3000`

## User Registration

- Users must register if they do not already exist in the system.

## API Endpoints

| Method | Endpoint           | Description            |
|--------|--------------------|------------------------|
| POST   | /api/auth/register | Register a new user    |
| POST   | /api/auth/login    | User login             |
| GET    | /api/tasks         | Get all tasks          |
| POST   | /api/tasks         | Create a new task      |
| PUT    | /api/tasks/:id     | Update a specific task |
| DELETE | /api/tasks/:id     | Delete a specific task |

## Features

-  User Authentication with JWT and OAuth (Google)
-  Task Management (CRUD Operations)
-  Secure API with Input Validation and Error Handling

## Contact

For any queries or concerns, please reach out to:
- Manikanta: [mania2621@gmail.com](mailto:mania2621@gmail.com) or 7204194541
=======
