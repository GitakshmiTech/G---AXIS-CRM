//==================================================================================================================
//    React Imports
//==================================================================================================================
import { memo } from 'react';

//==================================================================================================================
//    COMMON BUTTON COMPONENT
//    Reusable button supporting children, variants, and native button properties
//==================================================================================================================
export const Button = memo(({
  children,
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  variant = 'primary',
  ...props
}) => {
  // Base styling for uniform height, text, and transition behavior
  const baseClasses = 'w-full h-[40px] rounded-lg text-sm font-semibold transition-all shadow-sm focus:outline-none cursor-pointer flex items-center justify-center';

  // Predefined theme variant classes
  const variantClasses = variant === 'secondary'
    ? 'bg-[#F6F8FA] border border-stroke hover:bg-gray text-black-90'
    : 'bg-primary hover:bg-blue-800 text-white hover:scale-[1.005] active:scale-[0.995] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
});

//==================================================================================================================
//    Default Export
//==================================================================================================================
export default Button;
