//==================================================================================================================
//    IMPORT / DOWNLOAD ICON COMPONENT
//    Custom common icon using the provided Group 10 (1).png asset with #2E8EFF secondary color token.
//==================================================================================================================
import React, { memo } from 'react';
import importImg from '../../../assets/Group 10 (1).png';

export const ImportIcon = memo(({
  size = 15,
  className = '',
  color = '#2E8EFF',
}) => {
  return (
    <span
      role="img"
      aria-label="Download"
      style={{
        width: size,
        height: size,
        backgroundColor: color === 'currentColor' ? 'currentColor' : color,
        maskImage: `url('${importImg}')`,
        WebkitMaskImage: `url('${importImg}')`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
      className={`inline-block shrink-0 ${className}`}
    />
  );
});

export const DownloadIcon = ImportIcon;
export default ImportIcon;
