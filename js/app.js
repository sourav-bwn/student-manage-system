/* ===================================================================
   Student Manage System by Sourav - Complete Application
   =================================================================== */

// ========================= DATA LAYER =========================
const DB_KEY = 'sms_data';
const SESSION_KEY = 'sms_session';

const defaultData = {
  users: [
    { id: 1, name: 'Admin HOD', email: 'admin@admin.com', password: 'admin123', role: 'admin' },
    { id: 2, name: 'John Teacher', email: 'staff@staff.com', password: 'staff123', role: 'staff' },
    { id: 3, name: 'Jane Student', email: 'student@student.com', password: 'student123', role: 'student' },
  ],
  staff: [
    { id: 1, name: 'John Teacher', email: 'staff@staff.com', phone: '9876543210', courseId: 1, address: 'New York, USA' },
    { id: 2, name: 'Sarah Wilson', email: 'sarah@staff.com', phone: '8765432109', courseId: 2, address: 'Los Angeles, USA' },
  ],
  students: [
    { id: 1, name: 'Jane Student', email: 'student@student.com', phone: '9876543210', courseId: 1, semester: 3, address: 'Boston, USA', dob: '2002-05-15' },
    { id: 2, name: 'Bob Smith', email: 'bob@test.com', phone: '5551234567', courseId: 2, semester: 2, address: 'Chicago, USA', dob: '2003-08-22' },
    { id: 3, name: 'Alice Johnson', email: 'alice@test.com', phone: '5559876543', courseId: 1, semester: 1, address: 'Seattle, USA', dob: '2004-01-10' },
    { id: 4, name: 'Charlie Brown', email: 'charlie@test.com', phone: '5554567890', courseId: 3, semester: 2, address: 'Denver, USA', dob: '2003-11-30' },
    { id: 5, name: 'Diana Prince', email: 'diana@test.com', phone: '5557890123', courseId: 1, semester: 3, address: 'Miami, USA', dob: '2002-07-08' },
    { id: 6, name: 'Eve Adams', email: 'eve@test.com', phone: '5553456789', courseId: 2, semester: 1, address: 'Portland, USA', dob: '2004-03-18' },
  ],
  courses: [
    { id: 1, name: 'BCA' },
    { id: 2, name: 'BBA' },
    { id: 3, name: 'B.Sc' },
  ],
  subjects: [
    { id: 1, name: 'Python Programming', code: 'CS101', courseId: 1, semester: 1 },
    { id: 2, name: 'Database Management', code: 'CS102', courseId: 1, semester: 1 },
    { id: 3, name: 'Operating Systems', code: 'CS103', courseId: 1, semester: 2 },
    { id: 4, name: 'Data Structures', code: 'CS104', courseId: 1, semester: 2 },
    { id: 5, name: 'Computer Networks', code: 'CS105', courseId: 1, semester: 3 },
    { id: 6, name: 'Business Management', code: 'BA201', courseId: 2, semester: 1 },
    { id: 7, name: 'Accounting', code: 'BA202', courseId: 2, semester: 2 },
    { id: 8, name: 'Marketing', code: 'BA203', courseId: 2, semester: 3 },
    { id: 9, name: 'Physics', code: 'SC301', courseId: 3, semester: 1 },
    { id: 10, name: 'Chemistry', code: 'SC302', courseId: 3, semester: 2 },
  ],
  attendance: [],
  results: [],
  leaves: [],
  feedbacks: [],
  nextId: { users: 4, staff: 3, students: 7, courses: 4, subjects: 11, attendance: 1, results: 1, leaves: 1, feedbacks: 1 },
};

function getData() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) { /* ignore */ }
  }
  localStorage.setItem(DB_KEY, JSON.stringify(defaultData));
  return JSON.parse(JSON.stringify(defaultData));
}

function saveData(data) {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
}

function getNextId(data, key) {
  return data.nextId[key]++;
}

function getSession() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) { /* ignore */ }
  }
  return null;
}

function setSession(user) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

// ========================= AUTH =========================
const NAV_ITEMS = {
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'staff', label: 'Manage Staff', icon: 'fa-chalkboard-teacher' },
    { id: 'students', label: 'Manage Students', icon: 'fa-user-graduate' },
    { id: 'courses', label: 'Manage Courses', icon: 'fa-book' },
    { id: 'subjects', label: 'Manage Subjects', icon: 'fa-flask' },
    { id: 'attendance', label: 'View Attendance', icon: 'fa-calendar-check' },
    { id: 'leaves', label: 'Leave Requests', icon: 'fa-file-alt' },
    { id: 'feedback', label: 'Feedback', icon: 'fa-comments' },
  ],
  staff: [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'take-attendance', label: 'Take Attendance', icon: 'fa-calendar-check' },
    { id: 'results', label: 'Manage Results', icon: 'fa-star' },
    { id: 'apply-leave', label: 'Apply Leave', icon: 'fa-file-alt' },
    { id: 'send-feedback', label: 'Send Feedback', icon: 'fa-comment' },
  ],
  student: [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'view-attendance', label: 'My Attendance', icon: 'fa-calendar-check' },
    { id: 'view-results', label: 'My Results', icon: 'fa-star' },
    { id: 'student-leave', label: 'Apply Leave', icon: 'fa-file-alt' },
    { id: 'student-feedback', label: 'Send Feedback', icon: 'fa-comment' },
  ],
};

function getCourseName(data, id) {
  const c = data.courses.find(x => x.id === id);
  return c ? c.name : 'N/A';
}

function getSubjectName(data, id) {
  const s = data.subjects.find(x => x.id === id);
  return s ? s.name : 'N/A';
}

function getStaffName(data, id) {
  const s = data.staff.find(x => x.id === id);
  return s ? s.name : 'N/A';
}

function getStudentName(data, id) {
  const s = data.students.find(x => x.id === id);
  return s ? s.name : 'N/A';
}

function formatDate(d) {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ========================= STATE =========================
let state = {
  user: null,
  data: null,
  currentPage: 'dashboard',
  chartInstances: {},
};

// ========================= RENDER FUNCTIONS =========================

function renderSidebar() {
  const nav = document.getElementById('sidebarNav');
  const items = NAV_ITEMS[state.user.role] || [];
  nav.innerHTML = items.map(item => `
    <a class="nav-item ${state.currentPage === item.id ? 'active' : ''}" data-page="${item.id}">
      <i class="fas ${item.icon}"></i> ${item.label}
    </a>
  `).join('');

  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', () => navigateTo(el.dataset.page));
  });

  document.getElementById('userName').textContent = state.user.name;
  document.getElementById('userAvatar').textContent = state.user.name.charAt(0).toUpperCase();
  const roleMap = { admin: 'Administrator', staff: 'Staff / Teacher', student: 'Student' };
  document.getElementById('userRole').textContent = roleMap[state.user.role] || state.user.role;
}

