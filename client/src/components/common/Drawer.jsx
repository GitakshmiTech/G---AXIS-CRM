//==================================================================================================================
//    REUSABLE DRAWER COMPONENT
//    A universal side-panel component for slide-over forms, inspection drawers, and detail views.
//    Supports title, subtitle, customizable widths, action footers, and slim scrollable bodies.
// ==================================================================================================================
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BackButton } from './buttons/BackButton';

//==================================================================================================================
//    DRAWER
//==================================================================================================================
export const Drawer = ({
  isOpen = true,
  onClose,
  title,
  subtitle,
  description,
  children,
  width = 'sm:w-[560px]',
  widthClass,
  onBack,
  onSave,
  saveText = 'Save Details',
  backText = 'Back',
  formId,
  footer,
  seamlessHeader = true,
  bodyClassName = 'px-6 py-2',
  headerClassName = '',
  subtitleClassName = '',
}) => {
  //==================================================================================================================
  //    Prevent body scroll when drawer is open to avoid background scrolling
  // ==================================================================================================================
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const resolvedSubtitle = subtitle || description;
  const resolvedWidth = widthClass || width || 'sm:w-[560px]';
  const hasDefaultFooter = Boolean(onBack || onSave || formId);

  const drawerContent = (
    <>
      {/*==================================================================================================================
      //    FULL VIEWPORT BLURRED BACKDROP
      //    Renders at body root to blur entire application including sidebar and top bars.
      // ==================================================================================================================*/}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black-90/20 backdrop-blur-[8px] z-[9998] transition-opacity animate-in fade-in duration-300" 
          onClick={onClose} 
          aria-hidden="true"
        />
      )}

      <div 
        className={`fixed top-0 right-0 h-full w-full ${resolvedWidth} bg-white-100 shadow-[0px_8px_30px_rgba(0,0,0,0.12)] z-[9999] transform transition-transform duration-300 flex flex-col border-l border-stroke ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/*==================================================================================================================
            //    Drawer Header
            // ==================================================================================================================*/}
        <div className={`flex ${resolvedSubtitle ? 'items-start' : 'items-center'} justify-between ${headerClassName || 'p-5'} border-b border-stroke flex-shrink-0 bg-white-100 ${seamlessHeader ? 'border-b-0' : ''}`}>
          <div>
            <h2 className="text-[17px] font-bold text-[#101828] tracking-tight">
              {title}
            </h2>
            {resolvedSubtitle && (
              <p className={`text-[12px] text-black-90/50 mt-0.5 font-medium ${subtitleClassName}`}>
                {resolvedSubtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F4F7] hover:bg-[#E4E7EC] flex items-center justify-center text-[#667085] hover:text-[#101828] transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        
        <div className={`flex-1 flex flex-col min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white-100 ${bodyClassName}`}>
          {children}
        </div>

        {/* ================================================================================================================== */}
        {/*    Sticky Action Footer (Custom or Standard < Back / Save Details) */}
        {/* ================================================================================================================== */}
        {footer ? (
          footer
        ) : hasDefaultFooter ? (
          <div className="px-6 py-4 bg-white-100 sticky bottom-0 z-20 flex justify-between items-center shrink-0">
            {onBack ? (
              <BackButton
                onClick={onBack}
                label={backText === '< Back' ? 'Back' : backText}
              />
            ) : (
              <div />
            )}

            {(onSave || formId) && (
              <button
                type={formId ? 'submit' : 'button'}
                form={formId}
                onClick={formId ? undefined : onSave}
                className="bg-primary hover:bg-primary/90 text-white-100 text-xs font-semibold px-6 py-2.5 rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
              >
                {saveText}
              </button>
            )}
          </div>
        ) : null}
      </div>
    </>
  );

  //==================================================================================================================
  //    PORTAL MOUNTING
  //    Render drawer at document root to achieve full window blur including sidebar.
  // ==================================================================================================================
  if (typeof document !== 'undefined') {
    return createPortal(drawerContent, document.body);
  }

  return drawerContent;
};

//==================================================================================================================
//    DEFAULT EXPORT
// ==================================================================================================================
export default Drawer;
