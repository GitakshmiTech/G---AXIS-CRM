//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives and the custom ExportIcon asset.
// ==================================================================================================================
import React, { memo } from 'react';
import { ExportIcon } from '../icons/ExportIcon';

//==================================================================================================================
//    EXPORT BUTTON COMPONENT
//    Reusable action button configured with the standard theme styling and export icon matching Image 1.
// ==================================================================================================================
export const ExportButton = memo(({
  onClick,
  label,
  title = 'Export',
  size = 15,
  className = '',
  ...props
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`h-[34px] w-[34px] rounded-[7px] border border-stroke bg-white-100 text-black-90 hover:text-primary hover:border-primary/40 flex items-center justify-center transition-colors cursor-pointer shadow-3xs shrink-0 select-none ${className}`.trim()}
      {...props}
    >
      <ExportIcon size={size} color="currentColor" />
      {label && <span>{label}</span>}
    </button>
  );
});

ExportButton.displayName = 'ExportButton';
export default ExportButton;
