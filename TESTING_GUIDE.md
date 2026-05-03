# Testing Guide - Vaish ERP User-Specific Data

## Quick Start

### 1. Start the Backend Server
```bash
cd apps/server
npm start
```
Server will run on: `http://localhost:5000`

### 2. Start the Frontend
```bash
cd apps/web
npm start
```
Frontend will open on: `http://localhost:3000` (or next available port)

---

## Testing User-Specific Features

### Test as Student 1: Arjun Mehta

1. **Login Credentials:**
   - Email: `arjun.mehta@vaish.edu`
   - Password: `student123`

2. **Expected Dashboard:**
   - Welcome message: "Welcome back, Arjun Mehta!"
   - Shows Roll Number: VE2021001
   - Attendance statistics card visible
   - Shows attendance percentage (should be 100% - 1 present out of 1)

3. **Navigate to Students Page:**
   - Shows ONLY Arjun Mehta's profile
   - Can see personal details, courses, guardian info
   - Fee status shows as "Paid" (₹85,000)

4. **Navigate to Attendance Page:**
   - Student info shows: Arjun Mehta, VE2021001
   - Statistics show:
     - Total: 1 class
     - Present: 1
     - Absent: 0
     - Attendance: 100%
   - History table shows 1 record for Data Structures (Present)

---

### Test as Student 2: Priya Sharma

1. **Logout** from Arjun's account (click logout button)

2. **Login Credentials:**
   - Email: `priya.sharma@vaish.edu`
   - Password: `student123`

3. **Expected Dashboard:**
   - Welcome message: "Welcome back, Priya Sharma!"
   - Shows Roll Number: VE2021002
   - Different attendance statistics

4. **Navigate to Students Page:**
   - Shows ONLY Priya Sharma's profile
   - Different department (Electronics vs Computer Science)
   - Fee status shows as "Paid" (₹82,000)

5. **Navigate to Attendance Page:**
   - Student info shows: Priya Sharma, VE2021002
   - Shows 1 record for Analog Circuits (Present)

---

### Test as Student 3: Rahul Verma

1. **Logout** and login as Rahul

2. **Login Credentials:**
   - Email: `rahul.verma@vaish.edu`
   - Password: `student123`

3. **Expected Dashboard:**
   - Shows Rahul's information
   - Roll Number: VE2022001
   - Different semester (Sem 4, Year 2)

4. **Navigate to Students Page:**
   - Shows ONLY Rahul's profile
   - Department: Mechanical
   - Fee status shows as "Pending" (₹78,000) - Different from others!

5. **Navigate to Attendance Page:**
   - Student info shows: Rahul Verma, VE2022001
   - Shows 1 record for Thermodynamics (**ABSENT**)
   - Attendance percentage should be 0% - demonstrates different statuses

---

### Test as Faculty

1. **Logout** and login as faculty

2. **Login Credentials:**
   - Email: `faculty@vaish.edu`
   - Password: `faculty123`

3. **Expected Dashboard:**
   - Welcome message: "Welcome back, Dr. Priya Rao!"
   - Role: FACULTY (not student)
   - No attendance statistics (faculty doesn't have attendance records as a student)

4. **Navigate to Students Page:**
   - Shows **ALL 6 STUDENTS** (not just one)
   - Can view every student's complete profile
   - This demonstrates role-based access

5. **Navigate to Attendance Page:**
   - Currently shows "No attendance records found"
   - Faculty would need attendance marking form to add records
   - (Backend endpoint exists, just needs UI form)

---

### Test as Admin

1. **Logout** and login as admin

2. **Login Credentials:**
   - Email: `admin@vaish.edu`
   - Password: `admin123`

3. **Expected Dashboard:**
   - Welcome message: "Welcome back, Admin User!"
   - Role: ADMIN
   - Full system access message

4. **Navigate to Students Page:**
   - Shows **ALL 6 STUDENTS**
   - Same as faculty view

---

## Key Features to Demonstrate

### 1. User-Specific Data Filtering
- Login as different students → each sees only their own data
- Same URL (`/students`) shows different content based on logged-in user
- Roll numbers are unique per student and displayed correctly

### 2. Role-Based Access Control
- **Students**: See only their own profile
- **Faculty/Admin**: See all students
- Different dashboard content based on role

### 3. Attendance Tracking
- Each student has their own attendance records
- Attendance percentage calculated per student
- Color-coded statuses:
  - 🟢 Green: Present
  - 🔴 Red: Absent
  - 🟡 Yellow: Late

### 4. Data Association
- Student name appears in:
  - Dashboard welcome message
  - Students page profile
  - Attendance page header
  - All tied to logged-in user account

- Roll number appears in:
  - Students page
  - Attendance page
  - Consistent across all pages

---

## API Testing (Optional - Using Postman/Thunder Client)

### Get Logged-in Student's Attendance
```
GET http://localhost:5000/api/attendance/my
Authorization: Bearer <token>
```

### Get Attendance Statistics
```
GET http://localhost:5000/api/attendance/my-stats
Authorization: Bearer <token>
```

### Get All Students (Faculty/Admin only)
```
GET http://localhost:5000/api/students
Authorization: Bearer <token>
```

---

## Common Issues & Solutions

### Issue: "No student record found"
- **Cause**: User account doesn't have linked student record
- **Solution**: Use the 6 pre-configured student accounts

### Issue: Attendance not showing
- **Cause**: No attendance records for that student
- **Solution**: Login as Rahul Verma (has 1 absent record) or check seed data

### Issue: Can't see all students as faculty
- **Cause**: Authentication token not attached to request
- **Solution**: Ensure backend is running and token is valid

### Issue: Login fails
- **Cause**: Wrong credentials or backend not running
- **Solution**: 
  - Check backend is on `http://localhost:5000`
  - Verify credentials from list above
  - Check browser console for errors

---

## Presentation Tips for Practicals

### 1. Start with Student View
- Login as Arjun Mehta
- Show dashboard with personalized info
- Navigate to Students page → shows only his profile
- Navigate to Attendance → shows his records
- Emphasize: "I can only see MY data"

### 2. Demonstrate Role Differences
- Logout, login as Faculty
- Show how Students page now shows ALL students
- Explain role-based access control

### 3. Show Another Student
- Logout, login as Rahul Verma
- Show different attendance status (absent)
- Show different fee status (pending)
- Demonstrates data varies per user

### 4. Highlight Key Features
- Point out roll numbers are consistent
- Names match across all pages
- Attendance percentage calculated correctly
- UI changes based on user role

### 5. Show Code Structure (if asked)
- Open `seed.ts` → show student-user linking
- Open `attendance.controller.ts` → show filtering logic
- Open `Students.tsx` → show role-based rendering

---

## Data Summary

| Student | Email | Roll | Department | Attendance | Fee Status |
|---------|-------|------|------------|------------|------------|
| Arjun Mehta | arjun.mehta@vaish.edu | VE2021001 | Computer Science | 1 Present (100%) | Paid |
| Priya Sharma | priya.sharma@vaish.edu | VE2021002 | Electronics | 1 Present (100%) | Paid |
| Rahul Verma | rahul.verma@vaish.edu | VE2022001 | Mechanical | 1 Absent (0%) | **Pending** |
| Sneha Iyer | sneha.iyer@vaish.edu | VE2022002 | Computer Science | 1 Present (100%) | Paid |
| Karan Patel | karan.patel@vaish.edu | VE2021003 | Civil | 1 Late | **Overdue** |
| Ananya Reddy | ananya.reddy@vaish.edu | VE2023001 | IT | 1 Present (100%) | Paid |

---

**Good luck with your college practicals! 🎓**
