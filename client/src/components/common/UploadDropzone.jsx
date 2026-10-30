//==================================================================================================================
//    UPLOAD DROPZONE COMPONENT
//    Standard reusable document and file upload box with drag-and-drop aesthetics across all ERP drawers
//==================================================================================================================

import React, { memo, useRef } from 'react';
import { Plus } from 'lucide-react';

//==================================================================================================================
//    UPLOAD DROPZONE
//==================================================================================================================
export const UploadDropzone = memo(({
  label = 'Upload Document (PNG, JPG or PDF (Max 5MB))',
  placeholder = 'Drag and drop or click to upload',
  accept = '.png,.jpg,.jpeg,.pdf',
  onFileSelect,
  disabled = false,
  className = '',
}) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0 && onFileSelect) {
      onFileSelect(files);
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`.trim()}>
      {label && (
        <label className="text-xs font-semibold text-black-90 select-none">
          {label}
        </label>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />

      {/* Dashed Drag & Drop Box */}
      <div
        onClick={handleClick}
        className={`w-full h-[46px] border border-dashed border-[#D0D5DD] bg-[#F8F9FC] rounded-lg flex items-center justify-center gap-2 transition-colors group select-none ${
          disabled
            ? 'opacity-60 cursor-not-allowed bg-gray/30'
            : 'cursor-pointer hover:bg-gray/60'
        }`}
      >
        <Plus
          size={15}
          className="text-primary group-hover:scale-110 transition-transform shrink-0"
        />
        <span className="text-xs font-medium text-[#475467] group-hover:text-primary transition-colors truncate px-2">
          {placeholder}
        </span>
      </div>
    </div>
  );
});

export default UploadDropzone;
