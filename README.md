# AI-Driven Learning Platform

A mini learning platform that allows users to select what they want to learn by category and sub-category, send prompts to an AI to receive generated lessons, and view their learning history.

---

## Technologies Used

**Backend:**
- Node.js + TypeScript
- Express.js
- MongoDB + Mongoose
- OpenAI GPT API (gpt-4o)
- JWT Authentication (jsonwebtoken)
- bcrypt (password hashing)
- Winston (logging)
- swagger-jsdoc + swagger-ui-express (API documentation)
- cors
- dotenv

**Frontend:**
- React + TypeScript
- Vite
- Axios
- React Router DOM
- React Markdown
- React Icons

---

## Project Structure

```
AIDrivenLearningPlatform/
├── Project/                  # Backend
│   └── src/
│       ├── Models/           # Mongoose models (User, Category, SubCategory, Prompt)
│       ├── Services/         # Business logic layer
│       ├── Routers/          # API route handlers
│       │   └── Authentication/   # Auth routes (AuthenticationRouter, JwtUtils)
│       ├── Middleware/       # Auth, validation, error handling, logging
│       ├── Utils/            # AI service, DB connection, logger, Swagger config
│       ├── certs/            # Corporate CA certificate for SSL inspection
│       ├── app.ts            # Express app setup (middleware, routes)
│       └── server.ts         # Entry point — starts the HTTP server
└── client/                   # Frontend
    └── src/
        ├── pages/            # React pages (Login, Register, Dashboard, History, Admin)
        ├── components/       # Shared components (Navbar)
        ├── utils/            # Client-side utilities (auth token helpers)
        └── api.ts            # Axios API calls
```

---

## API Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | /auth/register | Register a new user | None |
| POST | /auth/login | Login and receive JWT token | None |
| GET | /user/categories | Get all categories | User |
| GET | /user/subcategories/:category_id | Get sub-categories by category | User |
| POST | /user/prompts | Send prompt to AI and save lesson | User |
| GET | /user/prompts/my-history | Get user's learning history | User |
| GET | /admin/users | Get all users (paginated) | Admin |
| GET | /admin/prompts | Get all prompts history (paginated) | Admin |
| GET | /admin/prompts/:user_id | Get prompts filtered by user | Admin |
| POST | /admin/categories | Create a new category | Admin |
| POST | /admin/subcategories | Create a new sub-category | Admin |

**Swagger UI:** `http://localhost:3000/api-docs`

---

## Assumptions

- Users are identified by a 9-digit ID (Israeli ID format)
- Passwords must be at least 8 characters and contain both letters and digits
- Admin accounts are created by providing a secret key during registration
- Categories and sub-categories are managed by admins only
- The AI generates lesson-like responses using OpenAI GPT API
- The project uses a corporate CA certificate (`Project/src/certs/corporate-ca.crt`) to handle SSL inspection on restricted networks. If running on a standard network, this file can be replaced with any trusted CA or removed — in that case, update `AIService.ts` to use the default Node.js TLS settings.

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd AIDrivenLearningPlatform
```

2. Install backend dependencies:
```bash
npm install
```

3. Create a `.env` file inside `Project/src/`:
```
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
ADMIN_SECRET=your_admin_secret_code
JWT_SECRET=your_jwt_secret
```

4. Run the backend (from the project root):
```bash
npm start
```

The server will start on `http://localhost:3000`

### Frontend Setup

1. Navigate to the client folder:
```bash
cd client
```

2. Install frontend dependencies:
```bash
npm install
```

3. Run the frontend:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

---

## Sample .env File

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?appName=AppName
OPENAI_API_KEY=sk-proj-...
ADMIN_SECRET=123456
JWT_SECRET=your_secret_key
```

---

## How to Run Locally

1. Start the backend server from the project root (Terminal 1):
```bash
npm start
```

2. Start the frontend (Terminal 2):
```bash
cd client && npm run dev
```

3. Open your browser at `http://localhost:5173`

4. To explore the API interactively, open `http://localhost:3000/api-docs`

---

## Example Use Case

1. Israel registers and selects **Science → Space**
2. He enters a prompt: *"Teach me about black holes"*
3. The system sends the prompt to OpenAI and returns a structured lesson
4. Israel can revisit the dashboard later to view all his lessons in the History page

---

## Bonus Features Implemented

The following optional bonuses from the task requirements were implemented:

- ✅ **TypeScript** — used in both frontend and backend
- ✅ **JWT-based user authentication** — all protected routes require a valid Bearer token; role-based access separates user and admin routes
- ✅ **Pagination and filtering in the admin dashboard** — users and prompts tables are paginated; prompts can be filtered by user
- ✅ **Swagger/OpenAPI documentation** — available at `http://localhost:3000/api-docs`