function navigateTo(page) {
  state.currentPage = page;
  renderSidebar();
  renderPage(page);
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

// ========================= PAGES =========================

function renderPage(page) {
  const main = document.getElementById('mainContent');
  const titleMap = {
    'dashboard': 'Dashboard',
    'staff': 'Manage Staff',
    'students': 'Manage Students',
    'courses': 'Manage Courses',
    'subjects': 'Manage Subjects',
    'attendance': 'View Attendance',
    'leaves': 'Leave Requests',
    'feedback': 'Feedback',
    'take-attendance': 'Take Attendance',
    'results': 'Manage Results',
    'apply-leave': 'Apply Leave',
    'send-feedback': 'Send Feedback',
    'view-attendance': 'My Attendance',
    'view-results': 'My Results',
    'student-leave': 'Apply Leave',
    'student-feedback': 'Send Feedback',
  };
  document.getElementById('pageTitle').textContent = titleMap[page] || 'Dashboard';

  const views = {
    dashboard: renderDashboard,
    staff: renderStaff,
    students: renderStudents,
    courses: renderCourses,
    subjects: renderSubjects,
    attendance: renderAttendance,
    leaves: renderLeaves,
    feedback: renderFeedback,
    'take-attendance': renderTakeAttendance,
    results: renderStaffResults,
    'apply-leave': renderApplyLeave,
    'send-feedback': renderSendFeedback,
    'view-attendance': renderStudentAttendance,
    'view-results': renderStudentResults,
    'student-leave': renderStudentLeave,
    'student-feedback': renderStudentFeedback,
  };

  const fn = views[page];
  if (fn) fn(main);
  else main.innerHTML = `<div class="empty-state"><i class="fas fa-file"></i><p>Page not found.</p></div>`;
}

// ========== DASHBOARD ==========
function renderDashboard(container) {
  const data = state.data;
  const user = state.user;

  if (user.role === 'admin') {
    renderAdminDashboard(container, data);
  } else if (user.role === 'staff') {
    renderStaffDashboard(container, data);
  } else {
    renderStudentDashboard(container, data);
  }
}

function renderAdminDashboard(container, data) {
  const totalStaff = data.staff.length;
  const totalStudents = data.students.length;
  const totalCourses = data.courses.length;
  const totalSubjects = data.subjects.length;
  const pendingLeaves = data.leaves.filter(l => l.status === 'pending').length;
  const unreadFeedback = data.feedbacks.filter(f => f.reply === null || f.reply === undefined).length;

  container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon blue"><i class="fas fa-chalkboard-teacher"></i></div><div class="stat-info"><h3>${totalStaff}</h3><p>Total Staff</p></div></div>
      <div class="stat-card"><div class="stat-icon green"><i class="fas fa-user-graduate"></i></div><div class="stat-info"><h3>${totalStudents}</h3><p>Total Students</p></div></div>
      <div class="stat-card"><div class="stat-icon purple"><i class="fas fa-book"></i></div><div class="stat-info"><h3>${totalCourses}</h3><p>Courses</p></div></div>
      <div class="stat-card"><div class="stat-icon cyan"><i class="fas fa-flask"></i></div><div class="stat-info"><h3>${totalSubjects}</h3><p>Subjects</p></div></div>
      <div class="stat-card"><div class="stat-icon yellow"><i class="fas fa-file-alt"></i></div><div class="stat-info"><h3>${pendingLeaves}</h3><p>Pending Leaves</p></div></div>
      <div class="stat-card"><div class="stat-icon red"><i class="fas fa-comments"></i></div><div class="stat-info"><h3>${unreadFeedback}</h3><p>Unread Feedback</p></div></div>
    </div>
    <div class="charts-grid">
      <div class="chart-card"><h3><i class="fas fa-users" style="color:var(--primary)"></i> Students per Course</h3><canvas id="chartCourse"></canvas></div>
      <div class="chart-card"><h3><i class="fas fa-check-circle" style="color:var(--success)"></i> Attendance Overview</h3><canvas id="chartAttendance"></canvas></div>
    </div>
  `;

  setTimeout(() => {
    const courseLabels = data.courses.map(c => c.name);
    const courseCounts = data.courses.map(c => data.students.filter(s => s.courseId === c.id).length);
    renderChart('chartCourse', 'bar', courseLabels, courseCounts, ['#4f46e5', '#8b5cf6', '#06b6d4', '#10b981']);

    const present = data.attendance.filter(a => a.status === 'present').length;
    const absent = data.attendance.filter(a => a.status === 'absent').length;
    renderChart('chartAttendance', 'doughnut', ['Present', 'Absent'], [present || 1, absent || 1], ['#10b981', '#ef4444']);
  }, 100);
}

function renderStaffDashboard(container, data) {
  const totalStudents = data.students.length;
  const totalSubjects = data.subjects.length;
  const totalAttendance = data.attendance.length;
  const myLeaves = data.leaves.filter(l => l.staffId === state.user.id).length;

  container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon green"><i class="fas fa-user-graduate"></i></div><div class="stat-info"><h3>${totalStudents}</h3><p>Total Students</p></div></div>
      <div class="stat-card"><div class="stat-icon blue"><i class="fas fa-flask"></i></div><div class="stat-info"><h3>${totalSubjects}</h3><p>Subjects</p></div></div>
      <div class="stat-card"><div class="stat-icon purple"><i class="fas fa-calendar-check"></i></div><div class="stat-info"><h3>${totalAttendance}</h3><p>Attendance Records</p></div></div>
      <div class="stat-card"><div class="stat-icon yellow"><i class="fas fa-file-alt"></i></div><div class="stat-info"><h3>${myLeaves}</h3><p>My Leave Applications</p></div></div>
    </div>
    <div class="charts-grid">
      <div class="chart-card"><h3><i class="fas fa-check-circle" style="color:var(--success)"></i> Attendance Overview</h3><canvas id="chartStaffAtt"></canvas></div>
      <div class="chart-card"><h3><i class="fas fa-star" style="color:var(--warning)"></i> Results Overview</h3><canvas id="chartStaffResults"></canvas></div>
    </div>
  `;

  setTimeout(() => {
    const present = data.attendance.filter(a => a.status === 'present').length;
    const absent = data.attendance.filter(a => a.status === 'absent').length;
    renderChart('chartStaffAtt', 'doughnut', ['Present', 'Absent'], [present || 1, absent || 1], ['#10b981', '#ef4444']);

    const pass = data.results.filter(r => r.score >= 40).length;
    const fail = data.results.filter(r => r.score < 40).length;
    renderChart('chartStaffResults', 'doughnut', ['Pass', 'Fail'], [pass || 1, fail || 1], ['#3b82f6', '#f59e0b']);
  }, 100);
}

function renderStudentDashboard(container, data) {
  const myAtt = data.attendance.filter(a => a.studentId === state.user.id);
  const myResults = data.results.filter(r => r.studentId === state.user.id);
  const present = myAtt.filter(a => a.status === 'present').length;
  const absent = myAtt.filter(a => a.status === 'absent').length;
  const avgScore = myResults.length ? Math.round(myResults.reduce((s, r) => s + r.score, 0) / myResults.length) : 0;

  container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon green"><i class="fas fa-calendar-check"></i></div><div class="stat-info"><h3>${present}</h3><p>Present Days</p></div></div>
      <div class="stat-card"><div class="stat-icon red"><i class="fas fa-calendar-times"></i></div><div class="stat-info"><h3>${absent}</h3><p>Absent Days</p></div></div>
      <div class="stat-card"><div class="stat-icon blue"><i class="fas fa-star"></i></div><div class="stat-info"><h3>${myResults.length}</h3><p>Results Published</p></div></div>
      <div class="stat-card"><div class="stat-icon purple"><i class="fas fa-percentage"></i></div><div class="stat-info"><h3>${avgScore}%</h3><p>Average Score</p></div></div>
    </div>
    <div class="charts-grid">
      <div class="chart-card"><h3><i class="fas fa-calendar-check" style="color:var(--success)"></i> My Attendance</h3><canvas id="chartStdAtt"></canvas></div>
      <div class="chart-card"><h3><i class="fas fa-star" style="color:var(--warning)"></i> Recent Scores</h3><canvas id="chartStdResults"></canvas></div>
    </div>
  `;

  setTimeout(() => {
    renderChart('chartStdAtt', 'doughnut', ['Present', 'Absent'], [present || 1, absent || 1], ['#10b981', '#ef4444']);

    if (myResults.length) {
      const labels = myResults.map(r => getSubjectName(data, r.subjectId));
      const scores = myResults.map(r => r.score);
      renderChart('chartStdResults', 'bar', labels, scores, ['#4f46e5', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']);
    } else {
      renderChart('chartStdResults', 'doughnut', ['No Data'], [1], ['#e2e8f0']);
    }
  }, 100);
}

// ========== ADMIN: MANAGE STAFF ==========
function renderStaff(container) {
  const data = state.data;
  container.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <h3><i class="fas fa-chalkboard-teacher" style="color:var(--primary)"></i> All Staff Members</h3>
        <div class="section-actions">
          <button class="btn btn-primary btn-sm" onclick="openStaffModal()"><i class="fas fa-plus"></i> Add Staff</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Course</th><th>Actions</th></tr></thead>
          <tbody>
            ${data.staff.length ? data.staff.map((s, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${s.name}</strong></td>
                <td>${s.email}</td>
                <td>${s.phone || '-'}</td>
                <td>${getCourseName(data, s.courseId)}</td>
                <td>
                  <div class="action-btns">
                    <button class="btn btn-info btn-sm" onclick="openStaffModal(${s.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm" onclick="deleteStaff(${s.id})"><i class="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            `).join('') : `<tr><td colspan="6"><div class="empty-state"><p>No staff members yet.</p></div></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openStaffModal(id) {
  const data = state.data;
  const staff = id ? data.staff.find(s => s.id === id) : null;
  showModal(
    staff ? 'Edit Staff' : 'Add Staff',
    `
      <div class="form-grid">
        <div class="form-group">
          <label><i class="fas fa-user"></i> Full Name</label>
          <input type="text" id="staffName" value="${staff ? staff.name : ''}" placeholder="Enter staff name" />
        </div>
        <div class="form-group">
          <label><i class="fas fa-envelope"></i> Email</label>
          <input type="email" id="staffEmail" value="${staff ? staff.email : ''}" placeholder="Enter email" />
        </div>
        <div class="form-group">
          <label><i class="fas fa-phone"></i> Phone</label>
          <input type="text" id="staffPhone" value="${staff ? staff.phone : ''}" placeholder="Enter phone number" />
        </div>
        <div class="form-group">
          <label><i class="fas fa-book"></i> Course</label>
          <select id="staffCourse">
            <option value="">Select Course</option>
            ${data.courses.map(c => `<option value="${c.id}" ${staff && staff.courseId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group full">
          <label><i class="fas fa-map-marker-alt"></i> Address</label>
          <textarea id="staffAddress" placeholder="Enter address">${staff ? staff.address || '' : ''}</textarea>
        </div>
      </div>
    `,
    () => {
      const name = document.getElementById('staffName').value.trim();
      const email = document.getElementById('staffEmail').value.trim();
      const phone = document.getElementById('staffPhone').value.trim();
      const courseId = parseInt(document.getElementById('staffCourse').value);
      const address = document.getElementById('staffAddress').value.trim();
      if (!name || !email) { alert('Name and Email are required.'); return; }
      if (id) {
        const s = data.staff.find(x => x.id === id);
        if (s) { s.name = name; s.email = email; s.phone = phone; s.courseId = courseId; s.address = address; }
      } else {
        data.staff.push({ id: getNextId(data, 'staff'), name, email, phone, courseId, address });
        data.users.push({ id: getNextId(data, 'users'), name, email, password: 'staff123', role: 'staff' });
      }
      saveData(data); closeModal(); navigateTo('staff');
    }
  );
}

function deleteStaff(id) {
  if (!confirm('Delete this staff member?')) return;
  state.data.staff = state.data.staff.filter(s => s.id !== id);
  saveData(state.data);
  navigateTo('staff');
}

// ========== ADMIN: MANAGE STUDENTS ==========
function renderStudents(container) {
  const data = state.data;
  container.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <h3><i class="fas fa-user-graduate" style="color:var(--primary)"></i> All Students</h3>
        <div class="section-actions">
          <button class="btn btn-primary btn-sm" onclick="openStudentModal()"><i class="fas fa-plus"></i> Add Student</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Course</th><th>Semester</th><th>Phone</th><th>Actions</th></tr></thead>
          <tbody>
            ${data.students.length ? data.students.map((s, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${s.name}</strong></td>
                <td>${s.email}</td>
                <td>${getCourseName(data, s.courseId)}</td>
                <td><span class="badge badge-info">Sem ${s.semester}</span></td>
                <td>${s.phone || '-'}</td>
                <td>
                  <div class="action-btns">
                    <button class="btn btn-info btn-sm" onclick="openStudentModal(${s.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm" onclick="deleteStudent(${s.id})"><i class="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            `).join('') : `<tr><td colspan="7"><div class="empty-state"><p>No students yet.</p></div></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openStudentModal(id) {
  const data = state.data;
  const student = id ? data.students.find(s => s.id === id) : null;
  showModal(
    student ? 'Edit Student' : 'Add Student',
    `
      <div class="form-grid">
        <div class="form-group">
          <label><i class="fas fa-user"></i> Full Name</label>
          <input type="text" id="studName" value="${student ? student.name : ''}" placeholder="Enter student name" />
        </div>
        <div class="form-group">
          <label><i class="fas fa-envelope"></i> Email</label>
          <input type="email" id="studEmail" value="${student ? student.email : ''}" placeholder="Enter email" />
        </div>
        <div class="form-group">
          <label><i class="fas fa-phone"></i> Phone</label>
          <input type="text" id="studPhone" value="${student ? student.phone : ''}" placeholder="Enter phone" />
        </div>
        <div class="form-group">
          <label><i class="fas fa-calendar"></i> Date of Birth</label>
          <input type="date" id="studDob" value="${student ? student.dob || '' : ''}" />
        </div>
        <div class="form-group">
          <label><i class="fas fa-book"></i> Course</label>
          <select id="studCourse">
            ${data.courses.map(c => `<option value="${c.id}" ${student && student.courseId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label><i class="fas fa-layer-group"></i> Semester</label>
          <select id="studSemester">
            ${[1,2,3,4,5,6].map(s => `<option value="${s}" ${student && student.semester === s ? 'selected' : ''}>Semester ${s}</option>`).join('')}
          </select>
        </div>
        <div class="form-group full">
          <label><i class="fas fa-map-marker-alt"></i> Address</label>
          <textarea id="studAddress" placeholder="Enter address">${student ? student.address || '' : ''}</textarea>
        </div>
      </div>
    `,
    () => {
      const name = document.getElementById('studName').value.trim();
      const email = document.getElementById('studEmail').value.trim();
      const phone = document.getElementById('studPhone').value.trim();
      const dob = document.getElementById('studDob').value;
      const courseId = parseInt(document.getElementById('studCourse').value);
      const semester = parseInt(document.getElementById('studSemester').value);
      const address = document.getElementById('studAddress').value.trim();
      if (!name || !email || !courseId) { alert('Name, Email, and Course are required.'); return; }
      if (id) {
        const s = data.students.find(x => x.id === id);
        if (s) { Object.assign(s, { name, email, phone, dob, courseId, semester, address }); }
      } else {
        data.students.push({ id: getNextId(data, 'students'), name, email, phone, dob, courseId, semester, address });
        data.users.push({ id: getNextId(data, 'users'), name, email, password: 'student123', role: 'student' });
      }
      saveData(data); closeModal(); navigateTo('students');
    }
  );
}

function deleteStudent(id) {
  if (!confirm('Delete this student?')) return;
  state.data.students = state.data.students.filter(s => s.id !== id);
  saveData(state.data);
  navigateTo('students');
}

// ========== ADMIN: MANAGE COURSES ==========
function renderCourses(container) {
  const data = state.data;
  container.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <h3><i class="fas fa-book" style="color:var(--primary)"></i> Courses</h3>
        <div class="section-actions">
          <button class="btn btn-primary btn-sm" onclick="openCourseModal()"><i class="fas fa-plus"></i> Add Course</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Course Name</th><th>Students Enrolled</th><th>Subjects</th><th>Actions</th></tr></thead>
          <tbody>
            ${data.courses.map((c, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${c.name}</strong></td>
                <td>${data.students.filter(s => s.courseId === c.id).length}</td>
                <td>${data.subjects.filter(s => s.courseId === c.id).length}</td>
                <td>
                  <div class="action-btns">
                    <button class="btn btn-info btn-sm" onclick="openCourseModal(${c.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCourse(${c.id})"><i class="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openCourseModal(id) {
  const data = state.data;
  const course = id ? data.courses.find(c => c.id === id) : null;
  showModal(
    course ? 'Edit Course' : 'Add Course',
    `<div class="form-group"><label><i class="fas fa-book"></i> Course Name</label><input type="text" id="courseName" value="${course ? course.name : ''}" placeholder="e.g. BCA" /></div>`,
    () => {
      const name = document.getElementById('courseName').value.trim();
      if (!name) { alert('Course name is required.'); return; }
      if (id) { const c = data.courses.find(x => x.id === id); if (c) c.name = name; }
      else { data.courses.push({ id: getNextId(data, 'courses'), name }); }
      saveData(data); closeModal(); navigateTo('courses');
    }
  );
}

function deleteCourse(id) {
  if (!confirm('Delete this course? Related subjects may be affected.')) return;
  state.data.courses = state.data.courses.filter(c => c.id !== id);
  saveData(state.data);
  navigateTo('courses');
}

// ========== ADMIN: MANAGE SUBJECTS ==========
function renderSubjects(container) {
  const data = state.data;
  container.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <h3><i class="fas fa-flask" style="color:var(--primary)"></i> Subjects</h3>
        <div class="section-actions">
          <button class="btn btn-primary btn-sm" onclick="openSubjectModal()"><i class="fas fa-plus"></i> Add Subject</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Subject Name</th><th>Code</th><th>Course</th><th>Semester</th><th>Actions</th></tr></thead>
          <tbody>
            ${data.subjects.map((s, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${s.name}</strong></td>
                <td><span class="badge badge-secondary">${s.code}</span></td>
                <td>${getCourseName(data, s.courseId)}</td>
                <td><span class="badge badge-info">Sem ${s.semester}</span></td>
                <td>
                  <div class="action-btns">
                    <button class="btn btn-info btn-sm" onclick="openSubjectModal(${s.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSubject(${s.id})"><i class="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openSubjectModal(id) {
  const data = state.data;
  const subj = id ? data.subjects.find(s => s.id === id) : null;
  showModal(
    subj ? 'Edit Subject' : 'Add Subject',
    `
      <div class="form-grid">
        <div class="form-group">
          <label><i class="fas fa-flask"></i> Subject Name</label>
          <input type="text" id="subjName" value="${subj ? subj.name : ''}" placeholder="e.g. Python" />
        </div>
        <div class="form-group">
          <label><i class="fas fa-code"></i> Subject Code</label>
          <input type="text" id="subjCode" value="${subj ? subj.code : ''}" placeholder="e.g. CS101" />
        </div>
        <div class="form-group">
          <label><i class="fas fa-book"></i> Course</label>
          <select id="subjCourse">
            ${data.courses.map(c => `<option value="${c.id}" ${subj && subj.courseId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label><i class="fas fa-layer-group"></i> Semester</label>
          <select id="subjSemester">
            ${[1,2,3,4,5,6].map(s => `<option value="${s}" ${subj && subj.semester === s ? 'selected' : ''}>Semester ${s}</option>`).join('')}
          </select>
        </div>
      </div>
    `,
    () => {
      const name = document.getElementById('subjName').value.trim();
      const code = document.getElementById('subjCode').value.trim();
      const courseId = parseInt(document.getElementById('subjCourse').value);
      const semester = parseInt(document.getElementById('subjSemester').value);
      if (!name || !code || !courseId) { alert('Name, Code, and Course are required.'); return; }
      if (id) { const s = data.subjects.find(x => x.id === id); if (s) Object.assign(s, { name, code, courseId, semester }); }
      else { data.subjects.push({ id: getNextId(data, 'subjects'), name, code, courseId, semester }); }
      saveData(data); closeModal(); navigateTo('subjects');
    }
  );
}

function deleteSubject(id) {
  if (!confirm('Delete this subject?')) return;
  state.data.subjects = state.data.subjects.filter(s => s.id !== id);
  saveData(state.data);
  navigateTo('subjects');
}

// ========== ADMIN: VIEW ATTENDANCE ==========
function renderAttendance(container) {
  const data = state.data;
  const grouped = {};
  data.attendance.forEach(a => {
    const key = `${a.date}_${a.courseId}_${a.subjectId}`;
    if (!grouped[key]) grouped[key] = { date: a.date, courseId: a.courseId, subjectId: a.subjectId, records: [] };
    grouped[key].records.push(a);
  });

  container.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <h3><i class="fas fa-calendar-check" style="color:var(--primary)"></i> Attendance Records</h3>
      </div>
      ${Object.keys(grouped).length ? `<div class="table-wrap"><table>
        <thead><tr><th>Date</th><th>Course</th><th>Subject</th><th>Present</th><th>Absent</th><th>Total</th></tr></thead>
        <tbody>
          ${Object.values(grouped).map(g => {
            const present = g.records.filter(r => r.status === 'present').length;
            const absent = g.records.filter(r => r.status === 'absent').length;
            return `<tr>
              <td>${formatDate(g.date)}</td>
              <td>${getCourseName(data, g.courseId)}</td>
              <td>${getSubjectName(data, g.subjectId)}</td>
              <td><span class="badge badge-success">${present}</span></td>
              <td><span class="badge badge-danger">${absent}</span></td>
              <td><strong>${g.records.length}</strong></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table></div>` : `<div class="empty-state"><i class="fas fa-calendar"></i><p>No attendance records yet.</p></div>`}
    </div>
  `;
}

// ========== ADMIN: LEAVE REQUESTS ==========
function renderLeaves(container) {
  const data = state.data;
  container.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <h3><i class="fas fa-file-alt" style="color:var(--primary)"></i> Leave Requests</h3>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Staff/Student</th><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${data.leaves.length ? data.leaves.map((l, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${getStaffName(data, l.staffId) || getStudentName(data, l.studentId) || 'Unknown'}</strong></td>
                <td><span class="badge badge-info">${l.role}</span></td>
                <td>${formatDate(l.fromDate)}</td>
                <td>${formatDate(l.toDate)}</td>
                <td>${l.reason}</td>
                <td><span class="badge ${l.status === 'approved' ? 'badge-success' : l.status === 'rejected' ? 'badge-danger' : 'badge-warning'}">${capitalize(l.status)}</span></td>
                <td>
                  ${l.status === 'pending' ? `<div class="action-btns">
                    <button class="btn btn-success btn-sm" onclick="approveLeave(${l.id})"><i class="fas fa-check"></i></button>
                    <button class="btn btn-danger btn-sm" onclick="rejectLeave(${l.id})"><i class="fas fa-times"></i></button>
                  </div>` : '-'}
                </td>
              </tr>
            `).join('') : `<tr><td colspan="8"><div class="empty-state"><p>No leave applications yet.</p></div></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function approveLeave(id) {
  const l = state.data.leaves.find(x => x.id === id);
  if (l) l.status = 'approved';
  saveData(state.data); navigateTo('leaves');
}

function rejectLeave(id) {
  const l = state.data.leaves.find(x => x.id === id);
  if (l) l.status = 'rejected';
  saveData(state.data); navigateTo('leaves');
}

// ========== ADMIN: FEEDBACK ==========
function renderFeedback(container) {
  const data = state.data;
  container.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <h3><i class="fas fa-comments" style="color:var(--primary)"></i> Feedback Messages</h3>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>From</th><th>Type</th><th>Message</th><th>Reply</th><th>Actions</th></tr></thead>
          <tbody>
            ${data.feedbacks.length ? data.feedbacks.map((f, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${getStaffName(data, f.staffId) || getStudentName(data, f.studentId) || 'Unknown'}</strong></td>
                <td><span class="badge badge-info">${f.role}</span></td>
                <td>${f.message}</td>
                <td>${f.reply ? f.reply : '<span class="badge badge-warning">Pending</span>'}</td>
                <td>
                  ${!f.reply ? `<button class="btn btn-primary btn-sm" onclick="replyFeedback(${f.id})"><i class="fas fa-reply"></i> Reply</button>` : '-'}
                </td>
              </tr>
            `).join('') : `<tr><td colspan="6"><div class="empty-state"><p>No feedback yet.</p></div></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function replyFeedback(id) {
  const data = state.data;
  const f = data.feedbacks.find(x => x.id === id);
  if (!f) return;
  showModal(
    'Reply to Feedback',
    `<div class="form-group"><label><i class="fas fa-reply"></i> Your Reply</label><textarea id="replyText" placeholder="Write your reply...">${f.reply || ''}</textarea></div>`,
    () => {
      const reply = document.getElementById('replyText').value.trim();
      if (!reply) { alert('Reply cannot be empty.'); return; }
      f.reply = reply;
      saveData(data); closeModal(); navigateTo('feedback');
    }
  );
}

// ========== STAFF: TAKE ATTENDANCE ==========
function renderTakeAttendance(container) {
  const data = state.data;
  container.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <h3><i class="fas fa-calendar-check" style="color:var(--primary)"></i> Take Attendance</h3>
        <div class="section-actions">
          <button class="btn btn-success btn-sm" onclick="submitAttendance()"><i class="fas fa-save"></i> Save Attendance</button>
        </div>
      </div>
      <div style="padding:16px 24px;border-bottom:1px solid var(--gray-200)">
        <div class="form-grid">
          <div class="form-group">
            <label>Course</label>
            <select id="attCourse" onchange="updateAttendanceStudents()">
              ${data.courses.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Subject</label>
            <select id="attSubject">
              ${data.subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Date</label>
            <input type="date" id="attDate" value="${new Date().toISOString().split('T')[0]}" />
          </div>
          <div class="form-group">
            <label>Semester</label>
            <select id="attSemester">
              ${[1,2,3,4,5,6].map(s => `<option value="${s}">Semester ${s}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Student Name</th><th>Present</th><th>Absent</th></tr></thead>
          <tbody id="attendanceTableBody">
          </tbody>
        </table>
      </div>
    </div>
  `;
  updateAttendanceStudents();
}

function updateAttendanceStudents() {
  const data = state.data;
  const courseId = parseInt(document.getElementById('attCourse').value);
  const semester = parseInt(document.getElementById('attSemester').value);
  const students = data.students.filter(s => s.courseId === courseId && s.semester === semester);
  const tbody = document.getElementById('attendanceTableBody');
  if (!tbody) return;
  if (!students.length) {
    tbody.innerHTML = `<tr><td colspan="3"><div class="empty-state"><p>No students found for this course and semester.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = students.map((s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${s.name}</strong></td>
      <td><input type="radio" name="att_${s.id}" value="present" checked /></td>
      <td><input type="radio" name="att_${s.id}" value="absent" /></td>
    </tr>
  `).join('');
}

function submitAttendance() {
  const data = state.data;
  const courseId = parseInt(document.getElementById('attCourse').value);
  const subjectId = parseInt(document.getElementById('attSubject').value);
  const date = document.getElementById('attDate').value;
  const semester = parseInt(document.getElementById('attSemester').value);
  const students = data.students.filter(s => s.courseId === courseId && s.semester === semester);

  if (!students.length) { alert('No students to mark attendance for.'); return; }

  let count = 0;
  students.forEach(s => {
    const status = document.querySelector(`input[name="att_${s.id}"]:checked`);
    if (status) {
      data.attendance.push({
        id: getNextId(data, 'attendance'),
        studentId: s.id,
        courseId,
        subjectId,
        semester,
        date,
        status: status.value,
        markedBy: state.user.id,
      });
      count++;
    }
  });

  if (count) {
    saveData(data);
    alert(`${count} attendance records saved successfully!`);
    navigateTo('take-attendance');
  } else {
    alert('No records to save.');
  }
}

// ========== STAFF: MANAGE RESULTS ==========
function renderStaffResults(container) {
  const data = state.data;
  container.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <h3><i class="fas fa-star" style="color:var(--primary)"></i> Manage Results</h3>
        <div class="section-actions">
          <button class="btn btn-primary btn-sm" onclick="openResultModal()"><i class="fas fa-plus"></i> Add Result</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Student</th><th>Subject</th><th>Score</th><th>Grade</th><th>Actions</th></tr></thead>
          <tbody>
            ${data.results.length ? data.results.map((r, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${getStudentName(data, r.studentId)}</strong></td>
                <td>${getSubjectName(data, r.subjectId)}</td>
                <td><strong>${r.score}%</strong></td>
                <td><span class="badge ${r.score >= 80 ? 'badge-success' : r.score >= 40 ? 'badge-warning' : 'badge-danger'}">${r.score >= 80 ? 'A' : r.score >= 60 ? 'B' : r.score >= 40 ? 'C' : 'F'}</span></td>
                <td>
                  <div class="action-btns">
                    <button class="btn btn-info btn-sm" onclick="openResultModal(${r.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm" onclick="deleteResult(${r.id})"><i class="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            `).join('') : `<tr><td colspan="6"><div class="empty-state"><p>No results yet.</p></div></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openResultModal(id) {
  const data = state.data;
  const result = id ? data.results.find(r => r.id === id) : null;
  showModal(
    result ? 'Edit Result' : 'Add Result',
    `
      <div class="form-grid">
        <div class="form-group">
          <label><i class="fas fa-user-graduate"></i> Student</label>
          <select id="resultStudent">
            <option value="">Select Student</option>
            ${data.students.map(s => `<option value="${s.id}" ${result && result.studentId === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label><i class="fas fa-flask"></i> Subject</label>
          <select id="resultSubject">
            <option value="">Select Subject</option>
            ${data.subjects.map(s => `<option value="${s.id}" ${result && result.subjectId === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label><i class="fas fa-percentage"></i> Score (%)</label>
          <input type="number" id="resultScore" min="0" max="100" value="${result ? result.score : ''}" placeholder="0-100" />
        </div>
        <div class="form-group full">
          <label><i class="fas fa-comment"></i> Remarks</label>
          <textarea id="resultRemarks" placeholder="Optional remarks">${result ? result.remarks || '' : ''}</textarea>
        </div>
      </div>
    `,
    () => {
      const studentId = parseInt(document.getElementById('resultStudent').value);
      const subjectId = parseInt(document.getElementById('resultSubject').value);
      const score = parseInt(document.getElementById('resultScore').value);
      const remarks = document.getElementById('resultRemarks').value.trim();
      if (!studentId || !subjectId || isNaN(score)) { alert('Student, Subject, and Score are required.'); return; }
      if (id) {
        const r = data.results.find(x => x.id === id);
        if (r) Object.assign(r, { studentId, subjectId, score, remarks });
      } else {
        data.results.push({ id: getNextId(data, 'results'), studentId, subjectId, score, remarks });
      }
      saveData(data); closeModal(); navigateTo('results');
    }
  );
}

function deleteResult(id) {
  if (!confirm('Delete this result?')) return;
  state.data.results = state.data.results.filter(r => r.id !== id);
  saveData(state.data);
  navigateTo('results');
}

// ========== STAFF: APPLY LEAVE ==========
function renderApplyLeave(container) {
  const data = state.data;
  const myLeaves = data.leaves.filter(l => l.staffId === state.user.id);
  container.innerHTML = `
    <div class="section-card" style="margin-bottom:20px">
      <div class="section-header">
        <h3><i class="fas fa-file-alt" style="color:var(--primary)"></i> Apply for Leave</h3>
      </div>
      <div style="padding:24px">
        <div class="form-grid">
          <div class="form-group">
            <label>From Date</label>
            <input type="date" id="leaveFrom" value="${new Date().toISOString().split('T')[0]}" />
          </div>
          <div class="form-group">
            <label>To Date</label>
            <input type="date" id="leaveTo" value="${new Date().toISOString().split('T')[0]}" />
          </div>
          <div class="form-group full">
            <label>Reason</label>
            <textarea id="leaveReason" placeholder="Explain your reason for leave..."></textarea>
          </div>
        </div>
        <button class="btn btn-primary" onclick="submitLeave()"><i class="fas fa-paper-plane"></i> Submit Leave Request</button>
      </div>
    </div>
    <div class="section-card">
      <div class="section-header">
        <h3><i class="fas fa-history" style="color:var(--primary)"></i> My Leave History</h3>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>From</th><th>To</th><th>Reason</th><th>Status</th></tr></thead>
          <tbody>
            ${myLeaves.length ? myLeaves.map((l, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${formatDate(l.fromDate)}</td>
                <td>${formatDate(l.toDate)}</td>
                <td>${l.reason}</td>
                <td><span class="badge ${l.status === 'approved' ? 'badge-success' : l.status === 'rejected' ? 'badge-danger' : 'badge-warning'}">${capitalize(l.status)}</span></td>
              </tr>
            `).join('') : `<tr><td colspan="5"><div class="empty-state"><p>No leave applications yet.</p></div></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function submitLeave() {
  const data = state.data;
  const fromDate = document.getElementById('leaveFrom').value;
  const toDate = document.getElementById('leaveTo').value;
  const reason = document.getElementById('leaveReason').value.trim();
  if (!fromDate || !toDate || !reason) { alert('All fields are required.'); return; }
  if (fromDate > toDate) { alert('From date cannot be after To date.'); return; }
  data.leaves.push({
    id: getNextId(data, 'leaves'),
    staffId: state.user.id,
    studentId: null,
    role: 'staff',
    fromDate,
    toDate,
    reason,
    status: 'pending',
  });
  saveData(data);
  alert('Leave request submitted!');
  navigateTo('apply-leave');
}

// ========== STAFF: SEND FEEDBACK ==========
function renderSendFeedback(container) {
  const data = state.data;
  const myFeedback = data.feedbacks.filter(f => f.staffId === state.user.id);
  container.innerHTML = `
    <div class="section-card" style="margin-bottom:20px">
      <div class="section-header">
        <h3><i class="fas fa-comment" style="color:var(--primary)"></i> Send Feedback</h3>
      </div>
      <div style="padding:24px">
        <div class="form-group">
          <label>Your Message</label>
          <textarea id="feedbackMsg" placeholder="Write your feedback or suggestion..."></textarea>
        </div>
        <button class="btn btn-primary" onclick="submitFeedback()"><i class="fas fa-paper-plane"></i> Send Feedback</button>
      </div>
    </div>
    <div class="section-card">
      <div class="section-header">
        <h3><i class="fas fa-history" style="color:var(--primary)"></i> My Feedback History</h3>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Message</th><th>Reply</th></tr></thead>
          <tbody>
            ${myFeedback.length ? myFeedback.map((f, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${f.message}</td>
                <td>${f.reply ? f.reply : '<span class="badge badge-warning">Awaiting Reply</span>'}</td>
              </tr>
            `).join('') : `<tr><td colspan="3"><div class="empty-state"><p>No feedback sent yet.</p></div></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function submitFeedback() {
  const data = state.data;
  const message = document.getElementById('feedbackMsg').value.trim();
  if (!message) { alert('Please write a message.'); return; }
  data.feedbacks.push({
    id: getNextId(data, 'feedbacks'),
    staffId: state.user.id,
    studentId: null,
    role: 'staff',
    message,
    reply: null,
  });
  saveData(data);
  alert('Feedback sent!');
  navigateTo('send-feedback');
}

// ========== STUDENT: VIEW ATTENDANCE ==========
function renderStudentAttendance(container) {
  const data = state.data;
  const myAtt = data.attendance.filter(a => a.studentId === state.user.id);
  container.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <h3><i class="fas fa-calendar-check" style="color:var(--primary)"></i> My Attendance</h3>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Date</th><th>Subject</th><th>Status</th></tr></thead>
          <tbody>
            ${myAtt.length ? myAtt.map((a, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${formatDate(a.date)}</td>
                <td>${getSubjectName(data, a.subjectId)}</td>
                <td><span class="badge ${a.status === 'present' ? 'badge-success' : 'badge-danger'}">${capitalize(a.status)}</span></td>
              </tr>
            `).join('') : `<tr><td colspan="4"><div class="empty-state"><p>No attendance records yet.</p></div></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ========== STUDENT: VIEW RESULTS ==========
function renderStudentResults(container) {
  const data = state.data;
  const myResults = data.results.filter(r => r.studentId === state.user.id);
  container.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <h3><i class="fas fa-star" style="color:var(--primary)"></i> My Results</h3>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Subject</th><th>Score</th><th>Grade</th><th>Remarks</th></tr></thead>
          <tbody>
            ${myResults.length ? myResults.map((r, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${getSubjectName(data, r.subjectId)}</td>
                <td><strong>${r.score}%</strong></td>
                <td><span class="badge ${r.score >= 80 ? 'badge-success' : r.score >= 60 ? 'badge-info' : r.score >= 40 ? 'badge-warning' : 'badge-danger'}">${r.score >= 80 ? 'A' : r.score >= 60 ? 'B' : r.score >= 40 ? 'C' : 'F'}</span></td>
                <td>${r.remarks || '-'}</td>
              </tr>
            `).join('') : `<tr><td colspan="5"><div class="empty-state"><p>No results published yet.</p></div></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ========== STUDENT: APPLY LEAVE ==========
function renderStudentLeave(container) {
  const data = state.data;
  const myLeaves = data.leaves.filter(l => l.studentId === state.user.id);
  container.innerHTML = `
    <div class="section-card" style="margin-bottom:20px">
      <div class="section-header">
        <h3><i class="fas fa-file-alt" style="color:var(--primary)"></i> Apply for Leave</h3>
      </div>
      <div style="padding:24px">
        <div class="form-grid">
          <div class="form-group">
            <label>From Date</label>
            <input type="date" id="sleaveFrom" value="${new Date().toISOString().split('T')[0]}" />
          </div>
          <div class="form-group">
            <label>To Date</label>
            <input type="date" id="sleaveTo" value="${new Date().toISOString().split('T')[0]}" />
          </div>
          <div class="form-group full">
            <label>Reason</label>
            <textarea id="sleaveReason" placeholder="Explain your reason for leave..."></textarea>
          </div>
        </div>
        <button class="btn btn-primary" onclick="submitStudentLeave()"><i class="fas fa-paper-plane"></i> Submit Leave Request</button>
      </div>
    </div>
    <div class="section-card">
      <div class="section-header">
        <h3><i class="fas fa-history" style="color:var(--primary)"></i> My Leave History</h3>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>From</th><th>To</th><th>Reason</th><th>Status</th></tr></thead>
          <tbody>
            ${myLeaves.length ? myLeaves.map((l, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${formatDate(l.fromDate)}</td>
                <td>${formatDate(l.toDate)}</td>
                <td>${l.reason}</td>
                <td><span class="badge ${l.status === 'approved' ? 'badge-success' : l.status === 'rejected' ? 'badge-danger' : 'badge-warning'}">${capitalize(l.status)}</span></td>
              </tr>
            `).join('') : `<tr><td colspan="5"><div class="empty-state"><p>No leave applications yet.</p></div></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function submitStudentLeave() {
  const data = state.data;
  const fromDate = document.getElementById('sleaveFrom').value;
  const toDate = document.getElementById('sleaveTo').value;
  const reason = document.getElementById('sleaveReason').value.trim();
  if (!fromDate || !toDate || !reason) { alert('All fields are required.'); return; }
  if (fromDate > toDate) { alert('From date cannot be after To date.'); return; }
  const student = data.students.find(s => s.id === state.user.id);
  data.leaves.push({
    id: getNextId(data, 'leaves'),
    staffId: null,
    studentId: state.user.id,
    role: 'student',
    fromDate,
    toDate,
    reason,
    status: 'pending',
  });
  saveData(data);
  alert('Leave request submitted!');
  navigateTo('student-leave');
}

// ========== STUDENT: SEND FEEDBACK ==========
function renderStudentFeedback(container) {
  const data = state.data;
  const myFeedback = data.feedbacks.filter(f => f.studentId === state.user.id);
  container.innerHTML = `
    <div class="section-card" style="margin-bottom:20px">
      <div class="section-header">
        <h3><i class="fas fa-comment" style="color:var(--primary)"></i> Send Feedback</h3>
      </div>
      <div style="padding:24px">
        <div class="form-group">
          <label>Your Message</label>
          <textarea id="sfeedbackMsg" placeholder="Write your feedback or suggestion..."></textarea>
        </div>
        <button class="btn btn-primary" onclick="submitStudentFeedback()"><i class="fas fa-paper-plane"></i> Send Feedback</button>
      </div>
    </div>
    <div class="section-card">
      <div class="section-header">
        <h3><i class="fas fa-history" style="color:var(--primary)"></i> My Feedback History</h3>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Message</th><th>Reply</th></tr></thead>
          <tbody>
            ${myFeedback.length ? myFeedback.map((f, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${f.message}</td>
                <td>${f.reply ? f.reply : '<span class="badge badge-warning">Awaiting Reply</span>'}</td>
              </tr>
            `).join('') : `<tr><td colspan="3"><div class="empty-state"><p>No feedback sent yet.</p></div></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function submitStudentFeedback() {
  const data = state.data;
  const message = document.getElementById('sfeedbackMsg').value.trim();
  if (!message) { alert('Please write a message.'); return; }
  data.feedbacks.push({
    id: getNextId(data, 'feedbacks'),
    staffId: null,
    studentId: state.user.id,
    role: 'student',
    message,
    reply: null,
  });
  saveData(data);
  alert('Feedback sent!');
  navigateTo('student-feedback');
}

// ========================= CHART HELPER =========================
function renderChart(canvasId, type, labels, data, colors) {
  const existing = state.chartInstances[canvasId];
  if (existing) existing.destroy();
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  state.chartInstances[canvasId] = new Chart(ctx, {
    type,
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors || ['#4f46e5', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
        borderColor: '#fff',
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: type === 'doughnut', position: 'bottom' } },
      scales: type !== 'doughnut' ? { y: { beginAtZero: true, grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } } : undefined,
    },
  });
}

// ========================= MODAL =========================
function showModal(title, body, onSave) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = body;
  document.getElementById('modalOverlay').style.display = 'flex';
  const saveBtn = document.getElementById('modalSave');
  const newSave = saveBtn.cloneNode(true);
  saveBtn.parentNode.replaceChild(newSave, saveBtn);
  newSave.addEventListener('click', onSave);
  newSave.style.display = 'inline-flex';
  document.getElementById('modalCancel').onclick = closeModal;
  document.getElementById('modalClose').onclick = closeModal;
  document.getElementById('modalOverlay').onclick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };
}

function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
}

// ========================= CLOCK =========================
function updateClock() {
  const now = new Date();
  document.getElementById('currentDateTime').textContent = now.toLocaleString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

// ========================= LOGIN =========================
function initLogin() {
  const session = getSession();
  if (session) {
    state.user = session;
    state.data = getData();
    startApp();
    return;
  }
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const role = document.getElementById('loginRole').value;
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const data = getData();
    const user = data.users.find(u => u.email === email && u.password === password && u.role === role);
    if (user) {
      state.user = { id: user.id, name: user.name, email: user.email, role: user.role };
      state.data = data;
      setSession(state.user);
      document.getElementById('loginError').textContent = '';
      startApp();
    } else {
      document.getElementById('loginError').textContent = 'Invalid credentials. Check your role, email, and password.';
    }
  });
}

function startApp() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('appContainer').style.display = 'flex';
  renderSidebar();
  navigateTo('dashboard');
  updateClock();
  setInterval(updateClock, 60000);

  document.getElementById('logoutBtn').addEventListener('click', () => {
    clearSession();
    location.reload();
  });

  document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
}

// ========================= INIT =========================
document.addEventListener('DOMContentLoaded', initLogin);
