import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   DESIGN TOKENS — Vaish ERP
   Refined dark theme with amber-gold accents
   Font: Clash Display (headings) + Satoshi (body)
───────────────────────────────────────────────*/
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

/* ─── DATA ─────────────────────────────────── */
const student = {
  name: "Vaishnavi Sharma",
  rollNo: "22CS019",
  branch: "B.Tech CSE",
  semester: "5th Sem",
  cgpa: "9.1",
  avatar: "VS",
  email: "22cs019@vaish.ac.in",
  phone: "+91 98765 43210",
  section: "A",
  advisor: "Dr. Meera Iyer",
};

const attendanceData = [
  { subject: "Data Structures",       code: "CS301", present: 38, total: 42, faculty: "Prof. Rajesh Kumar" },
  { subject: "Operating Systems",      code: "CS302", present: 31, total: 40, faculty: "Dr. Anita Singh" },
  { subject: "DBMS",                   code: "CS303", present: 39, total: 42, faculty: "Prof. Sunil Mehta" },
  { subject: "Computer Networks",      code: "CS304", present: 28, total: 38, faculty: "Dr. Kavitha Nair" },
  { subject: "Software Engineering",   code: "CS305", present: 35, total: 36, faculty: "Prof. Arun Das" },
];

const marksData = [
  { subject: "Data Structures",      code: "CS301", mid1: 24, mid2: 22, practical: 28, max: 30 },
  { subject: "Operating Systems",    code: "CS302", mid1: 20, mid2: 18, practical: 25, max: 30 },
  { subject: "DBMS",                 code: "CS303", mid1: 26, mid2: 27, practical: 29, max: 30 },
  { subject: "Computer Networks",    code: "CS304", mid1: 19, mid2: 21, practical: 24, max: 30 },
  { subject: "Software Engineering", code: "CS305", mid1: 28, mid2: 26, practical: 30, max: 30 },
];

const notices = [
  { id: 1, title: "Mid-Semester Exam Schedule Released", tag: "Exam",       date: "28 Apr", urgent: true,  body: "Exams begin May 12. Hall tickets available in the portal." },
  { id: 2, title: "DBMS Assignment 3 Deadline Extended", tag: "Assignment", date: "27 Apr", urgent: false, body: "New deadline: May 7, 11:59 PM. Submit via the assignments portal." },
  { id: 3, title: "Tech Fest Registrations Open",        tag: "Event",      date: "25 Apr", urgent: false, body: "Annual Tech Fest 'Encode 2025' — register before May 3." },
  { id: 4, title: "Fee Payment Last Date: 10 May",       tag: "Fee",        date: "24 Apr", urgent: true,  body: "Late fee of ₹500/day will be charged after the deadline." },
  { id: 5, title: "Library Book Return Reminder",        tag: "Library",    date: "23 Apr", urgent: false, body: "All borrowed books due by April 30. Avoid fines." },
];

// Timetable is now fetched from the API in the Timetable component

const assignments = [
  { sub: "DBMS", title: "ER Diagram for Library System",     due: "2 May",  submitted: false, marks: null  },
  { sub: "OS",   title: "Process Scheduling Simulation",     due: "5 May",  submitted: true,  marks: 18    },
  { sub: "CN",   title: "Socket Programming Lab Report",     due: "8 May",  submitted: false, marks: null  },
  { sub: "SE",   title: "SRS Document Draft",                due: "12 May", submitted: false, marks: null  },
  { sub: "DS",   title: "AVL Tree Implementation",           due: "15 May", submitted: false, marks: null  },
];

const subjectColors = {
  "DS": T.sky,     "DS Lab": T.sky,
  "OS": T.purple,  "OS Lab": T.purple,
  "DBMS": T.jade,  "DBMS Lab": T.jade,
  "CN": T.gold,
  "SE": T.rose,
};

const TABS = [
  { id: "Dashboard",   icon: "◈", label: "Dashboard"   },
  { id: "Attendance",  icon: "◷", label: "Attendance"  },
  { id: "Marks",       icon: "◎", label: "Marks"       },
  { id: "Assignments", icon: "◻", label: "Assignments" },
  { id: "Timetable",   icon: "▦", label: "Timetable"  },
  { id: "Notices",     icon: "◉", label: "Notices"     },
  { id: "Profile",     icon: "◯", label: "Profile"     },
];

