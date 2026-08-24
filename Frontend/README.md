# JoinEazy

JoinEazy is a full-stack academic group and assignment management platform that helps students collaborate in groups and helps professors manage assignments and submissions.

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

## Setup

```bash
git clone https://github.com/your-username/joineazy.git
cd joineazy
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

Create a `.env` file inside `Backend`:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Main Modules

- Authentication
- Student Dashboard
- Group Management
- Assignment Management
- Submission Management
- Professor/Admin Dashboard

## Author

**Akhil Sai**

Full Stack Developer
