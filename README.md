# Blog Management System

A full-stack blog management system built with **MongoDB, Express.js, React, and Node.js**. Features comprehensive authentication, role-based access control, post management, and public blog interface.

## Prerequisites

- **Node.js** v14.0 or higher
- **MongoDB** (local installation or MongoDB Atlas cloud)
- **npm** or yarn package manager

## Project Overview

This is a complete MERN stack application with the following features:

- ✅ JWT-based user authentication with refresh tokens
- ✅ Role-based access control (Admin & Author roles)
- ✅ Post management (create, edit, delete, publish/draft)
- ✅ Full-text search and pagination
- ✅ Comments system
- ✅ Custom React hooks and error boundaries
- ✅ Responsive design

## Backend Setup

### 1. Navigate to backend directory

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

Create a file named `.env` in the `backend/` directory with the following variables:

```env
MONGO_URI=mongodb://localhost:27017/blog_assessment
JWT_SECRET=your-super-secret-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this
PORT=5000
```

**Note:**

- For MongoDB Atlas, use: `mongodb+srv://username:password@cluster.mongodb.net/blog_assessment`
- Replace secret keys with strong, unique values in production

### 4. Start the backend server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Available Backend Endpoints

**Authentication:**

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token

**Posts:**

- `GET /api/posts` - Get all published posts (public)
- `GET /api/posts/my` - Get user's posts (authenticated)
- `POST /api/posts` - Create post (author/admin)
- `PUT /api/posts/:id` - Update post (owner/admin)
- `DELETE /api/posts/:id` - Delete post (owner/admin)
- `PATCH /api/posts/:id/status` - Toggle post status (owner/admin)

**Comments:**

- `GET /api/posts/:postId/comments` - Get post comments (public)
- `POST /api/posts/:postId/comments` - Add comment (authenticated)

**Statistics:**

- `GET /api/posts/stats` - Get post statistics (public)

## Frontend Setup

### 1. Navigate to frontend directory

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

Create a file named `.env` in the `frontend/` directory:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### 4. Start the frontend application

```bash
npm start
```

The application will open at `http://localhost:3000`

## Testing Features

### Test Role-Based Access

**Register as Author:**

1. Go to http://localhost:3000/register
2. Fill in name, email, password
3. Select role: **Author**
4. Click Register
5. Navigate to Dashboard to create posts

**Register as Admin:**

1. Same process but select role: **Admin**
2. Admin can edit/delete any post, not just their own

### Key Features to Test

| Feature           | Steps                                                  |
| ----------------- | ------------------------------------------------------ |
| **Create Post**   | Dashboard → Fill form → Create Post                    |
| **Publish Post**  | Dashboard → Click "Publish" on draft post              |
| **Search Posts**  | Public page → Enter search term → See filtered results |
| **View Comments** | Click into a post → View comments section              |
| **Add Comment**   | On post page → Enter comment → Submit                  |
| **Edit Post**     | Dashboard → Click "Edit" → Modify → Update             |
| **Delete Post**   | Dashboard → Click "Delete" → Confirm                   |
| **Pagination**    | Public page → Use Previous/Next buttons                |

### Sample Test Workflow

1. **Create test accounts:**
   - Author account (email: author1@test.com)
   - Admin account (email: admin1@test.com)

2. **Test as Author:**
   - Log in with author account
   - Create 3 draft posts
   - Publish 2 posts
   - Try to edit another author's post (should fail)

3. **Test as Admin:**
   - Log in with admin account
   - View all posts
   - Edit other users' posts (should work)
   - Delete any post (should work)

4. **Test Public Features:**
   - Log out
   - Browse published posts on home page
   - Search by keywords
   - Try pagination
   - Add comments to published posts

## Project Structure

```
blog-management-system/
├── backend/
│   ├── models/           # Mongoose schemas (User, Post, Comment)
│   ├── controllers/      # Business logic for auth, posts, comments
│   ├── routes/           # API route definitions
│   ├── middleware/       # Auth middleware (JWT verification)
│   ├── server.js         # Express app setup
│   ├── package.json      # Dependencies
│   └── .env              # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── contexts/     # React Context for state management
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Full-page components
│   │   ├── styles/       # CSS files
│   │   ├── App.js        # Main app component with routing
│   │   └── index.js      # React entry point
│   ├── public/           # Static files
│   ├── package.json      # Dependencies
│   └── .env              # Environment variables
│
└── README.md             # This file
```

## Features

**Backend:**

- JWT-based authentication with refresh tokens
- Role-based access control (Admin/Author)
- Complete post CRUD operations
- Full-text search and pagination
- Comment system
- MongoDB aggregation for statistics
- Input validation with Joi
- Secure password hashing

**Frontend:**

- User authentication and registration
- Protected routes with role checking
- Author dashboard for post management
- Public blog with search and browsing
- Custom React hooks (useAuth, usePosts)
- Optimistic UI updates
- Error boundary components
- Responsive design

## Technology Stack

**Backend:**

- Node.js & Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- Bcryptjs (password hashing)
- Joi (input validation)

**Frontend:**

- React 18
- React Router v6
- Axios (HTTP client)
- Context API (state management)
- CSS 3

## Deployment

### Deploy Backend

1. Push code to GitHub
2. Deploy to Heroku, Vercel, or Railway
3. Set environment variables on hosting platform
4. Update frontend `REACT_APP_API_BASE_URL` to your deployed backend URL

### Deploy Frontend

1. Update `.env` with your deployed backend URL
2. Run `npm run build`
3. Deploy `build/` folder to Vercel, Netlify, or GitHub Pages

## License

MIT

---

**Built as a MERN Stack Assessment Project**
