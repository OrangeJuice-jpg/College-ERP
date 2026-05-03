import { authHelpers } from './LoginPage';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: authHelpers.authHeader(),
    });
    if (!response.ok) throw new Error('Failed to fetch data');
    return response.json();
  },
  post: async (endpoint: string, data: object) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHelpers.authHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create data');
    return response.json();
  },
};

export const getMyTimetable = async () => {
  return apiClient.get('/timetable/my');
};

export const getNotices = async () => {
  return apiClient.get('/notices');
};

export const createNotice = async (data: object) => {
  return apiClient.post('/notices', data);
};

export const getMyAttendance = async () => {
  return apiClient.get('/attendance/my');
};

export const getMyAttendanceStats = async () => {
  return apiClient.get('/attendance/my-stats');
};
