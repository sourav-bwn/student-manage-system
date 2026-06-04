# Student Manage System by Sourav

A full-featured student management dashboard built with vanilla HTML, CSS, JavaScript, and Firebase. Real-time data sync across all users via Firestore.

## Features

### Admin (HOD)
- Dashboard with summary charts (students per course, attendance overview)
- Manage Staff — Add, Edit, Delete
- Manage Students — Add, Edit, Delete
- Manage Courses — Add, Edit, Delete
- Manage Subjects — Add, Edit, Delete
- View Attendance Records
- Approve / Reject Leave Requests
- Reply to Feedback

### Staff / Teacher
- Dashboard with stats and charts
- Take Attendance (by course, subject, semester)
- Add / Edit Student Results
- Apply for Leave
- Send Feedback to Admin

### Student
- Dashboard with personal stats and charts
- View Attendance
- View Results
- Apply for Leave
- Send Feedback to Admin

## Live Demo

https://sourav-bwn.github.io/student-manage-system/

## Firebase Setup (Required)

This app uses Firebase for authentication and database. You must set up your own Firebase project:

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a project
2. Enable **Authentication** → **Sign-in method** → **Email/Password**
3. Enable **Cloud Firestore** → Create database (start in test mode)
4. Go to **Project Settings** → **General** → **Your apps** → Create a **Web** app
5. Copy the Firebase config object
6. Open `js/firebase-config.js` and replace the placeholder values with your config
7. Create an admin user manually in Firebase Auth (or your first user via code)

### Creating the First Admin User

1. Go to Firebase Console → Authentication → Users
2. Click **Add User**
3. Email: `admin@admin.com`, Password: `admin123`
4. Go to Firestore → Create a document in the `users` collection with document ID = the user's UID:
   ```json
   {
     "name": "Admin HOD",
     "email": "admin@admin.com",
     "role": "admin"
   }
   ```
5. Then log in with those credentials on the app

## Tech Stack

- HTML5 + CSS3 (custom properties, Grid/Flexbox, responsive)
- Vanilla JavaScript (SPA routing, localStorage, Chart.js)
- Firebase Auth (authentication)
- Firebase Firestore (real-time database)
- Chart.js for dashboard charts
- Font Awesome for icons
- GitHub Pages for hosting

## Project Structure

```
├── index.html                 # Main HTML (login + app shell + modal)
├── css/
│   └── style.css              # All styles (responsive, dark sidebar)
├── js/
│   ├── firebase-config.js     # Firebase configuration (edit this)
│   └── app.js                 # Complete app: data, auth, views, routing
└── README.md
```

## Run Locally

Just open `index.html` in a browser. No build step or server required.

## License

MIT
