import React from 'react';

//==================================================================================================================
//    LEAD STATUS STAR ICON COMPONENT
//    Exact vector icon matching Figma design (circular head with star-shaped outstretched body)
//==================================================================================================================
export const LeadStatusStarIcon = React.memo(({
  size = 14,
  className = '',
  strokeWidth = 2,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top Head Circle */}
      <circle cx="12" cy="4.5" r="2.2" />

      {/* Outstretched Arms, Waist, and Legs Contour */}
      <path d="M4 9.5H20L15.5 14L18 21.5L12 17L6 21.5L8.5 14L4 9.5Z" />
    </svg>
  );
});

LeadStatusStarIcon.displayName = 'LeadStatusStarIcon';
export default LeadStatusStarIcon;

