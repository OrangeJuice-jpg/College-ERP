# Architecture - User-Specific Data Flow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Login      │───▶│  Auth Guard  │───▶│   Dashboard  │  │
│  │   Page       │    │  (Route      │    │              │  │
│  │              │    │   Protect)   │    │              │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                                                      │
│         │ Stores in localStorage:                              │
│         │  - vaish_token (JWT)                                 │
│         │  - vaish_user (user info)                            │
│         │  - vaish_student (student record)                    │
│         ▼                                                      │
│  ┌──────────────────────────────────────────────────────┐    │
│  │           API Client (axios)                          │    │
│  │   Attaches token to every request automatically       │    │
│  └──────────────────────────────────────────────────────┘    │
│         │                                                      │
│         ├──────────┬──────────┬──────────┬──────────┐        │
│         ▼          ▼          ▼          ▼          ▼        │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌──────┐  ┌────────┐ │
│  │Students│  │Attend. │  │Finance │  │...   │  │  Auth  │ │
│  │  Page  │  │  Page  │  │  Page  │  │      │  │  API   │ │
│  └────────┘  └────────┘  └────────┘  └──────┘  └────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP + JWT Token
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Express)                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Authentication Middleware                     │   │
│  │  - Verifies JWT token                                 │   │
│  │  - Extracts user.id, user.role                        │   │
│  │  - Attaches to req.user                               │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                      │
│         ▼                                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Request Controllers                      │   │
│  │                                                       │   │
│  │  Auth Controller:                                     │   │
│  │  - Login: Returns user + student data                 │   │
│  │                                                       │   │
│  │  Attendance Controller:                               │   │
│  │  - getMyAttendance: Filters by req.user.id            │   │
│  │  - getMyAttendanceStats: Stats for logged-in student  │   │
│  │                                                       │   │
│  │  Student Controller:                                  │   │
│  │  - getAllStudents: Returns all (faculty/admin)        │   │
│  │  - For students: returns only their record            │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                      │
│         ▼                                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              In-Memory Database (seed.ts)             │   │
│  │                                                       │   │
│  │  users[]         - User accounts                      │   │
│  │  students[]      - Student records (with userId)      │   │
│  │  attendance[]    - Attendance records (studentId)     │   │
│  │  finance[]       - Finance records (studentId)        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Student Login

```
1. Student logs in
   Email: arjun.mehta@vaish.edu
   Password: student123

2. Backend (auth.controller.ts)
   ├─ Find user by email
   ├─ Verify password
   ├─ Generate JWT token with user.id
   ├─ Find student record where userId === user.id
   └─ Response:
      {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          id: 3,
          name: "Arjun Mehta",
          email: "arjun.mehta@vaish.edu",
          role: "student"
        },
        student: {
          id: 1,
          rollNumber: "VE2021001",
          department: "Computer Science",
          semester: 6,
          ... (full student record)
        }
      }

3. Frontend (LoginPage.tsx)
   └─ authHelpers.save(token, user, student)
      ├─ localStorage.setItem("vaish_token", token)
      ├─ localStorage.setItem("vaish_user", JSON.stringify(user))
      └─ localStorage.setItem("vaish_student", JSON.stringify(student))

4. Navigation to /students
   ├─ Students.tsx loads
   ├─ currentUser = authHelpers.getUser() → { id: 3, role: "student" }
   ├─ currentStudent = authHelpers.getStudent() → { id: 1, rollNumber: "VE2021001" }
   ├─ Fetch all students from API
   └─ Filter: displayStudents = students.filter(s => s.userId === currentUser.id)
      → Only shows Arjun Mehta's record

5. Navigation to /attendance
   ├─ Attendance.tsx loads
   ├─ API call: getMyAttendance()
   │   GET /api/attendance/my
   │   Header: Authorization: Bearer <token>
   │
   ├─ Backend (attendance.controller.ts)
   │   ├─ userId = req.user.id → 3
   │   ├─ Find student where userId === 3 → studentId = 1
   │   └─ Return attendanceRecords.filter(r => r.studentId === 1)
   │
   └─ Display filtered attendance records
```

---

## Data Flow: Faculty Login

```
1. Faculty logs in
   Email: faculty@vaish.edu
   Password: faculty123

2. Backend (auth.controller.ts)
   ├─ Find user by email
   ├─ Verify password
   ├─ Generate JWT token with user.id
   ├─ Check if user.role === "student" → FALSE
   └─ Response:
      {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          id: 2,
          name: "Dr. Priya Rao",
          email: "faculty@vaish.edu",
          role: "faculty"
        },
        student: null  ← No student record for faculty
      }

3. Navigation to /students
   ├─ Students.tsx loads
   ├─ currentUser = authHelpers.getUser() → { id: 2, role: "faculty" }
   ├─ currentUser.role === "student" → FALSE
   └─ displayStudents = students (ALL 6 students shown)

4. Navigation to /attendance
   ├─ Attendance.tsx loads
   ├─ API call: getMyAttendance()
   │   GET /api/attendance/my
   │   Header: Authorization: Bearer <token>
   │
   ├─ Backend (attendance.controller.ts)
   │   ├─ userId = req.user.id → 2
   │   ├─ Find student where userId === 2 → NOT FOUND
   │   └─ Returns 404: "No student record found for your account"
   │
   └─ Frontend shows error message
```

---

## Database Relationships

