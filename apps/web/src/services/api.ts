import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export const login = async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
};

export const register = async (name: string, email: string, password: string, role?: string) => {
    const response = await apiClient.post('/auth/register', { name, email, password, role });
    return response.data;
};

export const getStudents = async () => {
    const response = await apiClient.get('/students');
    return response.data;
};

export const addStudent = async (studentData: object) => {
    const response = await apiClient.post('/students', studentData);
    return response.data;
};

export const updateStudent = async (studentId: number, studentData: object) => {
    const response = await apiClient.put(`/students/${studentId}`, studentData);
    return response.data;
};

export const deleteStudent = async (studentId: number) => {
    const response = await apiClient.delete(`/students/${studentId}`);
    return response.data;
};

export const getFinanceRecords = async () => {
    const response = await apiClient.get('/finance');
    return response.data;
};

export const addFinanceRecord = async (data: object) => {
    const response = await apiClient.post('/finance', data);
    return response.data;
};

// ─── Attendance Endpoints ───
export const getMyAttendance = async () => {
    const response = await apiClient.get('/attendance/my');
    return response.data;
};

export const getMyAttendanceStats = async () => {
    const response = await apiClient.get('/attendance/my-stats');
    return response.data;
};

export const getAllAttendance = async () => {
    const response = await apiClient.get('/attendance');
    return response.data;
};

export const markAttendance = async (data: { studentId: number; date: string; status: string; subject: string }) => {
    const response = await apiClient.post('/attendance', data);
    return response.data;
};

export const updateAttendance = async (attendanceId: number, data: object) => {
    const response = await apiClient.put(`/attendance/${attendanceId}`, data);
    return response.data;
};

export const deleteAttendance = async (attendanceId: number) => {
    const response = await apiClient.delete(`/attendance/${attendanceId}`);
    return response.data;
};

export const getClassAttendance = async (date: string, subject: string) => {
    const response = await apiClient.get('/attendance/class', { params: { date, subject } });
    return response.data;
};

// ─── Timetable Endpoints ───
export const getMyTimetable = async () => {
    const response = await apiClient.get('/timetable/my');
    return response.data;
};

export const getAllTimetable = async () => {
    const response = await apiClient.get('/timetable');
    return response.data;
};

// ─── Notices Endpoints ───
export const getNotices = async () => {
    const response = await apiClient.get('/notices');
    return response.data;
};

export const createNotice = async (data: object) => {
    const response = await apiClient.post('/notices', data);
    return response.data;
};
