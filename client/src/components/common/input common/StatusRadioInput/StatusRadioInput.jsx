//==================================================================================================================
//    COMMON STATUS RADIO INPUT COMPONENT
//    Standardized reusable Active / Inactive radio status selector used across client panel modules
// ==================================================================================================================
import React, { memo, useState } from 'react';

export const StatusRadioInput = memo(({
  label = 'Status',
  value,
  defaultValue = 'active',
  name = 'status',
  id,
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
  activeValue = 'active',
  inactiveValue = 'inactive',
  disabled = false,
  onChange,
  variant = 'dot',
  containerClassName = 'flex flex-col gap-1',
  labelClassName = 'text-xs font-semibold text-[#101828]',
  groupClassName = 'flex gap-4 items-center h-[40px]',
  optionLabelClassName = 'text-xs font-semibold text-[#101828]',
  disabledClassName = 'cursor-not-allowed opacity-70',
  activeDotClassName,
  activeBorderClassName,
  inactiveBorderClassName,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleSelect = (val, e) => {
    if (disabled) return;
    if (!isControlled) {
      setInternalValue(val);
    }
    if (onChange) {
      onChange(e);
    }
  };

  const isOptionActive = String(currentValue).toLowerCase() === String(activeValue).toLowerCase();
  const isOptionInactive = String(currentValue).toLowerCase() === String(inactiveValue).toLowerCase();

  const isSolid = variant === 'solid';
  const resolvedActiveBorder = activeBorderClassName || (isSolid ? 'bg-success shadow-2xs' : 'border-2 border-success');
  const resolvedInactiveBorder = inactiveBorderClassName || (isSolid ? 'border-[1.5px] border-stroke bg-transparent hover:border-primary/50' : 'border-[1.5px] border-[#667085] bg-transparent');
  const resolvedActiveDot = activeDotClassName || (isSolid ? 'w-1.5 h-1.5 rounded-full bg-white-100' : 'w-2 h-2 rounded-full bg-success');

  return (
    <div className={containerClassName}>
      {label && <label className={labelClassName}>{label}</label>}
      <div className={groupClassName}>
        {/* Active Radio */}
        <label
          className={`flex items-center gap-2 select-none ${optionLabelClassName} ${disabled ? disabledClassName : 'cursor-pointer'
            }`}
        >
          <span
            className={`w-4 h-4 rounded-full flex items-center justify-center transition-all shrink-0 ${isOptionActive ? resolvedActiveBorder : resolvedInactiveBorder
              }`}
          >
            {isOptionActive && (
              <span className={resolvedActiveDot} />
            )}
          </span>
          <input
            type="radio"
            name={name}
            value={activeValue}
            checked={isOptionActive}
            disabled={disabled}
            onChange={(e) => handleSelect(activeValue, e)}
            className="sr-only"
            {...props}
          />
          <span>{activeLabel}</span>
        </label>

        {/* Inactive Radio */}
        <label
          className={`flex items-center gap-2 select-none ${optionLabelClassName} ${disabled ? disabledClassName : 'cursor-pointer'
            }`}
        >
          <span
            className={`w-4 h-4 rounded-full flex items-center justify-center transition-all shrink-0 ${isOptionInactive ? resolvedActiveBorder : resolvedInactiveBorder
              }`}
          >
            {isOptionInactive && (
              <span className={resolvedActiveDot} />
            )}
          </span>
          <input
            type="radio"
            name={name}
            value={inactiveValue}
            checked={isOptionInactive}
            disabled={disabled}
            onChange={(e) => handleSelect(inactiveValue, e)}
            className="sr-only"
            {...props}
          />
          <span>{inactiveLabel}</span>
        </label>
      </div>
    </div>
  );
});

export const StatusInput = StatusRadioInput;
export const StatusRadio = StatusRadioInput;
export default StatusRadioInput;
