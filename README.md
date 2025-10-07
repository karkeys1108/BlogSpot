# Blogspot Course Certification Platform

A full-stack MERN-inspired MVP for managing course discovery, enrollment tracking, and certificate management. The stack pairs a MongoDB-backed Express.js API with a React + Tailwind CSS frontend. Authentication supports JWT-based flows for students and faculty, plus Google OAuth.

## Features

- 🔐 **Authentication**: Email/password signup & login with role selection, JWT-protected APIs, Google OAuth sign-in flow.
- 📚 **Course Discovery**: Browse curated courses from providers like Coursera, Alison, and LinkedIn Learning sourced from seed data.
- ⚖️ **Course Comparison**: Select up to five courses and view a rich comparison table by title, provider, category, description, and level.
- 🧭 **Enrollment Tracking**: Track progress, status, and completion dates for enrolled courses.
- 📄 **Certificate Management**: Upload PDFs or images to Cloudinary (or local storage fallback) and retrieve them alongside enrollment context.

## Tech Stack

- **Backend**: Node.js, Express.js, Mongoose ODM, MongoDB, Passport Google OAuth, Cloudinary SDK
- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Axios
- **Shared Tooling**: ESLint, Nodemon, Heroicons, classnames

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 6+
- (Optional) Cloudinary account for certificate storage
- Google OAuth Client (optional but recommended)

### Backend Setup

```powershell
cd backend
npm install
cp .env.example .env   # update with your secrets
npm run seed:courses    # populate initial course catalog
npm run dev
```

Key environment variables (`backend/.env`):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blogspot
JWT_SECRET=supersecretjwtkey
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
FRONTEND_URL=http://localhost:5173
```

If Cloudinary keys are omitted, certificates fall back to local disk storage served from `/uploads`.

### Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

The Vite dev server proxies API calls to `http://localhost:5000`.

## API Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a student or faculty user. |
| `POST` | `/api/auth/login` | Email/password login returning JWT. |
| `GET` | `/api/auth/me` | Retrieve current user profile. |
| `GET` | `/api/courses` | List or filter courses via `search`, `provider`, `category`. |
| `GET` | `/api/courses/:id` | Fetch course detail. |
| `GET` | `/api/courses/compare?ids=...` | Compare multiple courses by ID. |
| `POST` | `/api/enrollments` | Enroll in a course (JWT required). |
| `GET` | `/api/enrollments/mine` | List a user’s enrollments with progress. |
| `PATCH` | `/api/enrollments/:id` | Update progress/status. |
| `POST` | `/api/certificates/:enrollmentId` | Upload a certificate (multipart/form-data). |
| `GET` | `/api/certificates/mine` | List certificates linked to enrollments. |

Example `GET /api/courses` response:

```json
{
  "data": [
    {
  "id": "669b0aece3f1f7d9c83a4c12",
      "title": "Full Stack Web Development",
      "provider": "Coursera",
      "category": "Development",
      "description": "Build modern web applications using HTML, CSS, JavaScript, and popular frameworks.",
      "level": "Intermediate",
      "url": "https://www.coursera.org/specializations/full-stack",
      "thumbnail": "https://images.example.com/courses/fullstack.jpg",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

Example enrollment progress update:

```http
PATCH /api/enrollments/669b0b2be3f1f7d9c83a4c45
Content-Type: application/json
Authorization: Bearer <JWT>

{
  "progress": 65,
  "status": "in-progress"
}
```

## Frontend Highlights

- Responsive dashboard with gradient hero, KPI cards, and enrollment timeline
- Course discovery grid with provider/category filters and inline enrollment
- Comparison worksheet with dynamic selection (up to five courses)
- Certificate tracker featuring upload form and action cards
- Auth pages styled with glassmorphism accents and Google OAuth CTA

## Development Notes

- The API connects via Mongoose; configure indexes or migrations with your preferred tooling if you need more control.
- JWT middleware protects enrollment and certificate routes; extend `authorize()` to gate faculty-only features.
- Integrate real Coursera or LinkedIn APIs by adapting `courseService.listCourses()` to merge external data.
- Tailwind configuration lives in `frontend/tailwind.config.cjs`; customize colors and typography as needed.

## Testing & Future Enhancements

- Add Jest + React Testing Library for component coverage.
- Introduce role-specific dashboards (faculty vs student).
- Implement reminders for expiring certificates and progress nudges.
- Build admin UIs to curate course catalog directly from the app.

Enjoy building with Blogspot! 🎓
