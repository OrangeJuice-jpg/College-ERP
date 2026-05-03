import React, { useState, useEffect, useCallback } from "react";
import type { CSSProperties, FormEvent } from "react";

/* ─── Design tokens ─── */
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

/* ─── API base URL ─── */
const API_BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

/* ─── Types ─── */
interface StudentData {
  id: number;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  semester: number;
  year: number;
  cgpa: number;
  status: string;
  feesPaid?: boolean;
  feesAmount?: number;
}

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

/* ─── Auth helpers ─── */
export const authHelpers = {
  getToken: (): string | null => localStorage.getItem("vaish_token"),
  getUser: (): AuthUser | null => {
    try { return JSON.parse(localStorage.getItem("vaish_user") || "null"); }
    catch { return null; }
  },
  getStudent: (): StudentData | null => {
    try { return JSON.parse(localStorage.getItem("vaish_student") || "null"); }
    catch { return null; }
  },
  isLoggedIn: (): boolean => !!localStorage.getItem("vaish_token"),
  save: (token: string, user: AuthUser, student?: StudentData | null): void => {
    localStorage.setItem("vaish_token", token);
    localStorage.setItem("vaish_user", JSON.stringify(user));
    if (student) {
      localStorage.setItem("vaish_student", JSON.stringify(student));
    }
  },
  clear: (): void => {
    localStorage.removeItem("vaish_token");
    localStorage.removeItem("vaish_user");
    localStorage.removeItem("vaish_student");
  },
  authHeader: (): Record<string, string> => ({
    Authorization: `Bearer ${localStorage.getItem("vaish_token")}`,
  }),
};

/* ─── Particles background ─── */
function Particles() {
  const dots = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: (i * 37 + 11) % 100,
    y: (i * 53 + 7) % 100,
    size: (i % 3) + 1,
    dur: 8 + (i % 5) * 2,
    delay: -(i * 1.3),
  }));

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="goldGrad" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor={T.gold} stopOpacity="0.06" />
            <stop offset="100%" stopColor={T.gold} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#goldGrad)" />
        {dots.map(d => (
          <circle key={d.id} r={d.size} fill={T.gold} opacity="0.15">
            <animateMotion
              dur={`${d.dur}s`}
              begin={`${d.delay}s`}
              repeatCount="indefinite"
              path={`M ${d.x}% ${d.y}% q 3% -4% 0% -8% q -3% -4% 0% 0%`}
            />
          </circle>
        ))}
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${T.gold}08 1px,transparent 1px),linear-gradient(90deg,${T.gold}08 1px,transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
    </div>
  );
}

/* ─── Input ─── */
interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}
function Input({ label, type = "text", value, onChange, placeholder, autoComplete, required }: InputProps) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 8 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", boxSizing: "border-box",
            background: T.surface,
            border: `1px solid ${focused ? T.gold : T.border}`,
            borderRadius: 10,
            padding: isPassword ? "13px 44px 13px 16px" : "13px 16px",
            color: T.text, fontSize: 15, outline: "none",
            transition: "border-color 0.2s", fontFamily: "inherit",
          }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)}
            style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: T.muted, fontSize: 13, padding: 0 }}>
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Button ─── */
interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "danger" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
}
function Btn({ children, onClick, type = "button", variant = "primary", loading, disabled, style: exStyle }: BtnProps) {
  const isPrimary = variant === "primary";
  const isDanger  = variant === "danger";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        width: "100%", padding: "14px", borderRadius: 10,
        border: isPrimary ? "none" : `1px solid ${isDanger ? T.rose : T.border}`,
        background: isPrimary ? `linear-gradient(135deg,${T.gold},${T.goldDim})` : isDanger ? T.roseFaint : T.faint,
        color: isPrimary ? "#09090b" : isDanger ? T.rose : T.text,
        fontWeight: 700, fontSize: 15,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.6 : 1,
        transition: "opacity 0.2s, transform 0.1s",
        fontFamily: "inherit", letterSpacing: "0.02em",
        ...exStyle,
      }}
      onMouseDown={e => { if (!disabled && !loading) (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)"; }}
      onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}

/* ─── Alert ─── */
function Alert({ message, type = "error" }: { message: string; type?: "error" | "success" }) {
  if (!message) return null;
  const isError = type === "error";
  return (
    <div style={{
      padding: "12px 16px", borderRadius: 10, marginBottom: 20,
      background: isError ? T.roseFaint : T.jadeFaint,
      border: `1px solid ${isError ? T.rose + "40" : T.jade + "40"}`,
      color: isError ? T.rose : T.jade, fontSize: 14, lineHeight: 1.5,
    }}>
      {message}
    </div>
  );
}

/* ─── Role badge ─── */
function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    admin:   { bg: T.goldFaint, border: T.gold + "40", text: T.gold },
    faculty: { bg: T.skyFaint,  border: T.sky + "40",  text: T.sky  },
    student: { bg: T.jadeFaint, border: T.jade + "40", text: T.jade },
  };
  const c = colors[role] ?? colors["student"];
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
    }}>
      {role}
    </span>
  );
}

