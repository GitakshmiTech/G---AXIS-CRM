import React from 'react';
import logoutImg from '../../../assets/Container.png';

//==================================================================================================================
//    LOGOUT ICON COMPONENT
//    Reusable logout icon component using the custom Container.png asset.
//    Created to match the exact circular arrow design from Figma.
// ==================================================================================================================
export const LogoutIcon = ({ size = 18, className = '' }) => {
  return (
    <img
      src={logoutImg}
      alt="Logout"
      style={{ width: size, height: size }}
      className={`object-contain flex-shrink-0 ${className}`}
    />
  );
};
