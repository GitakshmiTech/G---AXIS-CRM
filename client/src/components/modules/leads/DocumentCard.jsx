//==================================================================================================================
//    DOCUMENT CARD COMPONENT
//    Standard reusable document card using lucide-react icons with project common design tokens
//==================================================================================================================
import React, { memo } from 'react';
import { Download, Eye, Paperclip, X } from 'lucide-react';

//==================================================================================================================
//    DOCUMENT CARD
//==================================================================================================================
export const DocumentCard = memo(({
  id,
  name = 'Document',
  size = '',
  uploadDate = '',
  onDownload,
  onView,
  onDelete,
  deleteTitle = 'Remove Document',
  className = '',
}) => {
  return (
    <div
      className={`w-full flex items-center justify-between p-2.5 px-3 rounded-xl bg-gray/60 transition-colors ${className}`.trim()}
    >
      {/* File Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-white-100 flex items-center justify-center shrink-0 ">
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
        {id && onView && (
          <button
            type="button"
            onClick={() => onView(id)}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[7px] border-b-2 border-stroke/80 bg-gray transition-colors hover:bg-gray/80"
            title="View Document"
            aria-label={`View ${name}`}
          >
            <Eye size={14} className="text-primary" />
          </button>
        )}
        {id && onDownload && <button
          type="button"
          onClick={() => onDownload && onDownload(id)}
          className="w-7 h-7 rounded-[7px] bg-gray border-b-2 border-stroke/80 flex items-center justify-center hover:bg-gray/80 transition-colors cursor-pointer "
          title="Download Document"
          aria-label={`Download ${name}`}
        >
          <Download size={14} className="text-primary" />
        </button>}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="w-7 h-7 rounded-[7px] bg-gray border-b-2 border-stroke/80 flex items-center justify-center hover:bg-alert-light transition-colors cursor-pointer "
            title={deleteTitle}
            aria-label={`${deleteTitle}: ${name}`}
          >
            <X size={15} className="text-alert" strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
});

export default DocumentCard;
