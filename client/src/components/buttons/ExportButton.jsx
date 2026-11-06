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
      className={`h-8 w-8 rounded-[7px] bg-gray border-b-2 border-stroke/80 text-primary hover:bg-gray/80 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${className}`.trim()}
      {...props}
    >
      <ExportIcon size={size} color="currentColor" />
      {label && <span>{label}</span>}
    </button>
  );
});

ExportButton.displayName = 'ExportButton';
export default ExportButton;
