import React from 'react';
import { ViewIcon } from '../icons/ViewIcon';

//==================================================================================================================
//    VIEW BUTTON COMPONENT
//    Reusable circular action button for view operations in tables and lists.
// ==================================================================================================================
export const ViewBtn = ({ 
  onClick, 
  className = '', 
  iconClassName = '', 
  title = "View", 
  ...props 
}) => {
  return (
    <button
      type="button"
      className={`w-8 h-8 rounded-full bg-gray flex items-center justify-center text-secondary hover:bg-gray/90 transition-colors cursor-pointer shrink-0 ${className}`}
      onClick={onClick}
      title={title}
      {...props}
    >
      <ViewIcon size={16} className={`${iconClassName} text-primary`} />
    </button>
  );
};

export default ViewBtn;
