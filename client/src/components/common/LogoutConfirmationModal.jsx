//==================================================================================================================
//    LOGOUT CONFIRMATION MODAL
//    A common popup for confirming user logout across both admin and client panels.
//==================================================================================================================
import React from 'react';
import { LogOut } from 'lucide-react';

export const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white-100 w-full max-w-[420px] rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center mx-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logout Icon Graphic */}
        <div className="w-[84px] h-[84px] rounded-full bg-alert/5 border border-alert/30 flex items-center justify-center mb-6 shrink-0 shadow-[0_0_0_6px_rgba(225,71,89,0.03)]">
          <LogOut size={36} strokeWidth={1.5} className="text-alert ml-1" />
        </div>
        
        {/* Texts */}
        <h2 className="text-xl sm:text-[22px] font-bold text-black-90 mb-3 tracking-tight">
          Are you sure you want to log out?
        </h2>
        
        <p className="text-[13px] text-black-90/60 font-medium mb-8 leading-snug">
          You will be securely logged out of your account.<br/>
          You can always log back in anytime.
        </p>
        
        {/* Action Buttons */}
        <div className="flex w-full items-center justify-center gap-4 px-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 max-w-[140px] px-4 py-2.5 rounded-[8px] border border-stroke text-[13px] font-bold text-black-90 hover:bg-gray/50 transition-colors shadow-2xs cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 max-w-[140px] px-4 py-2.5 rounded-[8px] bg-alert text-white-100 text-[13px] font-bold hover:bg-alert/90 transition-colors shadow-sm shadow-alert/20 cursor-pointer"
          >
            Yes, log out
          </button>
        </div>
      </div>
    </div>
  );
};
