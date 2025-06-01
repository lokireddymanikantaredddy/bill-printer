'use client';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  color?: string;
}

export default function Button({ 
  children, 
  className = '', 
  variant = 'primary',
  color,
  ...props 
}: ButtonProps) {
  const baseClasses = 'btn';
  const variantClasses = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  const colorClasses = color ? `text-${color}-600 hover:text-${color}-700` : '';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses} ${colorClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 