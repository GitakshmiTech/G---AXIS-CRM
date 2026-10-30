//==================================================================================================================
//    CONTACT AVATAR PLACEHOLDER COMPONENT
//    Standardized reusable placeholder avatar matching Figma contact profile specification (Image 3)
//==================================================================================================================

import React, { memo } from 'react';

export const ContactAvatarPlaceholder = memo(({
  size = 'w-[76px] h-[76px]',
  className = '',
}) => {
  return (
    <div
      className={`rounded-full border border-stroke bg-gray flex items-center justify-center shrink-0 overflow-hidden select-none ${size} ${className}`.trim()}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-11 h-11"
        aria-hidden="true"
      >
        {/* User 1 (Front Person) Head */}
        <circle
          cx="27"
          cy="24"
          r="6.5"
          stroke="#BCC7E3"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* User 1 (Front Person) Shoulders */}
        <path
          d="M 15.5 42.5 C 15.5 35.8 20.8 33 27 33 C 33.2 33 38.5 35.8 38.5 42.5"
          stroke="#BCC7E3"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* User 2 (Rear Person) Head Arc */}
        <path
          d="M 36.5 19.5 C 39.2 20.2 41.2 22.2 41.2 24.8 C 41.2 27.4 39.2 29.4 36.5 30.1"
          stroke="#BCC7E3"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* User 2 (Rear Person) Shoulders Arc */}
        <path
          d="M 40.5 37 C 43.2 38.2 45.2 40.2 45.8 42.5"
          stroke="#BCC7E3"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
});

export default ContactAvatarPlaceholder;
