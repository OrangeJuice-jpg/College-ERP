import { User } from '../db/seed';
import { users, nextUserId } from '../db/seed';

export class UserRepository {
    async create(userData: Partial<User>): Promise<User> {
        const newUser: User = {
            id: nextUserId,
            name: userData.name || '',
            email: userData.email || '',
            password: userData.password || '',
            role: userData.role || 'student',
        };
        users.push(newUser);
        return newUser;
    }

    async findById(id: string): Promise<User | null> {
        return users.find(u => u.id === parseInt(id)) || null;
    }

    async update(id: string, userData: Partial<User>): Promise<User | null> {
        const index = users.findIndex(u => u.id === parseInt(id));
        if (index === -1) return null;
        users[index] = { ...users[index], ...userData };
        return users[index];
    }

    async delete(id: string): Promise<boolean> {
        const index = users.findIndex(u => u.id === parseInt(id));
        if (index === -1) return false;
        users.splice(index, 1);
        return true;
    }

    async findAll(): Promise<User[]> {
        return users;
    }
}
