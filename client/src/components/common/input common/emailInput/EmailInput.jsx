//==================================================================================================================
//    COMMON EMAIL INPUT COMPONENT
//    Standardized reusable email input field used across client panel modules and authentication layouts
// ==================================================================================================================
import { memo } from 'react';

export const EmailInput = memo(({
  label = 'Email',
  value,
  defaultValue,
  name = 'email',
  id,
  type = 'email',
  placeholder = 'Enter your email address',
  disabled = false,
  readOnly = false,
  required = false,
  onChange,
  className = '',
  containerClassName = 'flex flex-col gap-1 w-full',
  labelClassName = 'text-xs font-semibold text-[#101828]',
  inputClassName = 'w-full h-[40px] px-3 bg-[#F8F9FC] border border-[#D0D5DD] rounded-lg text-xs text-[#101828] placeholder:text-[#475467] font-normal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all disabled:bg-[#F8F9FC] disabled:cursor-not-allowed',
  ...props
}) => {
  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={id || name} className={labelClassName}>
          {label}
        </label>
      )}
      <input
        type={type}
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
    </div>
  );
});

export default EmailInput;
