import { useState, useEffect } from 'react';
import "./index.css";
import { authHelpers } from './LoginPage';
import { getMyTimetable, getNotices, getMyAttendanceStats } from './api';

// Design tokens matching the login page
const T = {
  bg:        "#09090b",
  surface:   "#111116",
  card:      "#18181f",
  border:    "#2a2a35",
  borderHov: "#3d3d50",
  gold:      "#f5c842",
  goldDim:   "#c49b1e",
  goldFaint: "#f5c84214",
  goldGlow:  "#f5c84230",
  jade:      "#34d98b",
  jadeDim:   "#1aad68",
  jadeFaint: "#34d98b14",
  rose:      "#fb6f84",
  roseFaint: "#fb6f8414",
  sky:       "#60cdff",
  skyFaint:  "#60cdff14",
  purple:    "#a78bfa",
  text:      "#f0f0f8",
  muted:     "#8888a0",
  faint:     "#3a3a4a",
};

// ── Dynamic student data from auth ───────────────────────────────────────────
// Avatar and name are derived from the real logged-in user, never hardcoded.
function getStudentDisplay() {
  const user    = authHelpers.getUser();
  const student = authHelpers.getStudent();
  const name    = student?.name || user?.name || "Student";
  const rollNo  = student?.rollNumber || "—";
  const avatar  = name
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0].toUpperCase())
    .slice(0, 2)
    .join("");
  return { name, rollNo, avatar };
}

// Finance data helper - shared between Dashboard and Finance tabs
const getFinanceData = () => {
  const currentStudent = authHelpers.getStudent();
  const tuitionPaid = currentStudent?.feesPaid || false;
  return {
    tuition: { amount: 85000, paid: tuitionPaid, dueDate: '2024-04-30' },
    hostel: { amount: 45000, paid: false, dueDate: '2024-04-30' },
    lab: { amount: 5000, paid: true, paidDate: '2024-01-15' },
    library: { amount: 3000, paid: true, paidDate: '2024-01-15' },
  };
};

const calculateFinanceTotals = (financeData: any) => {
  const totalAmount: any = financeData 
    ? Object.values(financeData).reduce((sum: any, item: any) => sum + item.amount, 0)
    : 0;
  const totalPaid: any = financeData
    ? Object.values(financeData).filter((item: any) => item.paid).reduce((sum: any, item: any) => sum + item.amount, 0)
    : 0;
  const totalPending = totalAmount - totalPaid;
  return { totalAmount, totalPaid, totalPending };
};

// Stats are computed fresh inside Dashboard (not at module level) so finance
// figures always reflect the currently logged-in student.
function getStats() {
  const financeData = getFinanceData();
  const totals = calculateFinanceTotals(financeData);
  return [
    { label: "Total Students", value: "145", color: T.sky, icon: "👥" },
    { label: "Total Faculty", value: "28", color: T.purple, icon: "👨‍🏫" },
    { label: "Pending Finance", value: `₹${(totals.totalPending / 100000).toFixed(1)}L`, color: T.rose, icon: "💰" },
    { label: "Courses Active", value: "12", color: T.jade, icon: "📚" },
  ];
}

const recentActivities = [
  { title: "Mid-Semester Exam Schedule Released", type: "Exam", time: "2 hours ago" },
  { title: "Assignment 3 Deadline Extended", type: "Assignment", time: "5 hours ago" },
  { title: "Fee Payment Due", type: "Fee", time: "1 day ago" },
  { title: "Tech Fest Registrations Open", type: "Event", time: "3 days ago" },
];

const TABS = ["Dashboard", "Students", "Faculty", "Finance"];

function StatCard({ label, value, color, icon }: any) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
      border: `1px solid ${color}33`,
      borderRadius: 16,
      padding: "20px 24px",
      flex: 1,
      minWidth: 140,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 80, height: 80, borderRadius: "50%",
        background: `${color}18`,
      }} />
      <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "'Syne', sans-serif", letterSpacing: -1 }}>{value}</div>
      <div style={{ fontSize: 12, color: T.muted, marginTop: 2, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 20, marginTop: 6 }}>{icon}</div>
    </div>
  );
}

