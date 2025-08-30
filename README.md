
# 🚀 CodeRiot: The Ultimate Competitive Coding Arena



CodeRiot is a full-featured competitive programming platform designed for developers to test their skills in real-time, head-to-head matches. It features a robust Python backend built with FastAPI, a dynamic React frontend, real-time matchmaking using WebSockets, a secure Docker-based code execution engine, and an integrated AI tutor to provide hints when you're stuck.

## ✨ Key Features

  * **Real-time Matchmaking**: Challenge other users to a live coding duel. The system uses a Redis-based queue for efficient pairing and WebSockets for instant communication.
  * **Secure Code Execution**: User-submitted code is run in an isolated Docker container on a separate judge server, ensuring a safe and sandboxed environment for multiple languages (Python, C++).
  * **Interactive Code Editor**: A feature-rich coding environment powered by Monaco Editor, with a split-pane layout for viewing the problem and test cases simultaneously.
  * **AI-Powered Hints**: Stuck on a problem? Get a high-level hint from **HintAI**, an AI tutor powered by Ollama, that analyzes your code and guides you without giving away the solution.
  * **Comprehensive User Authentication**: Secure JWT-based authentication for registration and login, including seamless Google OAuth2 integration and a full forgot/reset password flow.
  * **Problem Contribution & Review**: Users can contribute new problems to the platform through a dedicated submission form.
  * **Admin Dashboard**: A role-protected dashboard for administrators to review, approve, or reject user-submitted problems, ensuring content quality.
  * **Persistent Match State**: Reconnect to your active match even after a page refresh, thanks to client-side session storage.

-----

## 🏗️ Project Architecture

CodeRiot is built on a modern, decoupled architecture. The React single-page application (SPA) serves as the user interface, communicating with a powerful FastAPI backend that handles business logic, and a dedicated Judge Server that manages code execution.

1.  **Frontend (React)**: The user interacts with the React application. All actions, from logging in to submitting code, are initiated here.
2.  **Backend API (FastAPI)**: The central hub. It manages user data, stores problems in a PostgreSQL database, handles the matchmaking queue via Redis, and orchestrates communication between the user and the judge server.
3.  **Real-time Service (WebSockets)**: Integrated into the backend, this service manages live connections for matchmaking notifications and in-match events like an opponent solving the problem or quitting.
4.  **Judge Server (FastAPI + Docker)**: A separate, specialized microservice. It receives code from the main backend, creates a secure Docker container, executes the code against test cases, and returns the result (output, errors, or timeouts).

-----

## 🛠️ Tech Stack

### Frontend

  * **Framework**: React
  * **Routing**: React Router
  * **HTTP Client**: Axios
  * **Code Editor**: Monaco Editor
  * **UI & Styling**: Tailwind CSS, Lucide React (icons)
  * **State Management**: React Hooks (`useState`, `useEffect`, etc.)

### Backend & API

  * **Framework**: FastAPI
  * **ORM**: SQLAlchemy
  * **Database**: PostgreSQL
  * **Data Validation**: Pydantic
  * **Authentication**: JWT (`python-jose`), OAuth (`authlib`)

### Real-time, Caching & AI

  * **WebSockets**: For live matchmaking and in-match notifications.
  * **Caching/Queue**: Redis for the matchmaking queue and active match data.
  * **AI Integration**: Ollama

### Code Execution Judge

  * **Containerization**: Docker
  * **API**: FastAPI

-----

## ⚙️ Setup and Installation

Follow these steps to get CodeRiot running locally.

### Prerequisites

  * Node.js v16+ and npm/yarn
  * Python 3.8+
  * Docker and Docker Compose
  * PostgreSQL
  * Redis
  * Ollama (with a model like `llama3` or `codellama` pulled)

### 1\. Clone the Repository

```bash
git clone <your-repo-url>
cd coderiot
```

### 2\. Backend Setup

  * Navigate to the backend directory.
  * Create and activate a Python virtual environment.
  * Install dependencies: `pip install -r requirements.txt`.
  * Create a `.env` file based on the example in the **Environment Variables** section below.
  * Run the database and Redis services: `docker-compose up -d db redis` (requires a `docker-compose.yml` file).

### 3\. Frontend Setup

  * Navigate to the frontend directory.
  * Install dependencies: `npm install` or `yarn install`.
  * Create a `.env.local` file based on the example in the **Environment Variables** section below.

### 4\. Running the Application

1.  **Start the Judge Server**:
    ```bash
    # In a new terminal, from the backend directory
    uvicorn judge_server:app --host 0.0.0.0 --port 8001 --reload
    ```
2.  **Start the Main Backend Server**:
    ```bash
    # In another terminal, from the backend directory
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ```
3.  **Start the Frontend Development Server**:
    ```bash
    # In a final terminal, from the frontend directory
    npm run dev
    ```

You should now be able to access the application at `http://localhost:5173` (or your configured frontend port).

-----

## 🔑 Environment Variables

You will need to create `.env` files for both the backend and frontend.

### Backend `.env`

```ini
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/coderiot_db"

# JWT Secret
SECRET_KEY="your-super-secret-key-for-jwt"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=60
RESET_TOKEN_EXPIRE_MINUTES=15

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379
MATCHMAKING_QUEUE_KEY="matchmaking_queue"

# Judge Server URL (as seen from the backend)
JUDGE_SERVER_URL="http://localhost:8001/execute"

# AI Hint Service
ollama_url="http://localhost:11434/api/generate"
ollama_model="llama3"

# Frontend URL (for redirects)
frontend_url="http://localhost:5173"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Frontend `.env.local`

```ini
# URL for the main FastAPI backend
VITE_API_URL=http://localhost:8000

# WebSocket URL for matchmaking
VITE_WS_URL=ws://localhost:8000

# URL for the Judge Server (used for local testing)
VITE_JUDGE_SERVER_URL=http://localhost:8001
```

-----

## 🗺️ API Endpoints

A summary of the available API routes. Note that some endpoints require admin privileges.

### Authentication (`/api/auth`)

  * `POST /register`: Create a new user account.
  * `POST /login`: Log in and receive a JWT.
  * `GET /profile`: Get the profile of the currently logged-in user. Must return user role for admin access.
  * `GET /google`: Redirect to Google for OAuth2 authentication.
  * `GET /google/callback`: Callback endpoint for Google OAuth.
  * `POST /forgot-password`: Request a password reset link.
  * `POST /reset-password`: Set a new password with a valid token.

### Matchmaking (`/api/match`)

  * `WEBSOCKET /ws/matchmaking`: Connect to join the matchmaking queue or reconnect to a match.
  * `POST /quit`: Forfeit and quit an active match.

### Problems & Submissions (`/api`)

  * `POST /problems/submit-problem`: Submit a new problem for review.
  * `POST /submission`: Submit code for a problem to be judged.
  * `POST /problems/{problem_id}/hint`: Request an AI-generated hint.

### Admin (`/api/problems`)

  * `GET /pending`: **(Admin)** Fetch all problems awaiting review.
  * `POST /{problem_id}/approve`: **(Admin)** Approve a pending problem.
  * `POST /{problem_id}/reject`: **(Admin)** Reject a pending problem.

-----

