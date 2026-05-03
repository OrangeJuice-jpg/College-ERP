import React, { useState, useEffect } from 'react';
import { authHelpers } from '../../../client/src/LoginPage';
import { getStudents } from '../services/api';

interface Student {
  id: number;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  semester: number;
  year: number;
  cgpa: number;
  phone: string;
  address: string;
  dateOfBirth: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  feesPaid: boolean;
  feesAmount: number;
  courses: string[];
  avatar: string;
  gender: string;
  bloodGroup: string;
  guardianName: string;
  guardianPhone: string;
  userId?: number;
}

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = authHelpers.getUser();
  const currentStudent = authHelpers.getStudent();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  // If user is student, show only their data
  const displayStudents = currentUser?.role === 'student' && currentStudent
    ? students.filter(s => s.userId === currentUser.id)
    : students;

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#8888a0' }}>Loading students...</div>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#f0f0f8', fontSize: '28px', fontWeight: 700, margin: 0 }}>
          {currentUser?.role === 'student' ? 'My Profile' : 'Students Management'}
        </h1>
        {currentStudent && (
          <div style={{
            padding: '8px 16px',
            background: '#34d98b14',
            border: '1px solid #34d98b40',
            borderRadius: '8px',
            color: '#34d98b',
            fontSize: '14px',
            fontWeight: 600,
          }}>
            Roll No: {currentStudent.rollNumber}
          </div>
        )}
      </div>

      {displayStudents.length === 0 ? (
        <div style={{
          background: '#18181f',
          border: '1px solid #2a2a35',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          color: '#8888a0',
        }}>
          No student records found
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {displayStudents.map((student) => (
            <div
              key={student.id}
              style={{
                background: '#18181f',
                border: '1px solid #2a2a35',
                borderRadius: '12px',
                padding: '24px',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#f5c84280')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#2a2a35')}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background: '#f5c84214',
                    border: '1px solid #f5c84240',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#f5c842',
                  }}>
                    {student.avatar}
                  </div>
                  <div>
                    <h2 style={{ color: '#f0f0f8', margin: '0 0 4px', fontSize: '20px', fontWeight: 600 }}>
                      {student.name}
                    </h2>
                    <div style={{ color: '#8888a0', fontSize: '14px' }}>{student.email}</div>
                  </div>
                </div>
                <div style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  background: student.status === 'active' ? '#34d98b14' : '#fb6f8414',
                  border: `1px solid ${student.status === 'active' ? '#34d98b40' : '#fb6f8440'}`,
                  color: student.status === 'active' ? '#34d98b' : '#fb6f84',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}>
                  {student.status}
                </div>
              </div>

              {/* Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <div style={{ color: '#8888a0', fontSize: '12px', marginBottom: '4px' }}>Roll Number</div>
                  <div style={{ color: '#f0f0f8', fontSize: '15px', fontWeight: 600 }}>{student.rollNumber}</div>
                </div>
                <div>
                  <div style={{ color: '#8888a0', fontSize: '12px', marginBottom: '4px' }}>Department</div>
                  <div style={{ color: '#f0f0f8', fontSize: '15px', fontWeight: 600 }}>{student.department}</div>
                </div>
                <div>
                  <div style={{ color: '#8888a0', fontSize: '12px', marginBottom: '4px' }}>Semester</div>
                  <div style={{ color: '#f0f0f8', fontSize: '15px', fontWeight: 600 }}>Sem {student.semester}, Year {student.year}</div>
                </div>
                <div>
                  <div style={{ color: '#8888a0', fontSize: '12px', marginBottom: '4px' }}>CGPA</div>
                  <div style={{ color: student.cgpa >= 8 ? '#34d98b' : '#f5c842', fontSize: '15px', fontWeight: 600 }}>{student.cgpa}</div>
                </div>
                <div>
                  <div style={{ color: '#8888a0', fontSize: '12px', marginBottom: '4px' }}>Phone</div>
                  <div style={{ color: '#f0f0f8', fontSize: '15px', fontWeight: 600 }}>{student.phone}</div>
                </div>
                <div>
                  <div style={{ color: '#8888a0', fontSize: '12px', marginBottom: '4px' }}>Blood Group</div>
                  <div style={{ color: '#f0f0f8', fontSize: '15px', fontWeight: 600 }}>{student.bloodGroup}</div>
                </div>
              </div>

              {/* Courses */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ color: '#8888a0', fontSize: '12px', marginBottom: '8px' }}>Enrolled Courses</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {student.courses.map((course, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '6px 12px',
                        background: '#60cdff14',
                        border: '1px solid #60cdff40',
                        borderRadius: '6px',
                        color: '#60cdff',
                        fontSize: '13px',
                        fontWeight: 500,
                      }}
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              {/* Guardian Info */}
              <div style={{
                padding: '16px',
                background: '#09090b40',
                borderRadius: '8px',
                border: '1px solid #2a2a35',
              }}>
                <div style={{ color: '#8888a0', fontSize: '12px', marginBottom: '8px' }}>Guardian Information</div>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ color: '#f0f0f8', fontSize: '14px', fontWeight: 600 }}>{student.guardianName}</div>
                    <div style={{ color: '#8888a0', fontSize: '12px' }}>{student.guardianPhone}</div>
                  </div>
                </div>
              </div>

              {/* Fees Status */}
              <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: student.feesPaid ? '#34d98b14' : '#fb6f8414',
                border: `1px solid ${student.feesPaid ? '#34d98b40' : '#fb6f8440'}`,
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <span style={{ color: student.feesPaid ? '#34d98b' : '#fb6f84', fontWeight: 600 }}>
                    {student.feesPaid ? '✓ Fees Paid' : '⚠ Fees Pending'}
                  </span>
                </div>
                <div style={{ color: '#f0f0f8', fontWeight: 700, fontSize: '16px' }}>
                  ₹{student.feesAmount.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Students;