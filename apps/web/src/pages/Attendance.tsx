import React, { useState, useEffect } from 'react';
import { getMyAttendance, getMyAttendanceStats } from '../services/api';

interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  rollNumber: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  subject: string;
  markedBy: number;
  markedAt: string;
}

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

const Attendance: React.FC = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [attendanceData, statsData] = await Promise.all([
        getMyAttendance(),
        getMyAttendanceStats(),
      ]);
      setAttendance(attendanceData);
      setStats(statsData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return '#34d98b';
      case 'absent': return '#fb6f84';
      case 'late': return '#f5c842';
      case 'excused': return '#60cdff';
      default: return '#8888a0';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#8888a0' }}>Loading attendance...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{
          padding: '16px',
          background: '#fb6f8414',
          border: '1px solid #fb6f8440',
          borderRadius: '10px',
          color: '#fb6f84',
        }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ color: '#f0f0f8', marginBottom: '24px', fontSize: '28px', fontWeight: 700 }}>
        My Attendance
      </h1>

      {stats && (
        <div style={{ marginBottom: '32px' }}>
          {/* Student Info Card */}
          <div style={{
            background: '#18181f',
            border: '1px solid #2a2a35',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px',
          }}>
            <h2 style={{ color: '#f0f0f8', margin: '0 0 16px', fontSize: '20px', fontWeight: 600 }}>
              Student Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ color: '#8888a0', fontSize: '12px', marginBottom: '4px' }}>Name</div>
                <div style={{ color: '#f0f0f8', fontSize: '16px', fontWeight: 600 }}>{stats.studentName}</div>
              </div>
              <div>
                <div style={{ color: '#8888a0', fontSize: '12px', marginBottom: '4px' }}>Roll Number</div>
                <div style={{ color: '#f0f0f8', fontSize: '16px', fontWeight: 600 }}>{stats.rollNumber}</div>
              </div>
              <div>
                <div style={{ color: '#8888a0', fontSize: '12px', marginBottom: '4px' }}>Student ID</div>
                <div style={{ color: '#f0f0f8', fontSize: '16px', fontWeight: 600 }}>#{stats.studentId}</div>
              </div>
            </div>
          </div>

          {/* Attendance Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {/* Attendance Percentage */}
            <div style={{
              background: '#18181f',
              border: '1px solid #2a2a35',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <div style={{ color: '#8888a0', fontSize: '12px', marginBottom: '8px' }}>Attendance %</div>
              <div style={{
                color: stats.attendancePercentage >= 75 ? '#34d98b' : '#fb6f84',
                fontSize: '32px',
                fontWeight: 700,
              }}>
                {stats.attendancePercentage}%
              </div>
              <div style={{ color: '#8888a0', fontSize: '11px', marginTop: '4px' }}>
                {stats.attendancePercentage >= 75 ? '✓ Good' : '⚠ Low'}
              </div>
            </div>

            {/* Total Classes */}
            <div style={{
              background: '#18181f',
              border: '1px solid #2a2a35',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <div style={{ color: '#8888a0', fontSize: '12px', marginBottom: '8px' }}>Total Classes</div>
              <div style={{ color: '#f0f0f8', fontSize: '32px', fontWeight: 700 }}>{stats.total}</div>
            </div>

            {/* Present */}
            <div style={{
              background: '#18181f',
              border: `1px solid #34d98b40`,
              borderRadius: '12px',
              padding: '20px',
            }}>
              <div style={{ color: '#8888a0', fontSize: '12px', marginBottom: '8px' }}>Present</div>
              <div style={{ color: '#34d98b', fontSize: '32px', fontWeight: 700 }}>{stats.present}</div>
            </div>

            {/* Absent */}
            <div style={{
              background: '#18181f',
              border: `1px solid #fb6f8440`,
              borderRadius: '12px',
              padding: '20px',
            }}>
              <div style={{ color: '#8888a0', fontSize: '12px', marginBottom: '8px' }}>Absent</div>
              <div style={{ color: '#fb6f84', fontSize: '32px', fontWeight: 700 }}>{stats.absent}</div>
            </div>

            {/* Late */}
            <div style={{
              background: '#18181f',
              border: `1px solid #f5c84240`,
              borderRadius: '12px',
              padding: '20px',
            }}>
              <div style={{ color: '#8888a0', fontSize: '12px', marginBottom: '8px' }}>Late</div>
              <div style={{ color: '#f5c842', fontSize: '32px', fontWeight: 700 }}>{stats.late}</div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance History */}
      <div style={{
        background: '#18181f',
        border: '1px solid #2a2a35',
        borderRadius: '12px',
        padding: '24px',
      }}>
        <h2 style={{ color: '#f0f0f8', margin: '0 0 20px', fontSize: '20px', fontWeight: 600 }}>
          Attendance History
        </h2>

        {attendance.length === 0 ? (
          <div style={{ color: '#8888a0', textAlign: 'center', padding: '40px' }}>
            No attendance records found
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              color: '#f0f0f8',
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2a2a35' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#8888a0', fontSize: '12px', fontWeight: 600 }}>
                    Date
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#8888a0', fontSize: '12px', fontWeight: 600 }}>
                    Subject
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#8888a0', fontSize: '12px', fontWeight: 600 }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record.id} style={{ borderBottom: '1px solid #2a2a3520' }}>
                    <td style={{ padding: '12px', color: '#f0f0f8' }}>
                      {formatDate(record.date)}
                    </td>
                    <td style={{ padding: '12px', color: '#f0f0f8' }}>
                      {record.subject}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        background: `${getStatusColor(record.status)}20`,
                        color: getStatusColor(record.status),
                        border: `1px solid ${getStatusColor(record.status)}40`,
                      }}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
