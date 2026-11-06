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
  labelClassName = 'text-xs font-semibold text-black-90',
  inputClassName = 'w-full h-[40px] px-3 pr-10 bg-gray border-b-2 border-stroke/80 rounded-[7px] text-xs text-black-90 placeholder:text-black-90/40 font-normal focus:outline-none transition-all disabled:bg-gray disabled:cursor-not-allowed',
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