/* ─── SHARED PRIMITIVES ─────────────────────── */

function pct(present, total) { return Math.round((present / total) * 100); }

function attColor(p) {
  if (p >= 75) return T.jade;
  if (p >= 65) return T.gold;
  return T.rose;
}

function AttBar({ present, total }) {
  const p = pct(present, total);
  const c = attColor(p);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 5, background: T.faint, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${p}%`, height: "100%", background: c, borderRadius: 99, transition: "width .7s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: c, minWidth: 34, textAlign: "right" }}>{p}%</span>
    </div>
  );
}

function Chip({ children, color, faint }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      background: faint || `${color}18`,
      color: color,
      borderRadius: 6,
      padding: "3px 10px",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 0.4,
      border: `1px solid ${color}30`,
    }}>{children}</span>
  );
}

function Card({ children, style, accent }) {
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${accent ? accent + "33" : T.border}`,
      borderRadius: 16,
      padding: "22px 24px",
      ...style,
    }}>{children}</div>
  );
}

function SectionHead({ children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, marginBottom: 22,
    }}>
      <div style={{ width: 3, height: 22, background: T.gold, borderRadius: 99, flexShrink: 0 }} />
      <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: T.text, fontFamily: "'Clash Display', 'Syne', sans-serif", letterSpacing: -0.3 }}>
        {children}
      </h2>
    </div>
  );
}

