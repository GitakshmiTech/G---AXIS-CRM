//==================================================================================================================
//    REUSABLE DRAWER DELETE BUTTON COMPONENT
//    Standardized delete action button for drawer footers matching Figma specifications
// ==================================================================================================================

import React, { memo } from 'react';

export const DeleteButton = memo(({
  onClick,
  label = 'Delete',
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[143px] h-[44px] px-6 rounded-[7px] border border-alert bg-[#FCEDEF] hover:bg-[#FCEDEF]/80 text-alert text-sm font-bold transition-all cursor-pointer select-none flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`.trim()}
      {...props}
    >
      {label}
    </button>
  );
});

DeleteButton.displayName = 'DeleteButton';
export default DeleteButton;

