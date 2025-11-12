
# Notes App

## Overview

Notes App is a full-stack web application for creating, editing, organizing, and sharing notes. It features user authentication, note templates, revision history, profile management, and a modern, responsive UI built with React, Vite, and Tailwind CSS. The backend is powered by Python (Flask), with a SQLite database and Alembic migrations.

---

## Features

### 1. User Authentication & Profiles
- **Sign Up / Login / Logout**: Secure authentication for users.
- **Profile Management**: Users can update their profile info and profile picture.
- **Profile Picture Upload**: Images are stored and displayed in the app.
- **Authorization**: Private routes and access control for notes and templates.

### 2. Notes Management
- **Create, Edit, Delete Notes**: Full CRUD operations for notes.
- **Rich Text Editor**: Edit notes with formatting options.
- **Note Categories**: Organize notes by category for easy filtering.
- **Revision History**: Track and view previous versions of notes.
- **Note Sharing**: Share notes with other users or make notes public.

### 3. Note Templates
- **Create Templates**: Build reusable note templates for common formats.
- **Apply Templates**: Quickly start new notes from a template.
- **Template Management**: Edit, delete, and organize templates.

### 4. User Experience & UI
- **Responsive Design**: Works on desktop and mobile devices.
- **Sidebar Navigation**: Quick access to notes, templates, profile, and shared notes.
- **Loading Spinners & Error Boundaries**: Smooth feedback and error handling.
- **Modern Styling**: Tailwind CSS for fast, beautiful UI development.

### 5. Backend & Database
- **Flask REST API**: Handles all app logic and data operations.
- **SQLite Database**: Stores users, notes, templates, and revisions.
- **Alembic Migrations**: Database schema management and versioning.

### 6. Security & Deployment
- **Password Hashing**: Secure storage of user credentials.
- **Session Management**: Protects user data and sessions.
- **Production Ready**: Includes Procfile, runtime.txt, and wsgi.py for deployment (e.g., Heroku, Vercel).

---

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Python, Flask
- **Database**: SQLite
- **ORM & Migrations**: SQLAlchemy, Alembic
- **Authentication**: JWT, Flask-Login
- **Deployment**: Heroku, Vercel

---

## Getting Started

### Frontend
1. Install dependencies:
	```bash
	npm install
	```
2. Start development server:
	```bash
	npm run dev
	```

### Backend
1. Create and activate Python virtual environment.
2. Install dependencies:
	```bash
	pip install -r requirements.txt
	```
3. Run migrations:
	```bash
	alembic upgrade head
	```
4. Start Flask server:
	```bash
	python run.py
	```

---

## Folder Structure

- `frontend/` - React app source code
- `app/` - Flask backend code
- `migrations/` - Alembic migration scripts
- `instance/` - SQLite database files
- `static/` - Static files and uploads

---

## Contributing

Pull requests and issues are welcome! Please follow best practices and provide clear commit messages.

---

## License

MIT License
