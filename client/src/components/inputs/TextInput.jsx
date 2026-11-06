//==================================================================================================================
//    COMMON TEXT INPUT COMPONENT
//    Standardized reusable text input field used for name, address, and plain text metadata
// ==================================================================================================================
import React, { memo } from 'react';

export const TextInput = memo(({
  label,
  value,
  defaultValue,
  name,
  id,
  type = 'text',
  placeholder = '',
  disabled = false,
  readOnly = false,
  required = false,
  onChange,
  className = '',
  containerClassName = 'flex flex-col gap-1 w-full',
  labelClassName = 'text-xs font-semibold text-black-90',
  inputClassName = 'w-full h-[40px] px-3 bg-gray border-b-2 border-stroke/80 rounded-[7px] text-xs text-black-90 placeholder:text-black-90/40 font-normal focus:outline-none transition-all disabled:bg-gray disabled:cursor-not-allowed',
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

export default TextInput;