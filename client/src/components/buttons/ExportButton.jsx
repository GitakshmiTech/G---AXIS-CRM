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
  variant = 'gray',
  className = '',
  ...props
}) => {
  const bgClass = variant === 'white' ? 'bg-white-100 hover:bg-white-100/90' : 'bg-gray hover:bg-gray/80';

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`h-8 w-8 rounded-[7px] ${bgClass} border-b-2 border-stroke/80 text-primary flex items-center justify-center transition-colors cursor-pointer shrink-0 ${className}`.trim()}
      {...props}
    >
      <ExportIcon size={size} color="currentColor" />
      {label && <span>{label}</span>}
    </button>
  );
});

ExportButton.displayName = 'ExportButton';
export default ExportButton;
