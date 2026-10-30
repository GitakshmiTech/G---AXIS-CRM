//==================================================================================================================
//    DOCUMENT CARD COMPONENT
//    Standard reusable document card using lucide-react icons with project common design tokens
//==================================================================================================================
import React, { memo } from 'react';
import { Paperclip, X } from 'lucide-react';
import { ImportIcon } from './icons/ImportIcon';

//==================================================================================================================
//    DOCUMENT CARD
//==================================================================================================================
export const DocumentCard = memo(({
  id,
  name = 'Doc Name.pdf',
  size = '4.2 MB',
  uploadDate = 'Uploaded on oct 22, 2024',
  onDownload,
  onDelete,
  className = '',
}) => {
  return (
    <div
      className={`w-full flex items-center justify-between p-2.5 px-3 rounded-xl bg-gray/60 transition-colors ${className}`.trim()}
    >
      {/* File Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-white-100 flex items-center justify-center shrink-0 shadow-2xs">
          <Paperclip size={17} className="text-primary" strokeWidth={2} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-black-90 truncate">
            {name}
          </span>
          <span className="text-[11px] text-black-90/50 font-normal">
            {size} • {uploadDate}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onDownload && onDownload(id)}
          className="w-7 h-7 rounded-full bg-white-100 flex items-center justify-center hover:bg-gray/60 transition-colors cursor-pointer shadow-2xs"
          title="Download Document"
        >
          <ImportIcon size={14} color="#2E8EFF" />
        </button>
        <button
          type="button"
          onClick={() => onDelete && onDelete(id)}
          className="w-7 h-7 rounded-full bg-white-100 flex items-center justify-center hover:bg-alert-light transition-colors cursor-pointer shadow-2xs"
          title="Delete Document"
        >
          <X size={15} className="text-alert" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
});

export default DocumentCard;
