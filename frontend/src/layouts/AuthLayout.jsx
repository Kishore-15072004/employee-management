export default function AuthLayout({ children }) {
  return <main className="auth-page">
    <section className="auth-art"><div className="brand-lockup"><span className="brand-mark">P</span><span>PeopleOS</span></div><div className="art-stamp">PEOPLE<br />FIRST<br /><span>ALWAYS</span></div><div className="art-caption">A calmer way to run<br />the work behind the work.</div><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="art-sun" /></section>
    <section className="auth-panel"><div className="auth-content">{children}</div><div className="auth-legal">SECURE EMPLOYEE WORKSPACE <span>·</span> EST. 2025</div></section>
  </main>;
}