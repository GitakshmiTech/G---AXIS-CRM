import React from 'react';
import searchImg from '../../../assets/icons/search icon.png';

//==================================================================================================================
//    SEARCH ICON
//==================================================================================================================
export const SearchIcon = ({ size = 20, className = '' }) => {
  return (
    <img
      src={searchImg}
      alt="Search"
      style={{ width: size, height: size }}
      className={`object-contain flex-shrink-0 select-none ${className}`}
    />
  );
};
