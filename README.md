# Student Manage System by Sourav

A full-featured student management dashboard built with vanilla HTML, CSS, and JavaScript. Deployed as a static site on GitHub Pages with localStorage persistence.

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

> **Demo only. Do not use real student or staff records here.** This is a static, browser-local prototype, not a secure multi-user system. Data and passwords are stored in your browser's `localStorage`, and the demo credentials and login checks are in client-side code. Anyone using that browser profile can inspect the data; signing in as a role does not provide server-side access control. Changes do not sync between devices or browsers, and clearing browser storage removes them. For real records, use a backend with authentication, authorization, and protected storage.

## Login Credentials

| Role   | Email               | Password   |
|--------|---------------------|------------|
| Admin  | admin@admin.com     | admin123   |
| Staff  | staff@staff.com     | staff123   |
| Student| student@student.com | student123 |

When admin adds a new student/staff, a login account is auto-created with the email provided and default password `student123` (staff) or `student123` (student).

## Tech Stack

- HTML5 + CSS3 (custom properties, Grid/Flexbox, responsive)
- Vanilla JavaScript (SPA routing, localStorage, Chart.js)
- Chart.js for dashboard charts
- Font Awesome for icons
- GitHub Pages for hosting

## Project Structure

```
├── index.html      # Main HTML (login + app shell + modal)
├── css/
│   └── style.css   # All styles (responsive, dark sidebar)
└── js/
    └── app.js      # Complete app: data, auth, views, routing, charts
```

## Run Locally

Just open `index.html` in a browser. No build step or server required.

## License

MIT