/* ─── LOGIN PAGE ─── */
export function LoginPage({ onLoginSuccess }: { onLoginSuccess?: (user: AuthUser) => void }) {
  const [tab, setTab]           = useState<"login" | "register">("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [role, setRole]         = useState("student");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const reset = () => { setError(""); setSuccess(""); };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); reset(); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      authHelpers.save(data.token, data.user, data.student);
      onLoginSuccess?.(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault(); reset();
    if (!name.trim()) { setError("Full name is required"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      setSuccess("Account created! You can now log in.");
      setTab("login");
      setName(""); setPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", fontFamily: "'Satoshi','DM Sans',system-ui,sans-serif" }}>
      <Particles />
      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>

        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 16, background: T.goldFaint, border: `1px solid ${T.gold}30`, marginBottom: 20, fontSize: 26 }}>◈</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>Vaish ERP</h1>
          <p style={{ margin: "8px 0 0", color: T.muted, fontSize: 14 }}>{tab === "login" ? "Sign in to your portal" : "Create a new account"}</p>
        </div>

        {/* Card */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: "32px" }}>
          {/* Tab switcher */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, background: T.surface, borderRadius: 10, padding: 4, marginBottom: 28 }}>
            {(["login", "register"] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); reset(); }} style={{
                padding: "9px 0", borderRadius: 8, border: "none",
                background: tab === t ? T.goldFaint : "transparent",
                color: tab === t ? T.gold : T.muted,
                fontWeight: tab === t ? 700 : 400, fontSize: 14, cursor: "pointer",
                transition: "all 0.2s", fontFamily: "inherit", textTransform: "capitalize",
              }}>
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <Alert message={error} type="error" />
          <Alert message={success} type="success" />

          {tab === "login" ? (
            <form onSubmit={handleLogin}>
              <Input label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@vaish.ac.in" autoComplete="email" required />
              <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="Enter your password" autoComplete="current-password" required />
              <Btn type="submit" loading={loading}>Sign In →</Btn>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <Input label="Full name" value={name} onChange={setName} placeholder="Your full name" autoComplete="name" required />
              <Input label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@vaish.ac.in" autoComplete="email" required />
              <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="Create a password" autoComplete="new-password" required />
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 8 }}>Role</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["student", "faculty", "admin"].map(r => (
                    <button key={r} type="button" onClick={() => setRole(r)} style={{
                      flex: 1, padding: "10px 8px", borderRadius: 9,
                      border: `1px solid ${role === r ? T.gold + "80" : T.border}`,
                      background: role === r ? T.goldFaint : T.surface,
                      color: role === r ? T.gold : T.muted,
                      fontSize: 13, fontWeight: role === r ? 700 : 400,
                      cursor: "pointer", textTransform: "capitalize", fontFamily: "inherit",
                    }}>{r}</button>
                  ))}
                </div>
              </div>
              <Btn type="submit" loading={loading}>Create Account →</Btn>
            </form>
          )}
        </div>

        <p style={{ textAlign: "center", color: T.faint, fontSize: 12, marginTop: 24 }}>
          © 2024 Vaish ERP · All rights reserved
        </p>
      </div>
    </div>
  );
}

/* ─── LOGOUT PAGE ─── */
export function LogoutPage({ onLogoutComplete }: { onLogoutComplete?: () => void }) {
  const user = authHelpers.getUser();
  const [loading, setLoading]     = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHelpers.authHeader() },
      });
    } catch { /* best-effort */ } finally {
      authHelpers.clear();
      setConfirmed(true);
      setTimeout(() => onLogoutComplete?.(), 1800);
    }
  }, [onLogoutComplete]);

  if (confirmed) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Satoshi','DM Sans',system-ui,sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.jadeFaint, border: `1px solid ${T.jade}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28, color: T.jade }}>✓</div>
          <h2 style={{ color: T.text, margin: "0 0 8px", fontSize: 22 }}>Signed out</h2>
          <p style={{ color: T.muted, fontSize: 14, margin: 0 }}>Redirecting to login…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", fontFamily: "'Satoshi','DM Sans',system-ui,sans-serif" }}>
      <Particles />
      <div style={{ width: "100%", maxWidth: 380, position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: T.goldFaint, border: `2px solid ${T.gold}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 26, fontWeight: 700, color: T.gold }}>
          {user?.name ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "?"}
        </div>
        <div style={{ marginBottom: 6 }}><RoleBadge role={user?.role || "student"} /></div>
        <h2 style={{ color: T.text, fontSize: 22, fontWeight: 700, margin: "12px 0 4px" }}>{user?.name || "User"}</h2>
        <p style={{ color: T.muted, fontSize: 14, margin: "0 0 32px" }}>{user?.email}</p>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: "28px" }}>
          <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
            You'll be signed out of Vaish ERP and redirected to the login page.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Btn variant="danger" onClick={handleLogout} loading={loading}>
              Yes, Sign Me Out
            </Btn>
            <Btn variant="ghost" onClick={() => window.history.back()}>
              Cancel
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── AUTH GUARD ─── */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(authHelpers.getUser);
  const [page, setPage] = useState<"login" | "logout" | "app">("login");

  useEffect(() => {
    if (authHelpers.isLoggedIn()) setPage("app");
  }, []);

  const handleLogout = () => {
    authHelpers.clear();
    setPage("logout");
  };

  if (page === "app" && user) {
    // Inject onLogout so App can trigger the animated logout screen
    return (
      <div>
        {React.cloneElement(children as React.ReactElement<any>, { onLogout: handleLogout })}
      </div>
    );
  }

  if (page === "logout") {
    return <LogoutPage onLogoutComplete={() => { setUser(null); setPage("login"); }} />;
  }

  return <LoginPage onLoginSuccess={u => { setUser(u); setPage("app"); }} />;
}

export default LoginPage;
