import React from 'react';
import { EditIcon } from '../icons/EditIcon';

//==================================================================================================================
//    EDIT BUTTON COMPONENT
//    Reusable circular action button for edit operations in tables and lists.
// ==================================================================================================================
export const EditBtn = ({ 
  onClick, 
  className = '', 
  iconClassName = 'w-4 h-4', 
  title = "Edit", 
  ...props 
}) => {
  return (
    <button
      type="button"
      className={`w-8 h-8 rounded-full bg-gray flex items-center justify-center hover:bg-gray/90 transition-colors cursor-pointer shrink-0 ${className}`}
      onClick={onClick}
      title={title}
      {...props}
    >
      <EditIcon className={`${iconClassName} text-primary`} />
    </button>
  );
};

export default EditBtn;