/* ─── DASHBOARD ─────────────────────────────── */
function Dashboard() {
  const avgAtt = Math.round(attendanceData.reduce((a, s) => a + pct(s.present, s.total), 0) / attendanceData.length);
  const pending = assignments.filter(a => !a.submitted).length;
  const urgentCount = notices.filter(n => n.urgent).length;

  const stats = [
    { label: "Avg Attendance", value: `${avgAtt}%`, color: avgAtt >= 75 ? T.jade : T.gold, sub: "5 subjects" },
    { label: "CGPA",           value: student.cgpa, color: T.purple, sub: "5th Semester" },
    { label: "Pending Tasks",  value: pending,       color: T.gold,   sub: "assignments" },
    { label: "Urgent Notices", value: urgentCount,   color: T.rose,   sub: "need action" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Hero Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${T.gold}22 0%, ${T.card} 55%, ${T.purple}14 100%)`,
        border: `1px solid ${T.gold}25`,
        borderRadius: 20,
        padding: "32px 36px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* decorative rings */}
        <div style={{ position: "absolute", right: -30, top: -30, width: 200, height: 200, borderRadius: "50%", border: `1px solid ${T.gold}15` }} />
        <div style={{ position: "absolute", right: 10, top: 10, width: 120, height: 120, borderRadius: "50%", border: `1px solid ${T.gold}10` }} />

        <div style={{ fontSize: 11, fontWeight: 700, color: T.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Welcome back</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: T.text, fontFamily: "'Clash Display', 'Syne', sans-serif", letterSpacing: -0.5, marginBottom: 6 }}>
          {student.name}
        </div>
        <div style={{ fontSize: 13, color: T.muted }}>
          {student.rollNo} &nbsp;·&nbsp; {student.branch} &nbsp;·&nbsp; {student.semester} &nbsp;·&nbsp; Section {student.section}
        </div>
        <div style={{ marginTop: 18 }}>
          <Chip color={T.gold}> CGPA {student.cgpa} / 10 </Chip>
        </div>
      </div>

      {/* Stat Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {stats.map(s => (
          <Card key={s.label} accent={s.color} style={{ padding: "18px 20px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>{s.label}</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: s.color, fontFamily: "'Clash Display', 'Syne', sans-serif", letterSpacing: -1, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 6 }}>{s.sub}</div>
          </Card>
        ))}
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Attendance snapshot */}
        <Card>
          <SectionHead>Attendance Snapshot</SectionHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {attendanceData.map(s => (
              <div key={s.code}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{s.subject}</span>
                  <span style={{ fontSize: 11, color: T.muted }}>{s.present}/{s.total}</span>
                </div>
                <AttBar present={s.present} total={s.total} />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent notices */}
        <Card>
          <SectionHead>Recent Notices</SectionHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {notices.slice(0, 4).map((n, i) => {
              const tagColor = { Exam: T.rose, Assignment: T.gold, Event: T.jade, Fee: T.purple, Library: T.sky }[n.tag] || T.muted;
              return (
                <div key={n.id} style={{
                  padding: "13px 0",
                  borderBottom: i < 3 ? `1px solid ${T.border}` : "none",
                  display: "flex", gap: 12, alignItems: "flex-start",
                }}>
                  {n.urgent && (
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.rose, marginTop: 5, flexShrink: 0 }} />
                  )}
                  {!n.urgent && (
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.faint, marginTop: 5, flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: T.text, fontWeight: 600, lineHeight: 1.4 }}>{n.title}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
                      <Chip color={tagColor}>{n.tag}</Chip>
                      <span style={{ fontSize: 11, color: T.muted }}>{n.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ─── ATTENDANCE ─────────────────────────────── */
function Attendance() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <SectionHead>Attendance Record</SectionHead>
      {attendanceData.map(s => {
        const p = pct(s.present, s.total);
        const c = attColor(p);
        const statusLabel = p >= 75 ? "Safe" : p >= 65 ? "At Risk" : "Short";
        const need = p < 75 ? Math.max(0, Math.ceil(0.75 * s.total - s.present)) : 0;
        return (
          <Card key={s.code} accent={c}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{s.subject}</div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{s.code} · {s.faculty}</div>
              </div>
              <Chip color={c}>{statusLabel}</Chip>
            </div>
            <AttBar present={s.present} total={s.total} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
              <span style={{ fontSize: 12, color: T.muted }}>Attended: <strong style={{ color: T.text }}>{s.present}/{s.total}</strong></span>
              {need > 0 ? (
                <span style={{ fontSize: 12, color: T.gold }}>Need {need} more class{need !== 1 ? "es" : ""} for 75%</span>
              ) : (
                <span style={{ fontSize: 12, color: T.jade }}>Requirement met ✓</span>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

/* ─── MARKS ─────────────────────────────────── */
function Marks() {
  return (
    <div>
      <SectionHead>Internal Marks</SectionHead>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: T.surface }}>
              {["Subject", "Mid 1", "Mid 2", "Practical", "Total", "Grade"].map(h => (
                <th key={h} style={{ padding: "14px 18px", textAlign: "left", color: T.muted, fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", borderBottom: `1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {marksData.map((m, i) => {
              const total = m.mid1 + m.mid2 + m.practical;
              const maxTotal = m.max * 3;
              const p = Math.round(total / maxTotal * 100);
              const c = p >= 80 ? T.jade : p >= 65 ? T.gold : T.rose;
              const grade = p >= 90 ? "O" : p >= 80 ? "A+" : p >= 70 ? "A" : p >= 60 ? "B+" : "B";
              return (
                <tr key={i} style={{ borderBottom: i < marksData.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <td style={{ padding: "16px 18px", color: T.text, fontWeight: 600 }}>
                    <div>{m.subject}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>{m.code}</div>
                  </td>
                  <td style={{ padding: "16px 18px", color: T.sky }}>{m.mid1}<span style={{ color: T.muted, fontSize: 11 }}>/{m.max}</span></td>
                  <td style={{ padding: "16px 18px", color: T.sky }}>{m.mid2}<span style={{ color: T.muted, fontSize: 11 }}>/{m.max}</span></td>
                  <td style={{ padding: "16px 18px", color: T.sky }}>{m.practical}<span style={{ color: T.muted, fontSize: 11 }}>/{m.max}</span></td>
                  <td style={{ padding: "16px 18px" }}>
                    <span style={{ fontWeight: 800, color: c, fontSize: 15 }}>{total}</span>
                    <span style={{ color: T.muted, fontSize: 11 }}>/{maxTotal} ({p}%)</span>
                  </td>
                  <td style={{ padding: "16px 18px" }}>
                    <Chip color={c}>{grade}</Chip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Legend */}
      <div style={{ display: "flex", gap: 20, marginTop: 16, paddingLeft: 4 }}>
        {[["O / A+", ">= 80%", T.jade], ["A / B+", "60–79%", T.gold], ["B & below", "< 60%", T.rose]].map(([grade, range, c]) => (
          <div key={grade} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
            <span style={{ fontSize: 12, color: T.muted }}>{grade} <span style={{ color: T.faint }}>·</span> {range}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── ASSIGNMENTS ────────────────────────────── */
function Assignments() {
  const [items, setItems] = useState(assignments);

  const toggle = (i) => setItems(items.map((x, j) => j === i ? { ...x, submitted: !x.submitted } : x));

  const subColor = { DBMS: T.jade, OS: T.purple, CN: T.gold, SE: T.rose, DS: T.sky };

  return (
    <div>
      <SectionHead>Assignments</SectionHead>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((a, i) => {
          const c = subColor[a.sub] || T.muted;
          return (
            <Card key={i} accent={a.submitted ? T.jade : undefined} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 22px" }}>
              {/* Subject badge */}
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: `${c}18`, border: `1px solid ${c}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: c, letterSpacing: 0.5,
              }}>{a.sub}</div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
                <div style={{ display: "flex", gap: 10, marginTop: 5, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: T.muted }}>Due: <span style={{ color: T.gold }}>{a.due}</span></span>
                  {a.submitted && a.marks != null && (
                    <Chip color={T.jade}>Marks: {a.marks}/25</Chip>
                  )}
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => toggle(i)}
                style={{
                  background: a.submitted ? T.jadeFaint : T.gold,
                  color: a.submitted ? T.jade : T.bg,
                  border: a.submitted ? `1px solid ${T.jade}40` : "none",
                  borderRadius: 8,
                  padding: "9px 18px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                  letterSpacing: 0.3,
                }}
              >
                {a.submitted ? "✓ Submitted" : "Mark Submit"}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ─── TIMETABLE ──────────────────────────────── */
function Timetable() {
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const DAY_SHORT = { Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri" };
  const todayFull = DAYS[new Date().getDay() - 1] || null;
  const TIME_SLOTS = ["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-01:00", "02:00-03:00", "03:00-04:00"];

  const [timetableByDay, setTimetableByDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCell, setSelectedCell] = useState(null);

  // Build a color map from subject name
  const getSubjectColor = (subject) => {
    if (!subject || subject === "Lunch" || subject === "-") return null;
    const name = subject.toLowerCase();
    if (name.includes("data structure") || name.includes("ds")) return T.sky;
    if (name.includes("operating") || name.includes("os")) return T.purple;
    if (name.includes("dbms") || name.includes("database")) return T.jade;
    if (name.includes("network") || name.includes("cn")) return T.gold;
    if (name.includes("software") || name.includes("se")) return T.rose;
    if (name.includes("algorithm")) return T.sky;
    if (name.includes("machine") || name.includes("ml")) return "#f97316";
    if (name.includes("web")) return "#a78bfa";
    if (name.includes("thermo") || name.includes("fluid") || name.includes("cad")) return "#fb923c";
    if (name.includes("analog") || name.includes("vlsi") || name.includes("signal")) return "#38bdf8";
    if (name.includes("structural") || name.includes("survey") || name.includes("soil")) return "#86efac";
    // Hash the subject name to pick a stable color
    const colors = [T.sky, T.purple, T.jade, T.gold, T.rose, "#f97316", "#a78bfa", "#38bdf8"];
    let hash = 0;
    for (let i = 0; i < subject.length; i++) hash = subject.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  // Get short label for a subject
  const getShortLabel = (subject) => {
    if (!subject || subject === "-") return "—";
    const abbrevMap = {
      "Data Structures": "DS", "DS Lab": "DS Lab",
      "Operating Systems": "OS", "OS Lab": "OS Lab",
      "DBMS": "DBMS", "DBMS Lab": "DBMS Lab",
      "Computer Networks": "CN",
      "Software Engineering": "SE",
      "Algorithms": "Algo",
      "Machine Learning": "ML",
      "Web Development": "Web Dev",
      "Thermodynamics": "Thermo",
      "Fluid Mechanics": "Fluid",
      "CAD": "CAD",
      "Structural Analysis": "Struct",
      "Surveying": "Survey",
      "Soil Mechanics": "Soil",
      "Analog Circuits": "Analog",
      "VLSI": "VLSI",
      "Signals": "Signals",
      "Lunch": "Lunch",
    };
    return abbrevMap[subject] || subject.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 5);
  };

  useEffect(() => {
    const token = localStorage.getItem("vaish_token");
    fetch("/api/timetable/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.message) setError(data.message);
        else setTimetableByDay(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback to default CS timetable if API fails
        setTimetableByDay({
          Monday:    [
            { time: "09:00-10:00", subject: "DS Lab",  faculty: "Dr. Priya Rao",    room: "Lab 101" },
            { time: "10:00-11:00", subject: "OS",       faculty: "Prof. Kumar Singh", room: "Room 302" },
            { time: "11:00-12:00", subject: "DBMS",     faculty: "Dr. Sneha Patil",  room: "Room 303" },
            { time: "12:00-01:00", subject: "Lunch",    faculty: "-",                room: "-" },
            { time: "02:00-03:00", subject: "CN",       faculty: "Prof. Amit Joshi", room: "Room 304" },
            { time: "03:00-04:00", subject: "SE",       faculty: "Prof. Meera Nair", room: "Room 305" },
          ],
          Tuesday:   [
            { time: "09:00-10:00", subject: "OS",       faculty: "Prof. Kumar Singh", room: "Room 302" },
            { time: "10:00-11:00", subject: "DS",       faculty: "Dr. Priya Rao",    room: "Room 301" },
            { time: "11:00-12:00", subject: "SE",       faculty: "Prof. Meera Nair", room: "Room 305" },
            { time: "12:00-01:00", subject: "Lunch",    faculty: "-",                room: "-" },
            { time: "02:00-03:00", subject: "DBMS Lab", faculty: "Dr. Sneha Patil",  room: "Lab 103" },
            { time: "03:00-04:00", subject: "CN",       faculty: "Prof. Amit Joshi", room: "Room 304" },
          ],
          Wednesday: [
            { time: "09:00-10:00", subject: "DBMS",     faculty: "Dr. Sneha Patil",  room: "Room 303" },
            { time: "10:00-11:00", subject: "DS",       faculty: "Dr. Priya Rao",    room: "Room 301" },
            { time: "11:00-12:00", subject: "OS Lab",   faculty: "Prof. Kumar Singh", room: "Lab 102" },
            { time: "12:00-01:00", subject: "Lunch",    faculty: "-",                room: "-" },
            { time: "02:00-03:00", subject: "SE",       faculty: "Prof. Meera Nair", room: "Room 305" },
            { time: "03:00-04:00", subject: "DBMS",     faculty: "Dr. Sneha Patil",  room: "Room 303" },
          ],
          Thursday:  [
            { time: "09:00-10:00", subject: "CN",       faculty: "Prof. Amit Joshi", room: "Room 304" },
            { time: "10:00-11:00", subject: "SE",       faculty: "Prof. Meera Nair", room: "Room 305" },
            { time: "11:00-12:00", subject: "DS",       faculty: "Dr. Priya Rao",    room: "Room 301" },
            { time: "12:00-01:00", subject: "Lunch",    faculty: "-",                room: "-" },
            { time: "02:00-03:00", subject: "OS",       faculty: "Prof. Kumar Singh", room: "Room 302" },
            { time: "03:00-04:00", subject: "DBMS",     faculty: "Dr. Sneha Patil",  room: "Room 303" },
          ],
          Friday:    [
            { time: "09:00-10:00", subject: "SE",       faculty: "Prof. Meera Nair", room: "Room 305" },
            { time: "10:00-11:00", subject: "CN",       faculty: "Prof. Amit Joshi", room: "Room 304" },
            { time: "11:00-12:00", subject: "OS Lab",   faculty: "Prof. Kumar Singh", room: "Lab 102" },
            { time: "12:00-01:00", subject: "Lunch",    faculty: "-",                room: "-" },
            { time: "02:00-03:00", subject: "DS",       faculty: "Dr. Priya Rao",    room: "Room 301" },
            { time: "03:00-04:00", subject: "OS",       faculty: "Prof. Kumar Singh", room: "Room 302" },
          ],
        });
        setLoading(false);
      });
  }, []);

  // Get entry for a specific day + time slot
  const getEntry = (day, slot) => {
    if (!timetableByDay || !timetableByDay[day]) return null;
    return timetableByDay[day].find(e => e.time === slot) || null;
  };

  // Collect all unique subjects for legend
  const allSubjects = [];
  if (timetableByDay) {
    Object.values(timetableByDay).forEach(dayEntries => {
      dayEntries.forEach(e => {
        if (e.subject && e.subject !== "Lunch" && e.subject !== "-" && !allSubjects.find(s => s.name === e.subject)) {
          allSubjects.push({ name: e.subject, color: getSubjectColor(e.subject) });
        }
      });
    });
  }

  if (loading) return (
    <div>
      <SectionHead>Weekly Timetable</SectionHead>
      <Card style={{ textAlign: "center", padding: "48px", color: T.muted }}>Loading timetable…</Card>
    </div>
  );

  return (
    <div>
      <SectionHead>Weekly Timetable</SectionHead>

      {/* Today's highlight banner */}
      {todayFull && timetableByDay && timetableByDay[todayFull] && (
        <div style={{
          background: `${T.gold}10`, border: `1px solid ${T.gold}25`,
          borderRadius: 12, padding: "12px 18px", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>📅</span>
          <div>
            <span style={{ color: T.gold, fontWeight: 700, fontSize: 13 }}>Today — {todayFull}</span>
            <span style={{ color: T.muted, fontSize: 12, marginLeft: 10 }}>
              {timetableByDay[todayFull].filter(e => e.subject !== "Lunch" && e.subject !== "-").length} classes scheduled
            </span>
          </div>
        </div>
      )}

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: T.surface }}>
                <th style={{ padding: "12px 18px", color: T.muted, fontWeight: 700, textAlign: "left", borderBottom: `1px solid ${T.border}`, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", minWidth: 110 }}>TIME</th>
                {DAYS.map(d => (
                  <th key={d} style={{
                    padding: "12px 10px", textAlign: "center", minWidth: 100,
                    color: d === todayFull ? T.gold : T.muted,
                    fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase",
                    borderBottom: `1px solid ${T.border}`,
                    background: d === todayFull ? `${T.gold}0a` : "transparent",
                  }}>
                    {DAY_SHORT[d]}{d === todayFull && " ●"}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot, i) => (
                <tr key={slot} style={{ borderBottom: i < TIME_SLOTS.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <td style={{ padding: "10px 18px", color: T.muted, fontWeight: 600, whiteSpace: "nowrap", background: T.surface, fontSize: 11 }}>{slot}</td>
                  {DAYS.map((day, j) => {
                    const entry = getEntry(day, slot);
                    const subject = entry?.subject || "—";
                    const isLunch = subject === "Lunch";
                    const isEmpty = subject === "—" || subject === "-";
                    const color = getSubjectColor(subject);
                    const isToday = day === todayFull;
                    const cellKey = `${day}-${slot}`;
                    const isSelected = selectedCell === cellKey;

                    return (
                      <td key={j} style={{
                        padding: "6px 5px", textAlign: "center",
                        background: isToday ? `${T.gold}06` : "transparent",
                        cursor: (!isLunch && !isEmpty) ? "pointer" : "default",
                      }}
                        onClick={() => !isLunch && !isEmpty && setSelectedCell(isSelected ? null : cellKey)}
                      >
                        {isLunch ? (
                          <div style={{ color: T.faint, fontSize: 10, padding: "6px 0", letterSpacing: 1, textTransform: "uppercase" }}>Lunch</div>
                        ) : isEmpty ? (
                          <div style={{ color: T.faint, fontSize: 11 }}>—</div>
                        ) : (
                          <div style={{
                            background: color ? `${color}18` : T.faint,
                            border: `1px solid ${color ? color + (isSelected ? "80" : "30") : T.border}`,
                            color: color || T.muted,
                            borderRadius: 8,
                            padding: isSelected ? "8px 4px" : "7px 4px",
                            fontWeight: 700,
                            fontSize: 11,
                            letterSpacing: 0.3,
                            transition: "all 0.15s",
                            boxShadow: isSelected ? `0 0 0 2px ${color}30` : "none",
                          }}>
                            <div>{getShortLabel(subject)}</div>
                            {isSelected && entry && (
                              <div style={{ marginTop: 5, fontSize: 9, color: T.muted, fontWeight: 400, lineHeight: 1.4 }}>
                                <div>{entry.faculty !== "-" ? entry.faculty : ""}</div>
                                <div>{entry.room !== "-" ? entry.room : ""}</div>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p style={{ fontSize: 11, color: T.faint, marginTop: 8, paddingLeft: 4 }}>Tap any class to see faculty & room details</p>

      {/* Dynamic legend */}
      {allSubjects.length > 0 && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12, paddingLeft: 4 }}>
          {allSubjects.map(({ name, color }) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: color || T.faint }} />
              <span style={{ fontSize: 11, color: T.muted }}>{getShortLabel(name)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── NOTICES ────────────────────────────────── */
function Notices() {
  const [expanded, setExpanded] = useState(null);
  const tagColor = { Exam: T.rose, Assignment: T.gold, Event: T.jade, Fee: T.purple, Library: T.sky };

  return (
    <div>
      <SectionHead>Notice Board</SectionHead>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {notices.map(n => {
          const tc = tagColor[n.tag] || T.muted;
          const open = expanded === n.id;
          return (
            <Card key={n.id} accent={n.urgent ? T.rose : undefined} style={{ cursor: "pointer", transition: "border-color 0.2s" }}
              onClick={() => setExpanded(open ? null : n.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                    <Chip color={tc}>{n.tag}</Chip>
                    {n.urgent && <Chip color={T.rose}>Urgent</Chip>}
                    <span style={{ fontSize: 11, color: T.muted, marginLeft: 4 }}>{n.date}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{n.title}</div>
                  {open && (
                    <div style={{ fontSize: 13, color: T.muted, marginTop: 10, lineHeight: 1.6, borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
                      {n.body}
                    </div>
                  )}
                </div>
                <span style={{ color: T.muted, fontSize: 18, marginLeft: 12, transition: "transform 0.2s", display: "block", transform: open ? "rotate(180deg)" : "none" }}>⌄</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ─── PROFILE ────────────────────────────────── */
function Profile() {
  const fields = [
    ["Roll Number", student.rollNo],
    ["Branch", student.branch],
    ["Semester", student.semester],
    ["Section", student.section],
    ["Email", student.email],
    ["Phone", student.phone],
    ["Faculty Advisor", student.advisor],
  ];
  return (
    <div>
      <SectionHead>Student Profile</SectionHead>
      <Card>
        {/* Avatar row */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${T.border}` }}>
          <div style={{
            width: 72, height: 72, borderRadius: 18, flexShrink: 0,
            background: `linear-gradient(135deg, ${T.gold}, ${T.rose})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 800, color: "#09090b",
            fontFamily: "'Clash Display', 'Syne', sans-serif",
          }}>{student.avatar}</div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.text, fontFamily: "'Clash Display', 'Syne', sans-serif", letterSpacing: -0.5 }}>{student.name}</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>{student.branch} · {student.semester}</div>
            <div style={{ marginTop: 10 }}>
              <Chip color={T.gold}>CGPA: {student.cgpa}</Chip>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0px" }}>
          {fields.map(([label, value], i) => (
            <div key={label} style={{
              padding: "14px 0",
              borderBottom: i < fields.length - 2 ? `1px solid ${T.border}` : "none",
              paddingRight: i % 2 === 0 ? 32 : 0,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{value}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─── APP SHELL ──────────────────────────────── */
export default function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Read logged-in user from localStorage (set by LoginPage)
  const getLoggedInUser = () => {
    try { return JSON.parse(localStorage.getItem("vaish_user") || "null"); }
    catch { return null; }
  };
  const [loggedInUser, setLoggedInUser] = useState(getLoggedInUser);

  // Re-read user whenever the tab changes (catches logins between renders)
  // Also listen to storage events for cross-tab login/logout
  useEffect(() => {
    const onStorage = () => setLoggedInUser(getLoggedInUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Derive display values from logged-in user
  const userName   = loggedInUser?.name  || student.name;
  const userAvatar = loggedInUser?.name
    ? loggedInUser.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : student.avatar;
  const userRole   = loggedInUser?.role  || "student";
  const userEmail  = loggedInUser?.email || student.email;

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":   return <Dashboard />;
      case "Attendance":  return <Attendance />;
      case "Marks":       return <Marks />;
      case "Assignments": return <Assignments />;
      case "Timetable":   return <Timetable />;
      case "Notices":     return <Notices />;
      case "Profile":     return <Profile />;
      default:            return <Dashboard />;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.bg}; font-family: 'DM Sans', system-ui, sans-serif; color: ${T.text}; }
        button { font-family: inherit; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.faint}; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: ${T.muted}; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: T.bg }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          width: 228,
          background: T.surface,
          borderRight: `1px solid ${T.border}`,
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0, left: 0, bottom: 0,
          zIndex: 50,
          overflowY: "auto",
        }}>
          {/* Logo */}
          <div style={{ padding: "26px 22px 20px" }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 4, color: T.gold, textTransform: "uppercase", marginBottom: 4 }}>Vaish</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.text, fontFamily: "'Syne', sans-serif", lineHeight: 1.1, letterSpacing: -0.5 }}>ERP Portal</div>
          </div>

          {/* Student chip */}
          <div style={{ margin: "0 14px 20px", padding: "12px 14px", background: T.card, borderRadius: 12, border: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: `linear-gradient(135deg, ${T.gold}, ${T.rose})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: T.bg,
              }}>{userAvatar}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</div>
                <div style={{ fontSize: 10, color: T.muted, textTransform: "capitalize" }}>{userRole}</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 2 }}>
            {TABS.map(tab => {
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 10, border: "none",
                  cursor: "pointer", width: "100%", textAlign: "left",
                  background: active ? `${T.gold}18` : "transparent",
                  color: active ? T.gold : T.muted,
                  fontWeight: active ? 700 : 500,
                  fontSize: 13,
                  transition: "all 0.15s ease",
                  borderLeft: active ? `2px solid ${T.gold}` : "2px solid transparent",
                }}>
                  <span style={{ fontSize: 14, opacity: active ? 1 : 0.6 }}>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div style={{ padding: "16px 22px", borderTop: `1px solid ${T.border}`, marginTop: 8 }}>
            <div style={{ fontSize: 10, color: T.faint, lineHeight: 1.6 }}>
              {userEmail}<br />
              Academic Year 2024–25
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main style={{ marginLeft: 228, flex: 1, padding: "32px 32px", minWidth: 0, minHeight: "100vh" }}>
          {/* Top Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: T.text, fontFamily: "'Syne', sans-serif", letterSpacing: -0.6 }}>{activeTab}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>
                {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · {userRole}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {/* Search pill */}
              <div style={{
                background: T.card, border: `1px solid ${T.border}`, borderRadius: 99,
                padding: "8px 20px", fontSize: 12, color: T.muted, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 13 }}>⌕</span> Search…
              </div>
              {/* Avatar */}
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: `linear-gradient(135deg, ${T.gold}, ${T.rose})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: T.bg, cursor: "pointer",
                border: `2px solid ${T.gold}40`,
              }}>{userAvatar}</div>
            </div>
          </div>

          {/* Content */}
          {renderContent()}
        </main>
      </div>
    </>
  );
}