function Dashboard({ user }: { user: any }) {
  const [pendingFees, setPendingFees] = useState<number>(0);
  const stats = getStats(); // computed fresh — reflects the current logged-in student

  useEffect(() => {
    const financeData = getFinanceData();
    const totals = calculateFinanceTotals(financeData);
    setPendingFees(totals.totalPending);
  }, []);

  return (
    <div>
      {/* Welcome banner */}
      <div style={{
        background: "linear-gradient(120deg, #0ea5e9 0%, #0f172a 60%)",
        borderRadius: 20,
        padding: "28px 32px",
        marginBottom: 24,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: 32, top: "50%", transform: "translateY(-50%)", fontSize: 80, opacity: 0.08 }}>🎓</div>
        <div style={{ fontSize: 13, color: "#bae6fd", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>Welcome back</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", marginTop: 4 }}>{user?.name || "User"}</div>
        <div style={{ fontSize: 13, color: "#7dd3fc", marginTop: 6 }}>
          {user?.email || "N/A"} &nbsp;·&nbsp; {user?.role || "Student"} &nbsp;·&nbsp; Semester 5
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
        {stats.map(s => (
          <StatCard key={s.label} label={s.label} value={s.value} color={s.color} icon={s.icon} />
        ))}
      </div>

      {/* Content grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Quick overview */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 16, letterSpacing: 0.5 }}>📊 Quick Overview</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Average Attendance", value: "82%", color: T.jade },
              { label: "CGPA", value: "8.6", color: T.gold },
              { label: "Pending Fees", value: `₹${String(pendingFees)}`, color: T.rose },
              { label: "Completed Tasks", value: "12/15", color: T.sky },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: T.muted }}>{item.label}</span>
                <span style={{ fontSize: 13, color: item.color, fontWeight: 700 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 16 }}>🔔 Recent Activities</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {recentActivities.map((activity, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 0", borderBottom: i < recentActivities.length - 1 ? `1px solid ${T.border}` : "none",
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.gold, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{activity.title}</div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{activity.type} · {activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Students() {
  const [attendanceStats, setAttendanceStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const currentUser = authHelpers.getUser();
  const currentStudent = authHelpers.getStudent();

  useEffect(() => {
    if (currentUser?.role === 'student') {
      loadAttendanceStats();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadAttendanceStats = async () => {
    try {
      const stats = await getMyAttendanceStats();
      setAttendanceStats(stats);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: T.muted }}>
        Loading student data...
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 800, color: T.text, fontFamily: "'Syne', sans-serif", marginBottom: 20 }}>Student Profile</div>
      
      {currentStudent && (
        <>
          {/* Student Info Card */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: `1px solid ${T.gold}33`,
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 800,
                color: '#fff',
              }}>
                {currentStudent.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>{currentStudent.name}</div>
                <div style={{ fontSize: 13, color: T.muted }}>{currentStudent.email}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Roll Number</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.gold, fontFamily: "'Syne', sans-serif" }}>{currentStudent.rollNumber}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Department</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{currentStudent.department}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Semester</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Sem {currentStudent.semester}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>CGPA</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.jade, fontFamily: "'Syne', sans-serif" }}>{currentStudent.cgpa}</div>
              </div>
            </div>
          </div>

          {/* Attendance Stats */}
          {attendanceStats && (
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 16 }}>📊 Attendance Summary</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
                <div style={{
                  background: T.surface,
                  border: `1px solid ${T.jade}40`,
                  borderRadius: 10,
                  padding: 16,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>Attendance Rate</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: attendanceStats.attendancePercentage >= 75 ? T.jade : T.rose, fontFamily: "'Syne', sans-serif" }}>
                    {attendanceStats.attendancePercentage}%
                  </div>
                </div>
                <div style={{
                  background: T.surface,
                  border: `1px solid ${T.sky}40`,
                  borderRadius: 10,
                  padding: 16,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>Total Classes</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: T.sky, fontFamily: "'Syne', sans-serif" }}>{attendanceStats.total}</div>
                </div>
                <div style={{
                  background: T.surface,
                  border: `1px solid ${T.jade}40`,
                  borderRadius: 10,
                  padding: 16,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>Present</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: T.jade, fontFamily: "'Syne', sans-serif" }}>{attendanceStats.present}</div>
                </div>
                <div style={{
                  background: T.surface,
                  border: `1px solid ${T.rose}40`,
                  borderRadius: 10,
                  padding: 16,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>Absent</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: T.rose, fontFamily: "'Syne', sans-serif" }}>{attendanceStats.absent}</div>
                </div>
              </div>
            </div>
          )}

          {/* Courses */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 16 }}>📚 Enrolled Courses</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
              {(currentStudent as any).courses?.map((course: string, idx: number) => (
                <div
                  key={idx}
                  style={{
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    padding: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <span style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: `${T.sky}20`,
                    border: `1px solid ${T.sky}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    color: T.sky,
                  }}>📖</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{course}</span>
                </div>
              )) || (
                <div style={{ color: T.muted, fontSize: 13 }}>Course information not available</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Faculty() {
  const [timetable, setTimetable] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tt, n] = await Promise.all([
        getMyTimetable(),
        getNotices(),
      ]);
      setTimetable(tt);
      setNotices(n);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return T.rose;
      case 'medium': return T.gold;
      case 'low': return T.jade;
      default: return T.muted;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exam': return '📝';
      case 'assignment': return '📚';
      case 'event': return '🎉';
      case 'fee': return '💰';
      default: return '📢';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: T.muted }}>
        Loading faculty data...
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 800, color: T.text, fontFamily: "'Syne', sans-serif", marginBottom: 20 }}>Faculty Portal</div>
      
      {/* Timetable Section */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 16 }}>📅 Class Timetable</div>
        {timetable ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {Object.entries(timetable).map(([day, entries]: [string, any]) => (
              <div key={day}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.gold, marginBottom: 8, textTransform: 'uppercase' }}>{day}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
                  {entries.map((entry: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        background: T.surface,
                        border: `1px solid ${T.border}`,
                        borderRadius: 10,
                        padding: 12,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: T.gold, fontWeight: 600 }}>{entry.time}</span>
                        <span style={{ fontSize: 11, color: T.muted }}>{entry.room}</span>
                      </div>
                      <div style={{ fontSize: 14, color: T.text, fontWeight: 600, marginBottom: 4 }}>{entry.subject}</div>
                      <div style={{ fontSize: 12, color: T.muted }}>{entry.faculty}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: T.muted }}>Timetable not available</div>
        )}
      </div>

      {/* Notices Section */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 16 }}>🔔 Notices & Announcements</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {notices.map((notice) => (
            <div
              key={notice.id}
              style={{
                background: T.surface,
                border: `1px solid ${getPriorityColor(notice.priority)}40`,
                borderLeft: `4px solid ${getPriorityColor(notice.priority)}`,
                borderRadius: 10,
                padding: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 16 }}>{getTypeIcon(notice.type)}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{notice.title}</span>
                  </div>
                  <div style={{ fontSize: 11, color: T.muted, marginLeft: 24 }}>
                    {notice.postedBy} · {new Date(notice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  background: `${getPriorityColor(notice.priority)}20`,
                  color: getPriorityColor(notice.priority),
                  border: `1px solid ${getPriorityColor(notice.priority)}40`,
                }}>
                  {notice.priority}
                </span>
              </div>
              <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, marginTop: 8 }}>
                {notice.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Finance() {
  const [financeData, setFinanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use shared finance data helper
    setFinanceData(getFinanceData());
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: T.muted }}>
        Loading finance data...
      </div>
    );
  }

  const { totalAmount, totalPaid, totalPending } = calculateFinanceTotals(financeData);

  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 800, color: T.text, fontFamily: "'Syne', sans-serif", marginBottom: 20 }}>Fee Management</div>
      
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          border: `1px solid ${T.jade}33`,
          borderRadius: 16,
          padding: 20,
        }}>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Total Fees</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: T.text, fontFamily: "'Syne', sans-serif" }}>₹{String(totalAmount)}</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          border: `1px solid ${T.sky}33`,
          borderRadius: 16,
          padding: 20,
        }}>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Paid Amount</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: T.sky, fontFamily: "'Syne', sans-serif" }}>₹{String(totalPaid)}</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          border: `1px solid ${T.rose}33`,
          borderRadius: 16,
          padding: 20,
        }}>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Pending</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: T.rose, fontFamily: "'Syne', sans-serif" }}>₹{totalPending.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 16 }}>📊 Fee Breakdown</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {financeData && Object.entries(financeData).map(([type, data]: [string, any]) => (
            <div
              key={type}
              style={{
                background: T.surface,
                border: `1px solid ${data.paid ? T.jade : T.rose}40`,
                borderRadius: 10,
                padding: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>
                  {type.charAt(0).toUpperCase() + type.slice(1)} Fee
                </div>
                <div style={{ fontSize: 12, color: T.muted }}>
                  Due Date: {new Date(data.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                {data.paid && data.paidDate && (
                  <div style={{ fontSize: 11, color: T.jade, marginTop: 4 }}>
                    ✓ Paid on {new Date(data.paidDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                )}
                {!data.paid && (
                  <div style={{ fontSize: 11, color: T.rose, marginTop: 4, fontWeight: 600 }}>
                    ⚠ Payment Pending
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: T.text, fontFamily: "'Syne', sans-serif" }}>
                  ₹{data.amount.toLocaleString('en-IN')}
                </div>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  background: data.paid ? `${T.jade}20` : `${T.rose}20`,
                  color: data.paid ? T.jade : T.rose,
                  border: `1px solid ${data.paid ? T.jade : T.rose}40`,
                  marginTop: 4,
                }}>
                  {data.paid ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Notice */}
      <div style={{
        background: `${T.gold}14`,
        border: `1px solid ${T.gold}40`,
        borderRadius: 12,
        padding: 16,
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 20 }}>💡</span>
        <div style={{ fontSize: 13, color: T.gold, lineHeight: 1.6 }}>
          <strong>Payment Deadline Extended!</strong><br />
          The deadline for semester fee payment has been extended to April 30, 2024. Late fee of ₹500 will be charged after the deadline.
        </div>
      </div>
    </div>
  );
}



export default function App({ onLogout }: { onLogout?: () => void }) {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [complaintText, setComplaintText] = useState("");
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);

  // Reactive display values — recalculated whenever user/student changes
  const [studentDisplay, setStudentDisplay] = useState(getStudentDisplay);

  useEffect(() => {
    const loggedInUser = authHelpers.getUser();
    setUser(loggedInUser);
    setStudentDisplay(getStudentDisplay());
  }, []);

  const tabIcons: Record<string, string> = {
    Dashboard: "⊞",
    Students: "👥",
    Faculty: "👨‍🏫",
    Finance: "💰",
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard": return <Dashboard user={user} />;
      case "Students": return <Students />;
      case "Faculty": return <Faculty />;
      case "Finance": return <Finance />;
      default: return <Dashboard user={user} />;
    }
  };

  const handleHelp = () => {
    setShowHelpModal(true);
    setShowAvatarMenu(false);
    setComplaintSubmitted(false);
    setComplaintText("");
  };

  const handleComplaintSubmit = () => {
    if (complaintText.trim()) {
      // In real app, send to backend
      setComplaintSubmitted(true);
      setTimeout(() => {
        setShowHelpModal(false);
        setComplaintText("");
        setComplaintSubmitted(false);
      }, 3000);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.bg}; font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.faint}; border-radius: 99px; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: T.bg }}>
        {/* Sidebar */}
        <div style={{
          width: 220,
          background: T.surface,
          borderRight: `1px solid ${T.border}`,
          display: "flex",
          flexDirection: "column",
          padding: "24px 0",
          position: "fixed",
          top: 0, left: 0, bottom: 0,
          zIndex: 50,
          flexShrink: 0,
        }}>
          {/* Logo */}
          <div style={{ padding: "0 24px 28px" }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, color: T.gold, textTransform: "uppercase" }}>Vaish</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.text, fontFamily: "'Syne', sans-serif", lineHeight: 1.2 }}>ERP Portal</div>
          </div>

          {/* Avatar */}
          <div style={{ padding: "0 16px 24px", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: T.card, borderRadius: 12, padding: "10px 12px" }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0,
              }}>{studentDisplay.avatar}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text, lineHeight: 1.2 }}>{studentDisplay.name}</div>
                <div style={{ fontSize: 10, color: T.muted }}>{studentDisplay.rollNo}</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                background: activeTab === tab ? `${T.gold}20` : "transparent",
                color: activeTab === tab ? T.gold : T.muted,
                fontWeight: activeTab === tab ? 700 : 500,
                fontSize: 13, textAlign: "left",
                transition: "all 0.15s",
                borderLeft: activeTab === tab ? `3px solid ${T.gold}` : "3px solid transparent",
              }}>
                <span style={{ fontSize: 15 }}>{tabIcons[tab]}</span>
                {tab}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div style={{ padding: "16px 24px", borderTop: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, lineHeight: 1.5 }}>B.Tech CSE · 5th Sem<br />2024–25</div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ marginLeft: 220, flex: 1, padding: "32px 28px", minWidth: 0 }}>
          {/* Top bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.text, fontFamily: "'Syne', sans-serif" }}>{activeTab}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} · Sem 5
              </div>
            </div>
            {/* Avatar with dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 800, color: "#fff", cursor: "pointer",
                  border: `2px solid ${showAvatarMenu ? T.gold : "transparent"}`,
                  transition: "border-color 0.2s",
                }}
              >
                {studentDisplay.avatar}
              </button>

              {/* Dropdown Menu */}
              {showAvatarMenu && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: 8,
                  background: T.card,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  overflow: "hidden",
                  minWidth: 180,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                  zIndex: 100,
                }}>
                  {/* User Info */}
                  <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{studentDisplay.name}</div>
                    <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{studentDisplay.rollNo}</div>
                  </div>

                  {/* Menu Items */}
                  <button
                    onClick={handleHelp}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "transparent",
                      border: "none",
                      color: T.text,
                      fontSize: 13,
                      fontWeight: 500,
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                      borderBottom: `1px solid ${T.border}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = T.faint}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <span style={{ fontSize: 14 }}>❓</span>
                    Help & Support
                  </button>

                  <button
                    onClick={() => {
                      setShowAvatarMenu(false);
                      onLogout?.();
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "transparent",
                      border: "none",
                      color: T.rose,
                      fontSize: 13,
                      fontWeight: 500,
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${T.rose}15`}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <span style={{ fontSize: 14 }}>🚪</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {renderContent()}
        </div>
      </div>

      {/* Help & Support Modal */}
      {showHelpModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setShowHelpModal(false)}
        >
          <div
            style={{
              background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: 20,
              maxWidth: 500,
              width: "100%",
              maxHeight: "85vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "24px 28px",
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 800, color: T.text, fontFamily: "'Syne', sans-serif" }}>
                💬 Help & Support
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: T.muted,
                  fontSize: 24,
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: 8,
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = T.faint)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: "28px" }}>
              {!complaintSubmitted ? (
                <>
                  {/* Contact Information */}
                  <div
                    style={{
                      background: T.surface,
                      border: `1px solid ${T.border}`,
                      borderRadius: 14,
                      padding: 20,
                      marginBottom: 24,
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 16 }}>
                      📞 Contact Information
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {/* Admin Email */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: `${T.sky}20`,
                            border: `1px solid ${T.sky}40`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18,
                          }}
                        >
                          📧
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>Admin Email</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>admin@vaish.edu</div>
                        </div>
                      </div>

                      {/* Support Phone */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: `${T.jade}20`,
                            border: `1px solid ${T.jade}40`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18,
                          }}
                        >
                          📱
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>Support Helpline</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>+91-9876543210</div>
                        </div>
                      </div>

                      {/* Office Hours */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: `${T.gold}20`,
                            border: `1px solid ${T.gold}40`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18,
                          }}
                        >
                          🕐
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>Office Hours</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Mon-Fri, 9:00 AM - 5:00 PM</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Complaint Form */}
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 12 }}>
                      📝 Submit a Complaint
                    </div>
                    <div style={{ fontSize: 12, color: T.muted, marginBottom: 16 }}>
                      Describe your issue or concern, and we'll get back to you as soon as possible.
                    </div>
                    <textarea
                      value={complaintText}
                      onChange={(e) => setComplaintText(e.target.value)}
                      placeholder="Enter your complaint here..."
                      rows={6}
                      style={{
                        width: "100%",
                        background: T.surface,
                        border: `1px solid ${T.border}`,
                        borderRadius: 12,
                        padding: "14px 16px",
                        color: T.text,
                        fontSize: 14,
                        fontFamily: "inherit",
                        resize: "vertical",
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = T.gold)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
                    />

                    {/* Submit Button */}
                    <button
                      onClick={handleComplaintSubmit}
                      disabled={!complaintText.trim()}
                      style={{
                        width: "100%",
                        padding: "14px",
                        marginTop: 16,
                        background: complaintText.trim()
                          ? "linear-gradient(135deg, #0ea5e9, #6366f1)"
                          : T.faint,
                        border: "none",
                        borderRadius: 12,
                        color: complaintText.trim() ? "#fff" : T.muted,
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: complaintText.trim() ? "pointer" : "not-allowed",
                        fontFamily: "inherit",
                        transition: "all 0.2s",
                        opacity: complaintText.trim() ? 1 : 0.5,
                      }}
                      onMouseEnter={(e) => {
                        if (complaintText.trim()) {
                          e.currentTarget.style.transform = "scale(0.98)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      Submit Complaint →
                    </button>
                  </div>
                </>
              ) : (
                /* Success Message */
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: `${T.jade}20`,
                      border: `2px solid ${T.jade}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                      fontSize: 32,
                      color: T.jade,
                    }}
                  >
                    ✓
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 8 }}>
                    Complaint Submitted!
                  </div>
                  <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.6 }}>
                    Your complaint has been received. We'll respond within 24-48 hours.
                    <br />
                    For urgent matters, please contact admin@vaish.edu
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}