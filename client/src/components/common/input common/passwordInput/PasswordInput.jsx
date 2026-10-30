//==================================================================================================================
//    COMMON PASSWORD INPUT COMPONENT
//    Standardized reusable password input field with show/hide toggle and optional forgot password link
// ==================================================================================================================
import { memo, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PasswordInput = memo(({
  label = 'Password',
  value,
  defaultValue,
  name = 'password',
  id,
  placeholder = 'Enter your password',
  disabled = false,
  readOnly = false,
  required = false,
  onChange,
  className = '',
  containerClassName = 'flex flex-col gap-1 w-full',
  labelClassName = 'text-xs font-semibold text-[#101828]',
  inputClassName = 'w-full h-[40px] px-3 pr-10 bg-[#F8F9FC] border border-[#D0D5DD] rounded-lg text-xs text-[#101828] placeholder:text-[#475467] font-normal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all disabled:bg-[#F8F9FC] disabled:cursor-not-allowed',
  forgotPasswordLink,
  forgotPasswordState,
  forgotPasswordText = 'Forgot password?',
  onForgotPassword,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={containerClassName}>
      <div className="flex items-center justify-between">
        {label && (
          <label htmlFor={id || name} className={labelClassName}>
            {label}
          </label>
        )}
        {forgotPasswordLink && (
          <Link
            to={forgotPasswordLink}
            state={forgotPasswordState}
            className="text-xs text-secondary hover:underline font-bold cursor-pointer"
          >
            {forgotPasswordText}
          </Link>
        )}
        {!forgotPasswordLink && onForgotPassword && (
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs text-secondary hover:underline font-bold cursor-pointer"
          >
            {forgotPasswordText}
          </button>
        )}
      </div>

      <div className="relative w-full">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id || name}
          name={name}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          onChange={onChange}
          className={`${inputClassName} ${className}`.trim()}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary hover:opacity-80 transition-opacity focus:outline-none cursor-pointer"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff size={18} strokeWidth={2} />
          ) : (
            <Eye size={18} strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
});

export default PasswordInput;
