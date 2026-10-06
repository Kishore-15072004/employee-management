export default function Card({ title, eyebrow, action, className = '', children }) {
  return <section className={`panel foundation-card ${className}`.trim()}>
    {(title || eyebrow || action) && <header className="panel-heading"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}{title && <h2>{title}</h2>}</div>{action}</header>}
    {children}
  </section>;
}