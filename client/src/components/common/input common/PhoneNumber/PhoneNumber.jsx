//==================================================================================================================
//    PHONE NUMBER COMPONENT
//    Standardized reusable mobile/phone number input with international dial codes and flags
// ==================================================================================================================
import React, { memo } from 'react';
import PhoneInput from '../../PhoneInput';

export const PhoneNumber = memo(({
  label = 'Mobile Number',
  value = '',
  onChange,
  name = 'mobile',
  placeholder = '98765 43210',
  required = false,
  disabled = false,
  containerClassName = 'flex flex-col gap-1 w-full',
  labelClassName = 'text-xs font-semibold text-[#101828]',
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
        disabled={disabled}
        className={className}
        {...props}
      />
    </div>
  );
});

export default PhoneNumber;