```
┌─────────────────────────────────────────────────────────┐
│                        users                            │
├────┬──────────┬───────────────────────┬─────────┬───────┤
│ id │   name   │        email          │  role   │ ...   │
├────┼──────────┼───────────────────────┼─────────┼───────┤
│ 1  │ Admin    │ admin@vaish.edu       │ admin   │       │
│ 2  │ Dr. Priya│ faculty@vaish.edu     │ faculty │       │
│ 3  │ Arjun    │ arjun.mehta@vaish.edu │ student │       │
│ 4  │ Priya    │ priya.sharma@...      │ student │       │
│ 5  │ Rahul    │ rahul.verma@...       │ student │       │
│ 6  │ Sneha    │ sneha.iyer@...        │ student │       │
│ 7  │ Karan    │ karan.patel@...       │ student │       │
│ 8  │ Ananya   │ ananya.reddy@...      │ student │       │
└────┴──────────┴───────────────────────┴─────────┴───────┘
                        │
                        │ (linked by userId field)
                        ▼
┌─────────────────────────────────────────────────────────┐
│                      students                           │
├────┬──────────┬──────────┬───────┬────────┬──────┬─────┤
│ id │   name   │ rollNo   │ dept  │ userId │ ...  │     │
├────┼──────────┼──────────┼───────┼────────┼──────┼─────┤
│ 1  │ Arjun    │VE2021001 │ CS    │   3    │      │     │
│ 2  │ Priya    │VE2021002 │ EC    │   4    │      │     │
│ 3  │ Rahul    │VE2022001 │ Mech  │   5    │      │     │
│ 4  │ Sneha    │VE2022002 │ CS    │   6    │      │     │
│ 5  │ Karan    │VE2021003 │ Civil │   7    │      │     │
│ 6  │ Ananya   │VE2023001 │ IT    │   8    │      │     │
└────┴──────────┴──────────┴───────┴────────┴──────┴─────┘
                        │
                        │ (linked by studentId field)
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   attendanceRecords                     │
├────┬───────────┬───────────┬───────┬──────────┬─────────┤
│ id │ studentId │   name    │rollNo │  date    │ status  │
├────┼───────────┼───────────┼───────┼──────────┼─────────┤
│ 1  │     1     │  Arjun    │...001 │2024-04-01│ present │
│ 2  │     2     │  Priya    │...002 │2024-04-01│ present │
│ 3  │     3     │  Rahul    │...001 │2024-04-01│ absent  │
│ 4  │     4     │  Sneha    │...002 │2024-04-01│ present │
│ 5  │     5     │  Karan    │...003 │2024-04-01│ late    │
│ 6  │     6     │  Ananya   │...001 │2024-04-01│ present │
└────┴───────────┴───────────┴───────┴──────────┴─────────┘
```

---

## Security Flow

```
┌──────────────────────────────────────────────────────┐
│         Every API Request Flow                        │
└──────────────────────────────────────────────────────┘

Browser                    Backend
   │                         │
   │  GET /api/attendance/my │
   │  Authorization:         │
   │  Bearer <JWT>           │
   │────────────────────────▶│
   │                         │  authenticate middleware:
   │                         │  1. Extract token from header
   │                         │  2. Verify JWT signature
   │                         │  3. Decode → { id: 3, role: "student" }
   │                         │  4. Set req.user = { id: 3, role: "student" }
   │                         │
   │                         │  attendanceController.getMyAttendance:
   │                         │  1. const userId = req.user.id → 3
   │                         │  2. Find student where userId === 3
   │                         │     → studentId = 1
   │                         │  3. Filter attendance where studentId === 1
   │                         │
   │  { attendance: [...] }  │
   │◀────────────────────────│
   │
   │ Only shows Arjun's data!
   ▼
```

---

## Role-Based Access Matrix

```
┌─────────────────────────────────────────────────────────────┐
│                    Permission Matrix                         │
├──────────────────┬─────────┬─────────┬──────────────────────┤
│     Feature      │ Student │ Faculty │        Admin         │
├──────────────────┼─────────┼─────────┼──────────────────────┤
│ View own profile │    ✓    │    ✓    │          ✓           │
│ View all students│    ✗    │    ✓    │          ✓           │
│ View own attend. │    ✓    │    ✗    │          ✗           │
│ View all attend. │    ✗    │    ✓    │          ✓           │
│ Mark attendance  │    ✗    │    ✓    │          ✓           │
│ Update attend.   │    ✗    │    ✓    │          ✓           │
│ Delete attend.   │    ✗    │    ✗    │          ✓           │
│ View finance     │    ✓*   │    ✓    │          ✓           │
├──────────────────┼─────────┼─────────┼──────────────────────┤
│ Note: *Students  │  Own   │   All   │         All          │
│                  │ only   │students │       students       │
└──────────────────┴─────────┴─────────┴──────────────────────┘
```

---

## Technology Stack

```
┌─────────────────────────────────────────────┐
│              Frontend Stack                 │
├─────────────────────────────────────────────┤
│  React 18                                   │
│  TypeScript                                 │
│  React Router v6                            │
│  Axios (API client)                         │
│  Vite (build tool)                          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│              Backend Stack                  │
├─────────────────────────────────────────────┤
│  Node.js                                    │
│  Express                                    │
│  TypeScript                                 │
│  JWT (authentication)                       │
│  bcrypt (password hashing)                  │
│  In-memory data (seed.ts)                   │
└─────────────────────────────────────────────┘
```

---

This architecture ensures:
✅ Data isolation per user
✅ Role-based access control
✅ Consistent user experience
✅ Secure authentication
✅ Scalable design (can replace in-memory DB with real database)
