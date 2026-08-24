# JoinEazy

[Live Demo](https://join-eazy.netlify.app/)

JoinEazy is a full-stack academic group and assignment management platform that helps students collaborate in groups and helps professors/admins manage assignments and submissions.

## Features

- Student and Professor/Admin authentication
- Role-based access control
- Create and join student groups
- Group member management
- Assignment creation and management
- Course, professor and due-date information
- OneDrive submission links
- Assignment submission confirmation
- Student progress tracking
- Professor/Admin dashboard
- Group and submission monitoring

## Tech Stack

- **Frontend:** React, React Router, Axios, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js, PostgreSQL
- **Authentication:** JWT, HTTP-only Cookies, bcrypt

## Architecture

```text
React Frontend
      |
      | Axios / REST API
      v
Express.js Backend
      |
      |-- Authentication & Role Middleware
      |-- Routes & Controllers
      v
PostgreSQL Database
```

The frontend communicates with the Express backend through REST APIs. The backend handles authentication, authorization, business logic and database operations. PostgreSQL stores users, groups, assignments and submissions.

## Database Schema & Relationships

Main tables:

- `users`
- `groups`
- `group_members`
- `assignments`
- `submissions`

```text
users
  |
  | 1:N
  v
groups
  |
  | 1:N
  v
group_members

assignments
  |
  | 1:N
  v
submissions
  |
  | N:1
  v
groups
```

Foreign-key constraints maintain relationships between users, groups, group members, assignments and submissions.

## API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Users

```text
GET /api/users/profile
```

### Groups

```text
POST /api/groups/create
GET /api/groups/my-group
GET /api/groups/all
```

### Assignments

```text
POST /api/assignments/create
GET /api/assignments/all
```

### Submissions

```text
POST /api/submissions/confirm
GET /api/submissions/my-submissions
GET /api/submissions/all
```

## Setup & Run

Clone the repository:

```bash
git clone https://github.com/Code-Akhilsai/Joineasy-task.git
cd Joineasy-task
```

### Backend

```bash
cd Backend
npm install
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Create `Backend/.env`:

```env
PORT=3000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRETE_KEY=your_jwt_secret
```

## Key Design & Deployment Decisions

- React was used for a component-based responsive frontend.
- Express.js provides REST APIs for the application.
- PostgreSQL was selected for relational data and foreign-key constraints.
- JWT authentication is handled using HTTP-only cookies.
- bcrypt is used for password hashing.
- Role-based middleware separates student and admin access.
- OneDrive links are stored instead of uploading files directly.
- Frontend is deployed on Netlify.
- Backend is deployed on Render.

## Project Links

**GitHub Repository:**  
https://github.com/Code-Akhilsai/Joineasy-task

**Working Demo Video:**  
https://drive.google.com/file/d/1PZzpGSj8OpVRpDzWiPw7CZHf5mJYLClB/view?usp=sharing

**Live Site / Platform:**  
https://join-eazy.netlify.app/

## Author

**Akhil Sai**  
Full Stack Developer
