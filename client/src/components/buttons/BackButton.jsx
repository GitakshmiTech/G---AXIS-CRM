//==================================================================================================================
//    REUSABLE BACK BUTTON COMPONENT
//    Standardized admin panel back button using back_button.png icon with consistent styling and interaction.
// ==================================================================================================================
import React from 'react';
import backIcon from '../../assets/icons/back_button.png';

//==================================================================================================================
//    BACK BUTTON
//==================================================================================================================
export const BackButton = ({
  onClick,
  label = 'Back',
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
      className={`inline-flex items-center justify-center gap-2 px-4 py-1.5 sm:py-2 bg-gray hover:bg-gray/80 border-b-2 border-stroke/80 text-black-90 rounded-[7px] text-xs sm:text-sm font-semibold transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      <img
        src={backIcon}
        alt=""
        className="w-[6px] h-[10px] object-contain shrink-0"
        aria-hidden="true"
      />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
