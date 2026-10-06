export default function Button({ variant = 'primary', busy = false, className = '', children, ...props }) {
  const { disabled, ...buttonProps } = props;
  return <button {...buttonProps} className={`button button-${variant} ${className}`.trim()} disabled={busy || disabled}>{busy ? 'Working…' : children}</button>;
}