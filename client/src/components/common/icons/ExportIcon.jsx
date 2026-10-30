import React from 'react';
import exportImg from '../../../assets/Group 10.png';

//==================================================================================================================
//    EXPORT ICON COMPONENT
//    Custom common icon using the provided Group 10.png asset with Black-90 (#262727) color token.
// ==================================================================================================================
export const ExportIcon = ({
  size = 15,
  className = '',
  color = 'var(--color-black-90, #262727)',
}) => {
  return (
    <span
      role="img"
      aria-label="Export"
      style={{
        width: size,
        height: size,
        backgroundColor: color === 'currentColor' ? 'currentColor' : color,
        maskImage: `url('${exportImg}')`,
        WebkitMaskImage: `url('${exportImg}')`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
      className={`inline-block flex-shrink-0 ${className}`}
    />
  );
};

export default ExportIcon;

