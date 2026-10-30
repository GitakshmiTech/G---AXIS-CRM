//==================================================================================================================
//    COMMON TEXTAREA INPUT COMPONENT
//    Standardized reusable multi-line text field used across client panel modules
// ==================================================================================================================
import React, { memo } from 'react';

export const TextAreaInput = memo(({
  label,
  value,
  defaultValue,
  name,
  id,
  rows = 3,
  placeholder = '',
  disabled = false,
  readOnly = false,
  required = false,
  onChange,
  className = '',
  containerClassName = 'flex flex-col gap-1 w-full',
  labelClassName = 'text-xs font-semibold text-[#101828]',
  textareaClassName,
  inputClassName,
  ...props
}) => {
  const defaultClass = 'w-full min-h-[100px] p-3 bg-[#F8F9FC] border border-[#D0D5DD] rounded-lg text-xs text-[#101828] placeholder:text-[#475467] font-normal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-y disabled:bg-[#F2F4F8] disabled:cursor-not-allowed';
  const resolvedClass = textareaClassName || inputClassName || defaultClass;

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={id || name} className={labelClassName}>
          {label}
        </label>
      )}
      <textarea
        id={id || name}
        name={name}
        rows={rows}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        onChange={onChange}
        className={`${resolvedClass} ${className}`.trim()}
        {...props}
      />
    </div>
  );
});

export default TextAreaInput;
