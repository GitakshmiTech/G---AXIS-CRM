//==================================================================================================================
//    REUSABLE BACK BUTTON COMPONENT
//    Standardized admin panel back button using back_button.png icon with consistent styling and interaction.
// ==================================================================================================================
import React from 'react';
import backIcon from '../../../assets/icons/back_button.png';

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
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-[#D0D5DD] hover:border-[#B2B9C8] hover:bg-gray/10 text-black-90 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer active:scale-95 shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed select-none ${className}`}
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
