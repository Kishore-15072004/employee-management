export default function Form({ onSubmit, className = '', children }) {
  return <form className={`form-stack ${className}`.trim()} onSubmit={onSubmit}>{children}</form>;
}