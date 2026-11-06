import React from 'react';

//==================================================================================================================
//    EDIT ICON COMPONENT
//    Shared icon component rendering the inline SVG asset.
// ==================================================================================================================
export const EditIcon = ({ className = "w-[18px] h-[18px]" }) => {
  return (
    <svg 
      className={className}
      width="16" 
      height="16" 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8.52783 14.75H14.7501" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.0229 4.16773L3.93863 14.2922C3.64674 14.5853 3.25014 14.75 2.83651 14.75H1.53076C1.09956 14.75 0.75 14.3974 0.75 13.9662V12.649C0.75 12.2375 0.913038 11.8427 1.20342 11.5512L11.2902 1.42418C13.6325 -0.535504 15.9748 2.20804 14.0229 4.16773Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.3241 2.54688L12.9823 5.20512" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};
