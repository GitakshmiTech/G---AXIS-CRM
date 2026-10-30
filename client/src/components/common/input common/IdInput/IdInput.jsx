//==================================================================================================================
//    COMMON ID INPUT COMPONENT
//    Standardized read-only / auto-generated identity badge input box used across client panel modules
//    (Organization ID, Company ID, Branch ID, Department ID, Designation ID, Grade ID, etc.)
// ==================================================================================================================
import React, { memo } from 'react';

export const IdInput = memo(({
  label = 'ID',
  value,
  defaultValue,
  name,
  id,
  disabled = true,
  readOnly,
  placeholder,
  onChange,
  className = '',
  containerClassName = 'flex flex-col gap-1 w-full',
  labelClassName = 'text-xs font-semibold text-[#101828]',
  inputClassName = 'w-full h-[40px] px-3 bg-[#F8F9FC] border border-[#D0D5DD] rounded-lg text-xs text-[#101828] font-normal focus:outline-none select-none disabled:bg-[#F8F9FC] disabled:cursor-not-allowed',
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
        type="text"
        id={id || name}
        name={name}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={onChange}
        className={`${inputClassName} ${className}`.trim()}
        {...props}
      />
    </div>
  );
});

export default IdInput;
