import React, { useEffect, useState } from 'react';
import { authHelpers } from '../../../client/src/LoginPage';
import { getMyAttendanceStats } from '../services/api';

interface AttendanceStats {
  studentId: number;
  studentName: string;
  rollNumber: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  attendancePercentage: number;
}

const Dashboard: React.FC = () => {
  const user = authHelpers.getUser();
  const student = authHelpers.getStudent();
  const [stats, setStats] = useState<AttendanceStats | null>(null);

  useEffect(() => {
    if (user?.role === 'student') {
      loadAttendanceStats();
    }
  }, [user]);

  const loadAttendanceStats = async () => {
    try {
      const data = await getMyAttendanceStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  return (
    <div className="dashboard" style={{ padding: '24px' }}>
      {/* Welcome Section */}
      <div style={{
        background: 'linear-gradient(135deg, #f5c84214, #f5c84208)',
        border: '1px solid #f5c84240',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
      }}>
        <h1 style={{ 
          color: '#f0f0f8', 
          margin: '0 0 8px', 
          fontSize: '32px', 
          fontWeight: 700 
        }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={{ color: '#8888a0', fontSize: '16px', margin: 0 }}>
          {user?.role === 'student' 
            ? `Roll Number: ${student?.rollNumber || 'N/A'}` 
            : `Role: ${user?.role?.toUpperCase()}`}
        </p>
      </div>

      {/* Quick Stats */}
      {user?.role === 'student' && stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {/* Attendance Card */}
          <div style={{
            background: '#18181f',
            border: '1px solid #2a2a35',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{ color: '#8888a0', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Attendance Rate
            </div>
            <div style={{ 
              color: stats.attendancePercentage >= 75 ? '#34d98b' : '#fb6f84', 
              fontSize: '36px', 
              fontWeight: 700,
              marginBottom: '4px',
            }}>
              {stats.attendancePercentage}%
            </div>
            <div style={{ color: '#8888a0', fontSize: '14px' }}>
              {stats.present}/{stats.total} classes
            </div>
          </div>

          {/* Student Info Card */}
          <div style={{
            background: '#18181f',
            border: '1px solid #2a2a35',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{ color: '#8888a0', fontSize: '12px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Student Details
            </div>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ color: '#8888a0', fontSize: '12px' }}>Name</div>
              <div style={{ color: '#f0f0f8', fontSize: '16px', fontWeight: 600 }}>{stats.studentName}</div>
            </div>
            <div>
              <div style={{ color: '#8888a0', fontSize: '12px' }}>Roll Number</div>
              <div style={{ color: '#f0f0f8', fontSize: '16px', fontWeight: 600 }}>{stats.rollNumber}</div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div style={{
            background: '#18181f',
            border: '1px solid #2a2a35',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{ color: '#8888a0', fontSize: '12px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Attendance Breakdown
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: '#34d98b', fontSize: '24px', fontWeight: 700 }}>{stats.present}</div>
                <div style={{ color: '#8888a0', fontSize: '12px' }}>Present</div>
              </div>
              <div>
                <div style={{ color: '#fb6f84', fontSize: '24px', fontWeight: 700 }}>{stats.absent}</div>
                <div style={{ color: '#8888a0', fontSize: '12px' }}>Absent</div>
              </div>
              <div>
                <div style={{ color: '#f5c842', fontSize: '24px', fontWeight: 700 }}>{stats.late}</div>
                <div style={{ color: '#8888a0', fontSize: '12px' }}>Late</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{
        background: '#18181f',
        border: '1px solid #2a2a35',
        borderRadius: '16px',
        padding: '32px',
      }}>
        <h2 style={{ color: '#f0f0f8', margin: '0 0 16px', fontSize: '24px', fontWeight: 600 }}>
          Vaish College of Engineering ERP
        </h2>
        <p style={{ color: '#8888a0', fontSize: '16px', lineHeight: 1.6, margin: 0 }}>
          {user?.role === 'student'
            ? 'Access your academic records, attendance, fee details, and course information. Use the sidebar to navigate through different sections.'
            : user?.role === 'faculty'
            ? 'Manage student records, mark attendance, and view academic reports. Use the sidebar to access different modules.'
            : 'Administer the college ERP system, manage users, and oversee all operations.'}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;