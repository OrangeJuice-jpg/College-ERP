export type User = {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'faculty' | 'admin';
};

export type Student = {
    id: string;
    name: string;
    enrollmentNumber: string;
    course: string;
    year: number;
};

export type Faculty = {
    id: string;
    name: string;
    employeeId: string;
    department: string;
};

export type FinanceRecord = {
    id: string;
    studentId: string;
    amount: number;
    date: string;
    description: string;
};

export type InventoryItem = {
    id: string;
    name: string;
    quantity: number;
    category: string;
};