//==================================================================================================================
//    PHONE NUMBER COMPONENT
//    Standardized reusable mobile/phone number input with international dial codes and flags
// ==================================================================================================================
import { memo } from 'react';
import PhoneInput from './PhoneInput';
import { FieldError } from './FieldError';

export const PhoneNumber = memo(({
  label = 'Mobile Number',
  value = '',
  onChange,
  name = 'mobile',
  placeholder = '98765 43210',
  required = false,
  error = '',
  disabled = false,
  containerClassName = 'flex flex-col gap-1 w-full',
  labelClassName = 'text-xs font-semibold text-black-90',
  className = '',
  ...props
}) => {
  return (
    <div className={containerClassName}>
      {label && <label className={labelClassName}>{label}</label>}
      <PhoneInput
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        disabled={disabled}
        className={className}
        {...props}
      />
      <FieldError name={name} error={error} />
    </div>
  );
});

export default PhoneNumber;
