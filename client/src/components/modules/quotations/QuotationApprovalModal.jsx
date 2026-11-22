//===========================================================================================
//    QUOTATION APPROVAL & REJECTION MODAL
//    Allows Sales Managers and Admins to approve with an optional note or reject with a reason.
//    Adheres to Strict Flat Design (No shadows, 7px radius, 2px bottom border).
// ===========================================================================================
import React, { memo, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export const QuotationApprovalModal = memo(({
  isOpen,
  type = 'approve', // 'approve' | 'reject'
  quotation,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const [noteOrReason, setNoteOrReason] = useState('');
  const [error, setError] = useState('');

  const isApprove = type === 'approve';

  // Reset input when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setNoteOrReason('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!isApprove && !noteOrReason.trim()) {
      setError('Please provide a reason for rejecting this quotation.');
      return;
    }
    setError('');
    try {
      if (isApprove) {
        await onConfirm({ note: noteOrReason.trim() });
      } else {
        await onConfirm({ reason: noteOrReason.trim() });
      }
    } catch (err) {
      setError(err.message || 'Operation failed. Please try again.');
    }
  }, [isApprove, noteOrReason, onConfirm]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] rounded-[7px] border-b-2 border-stroke/80 bg-white-100 p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-stroke/50 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-[7px] flex items-center justify-center shrink-0 ${
              isApprove ? 'bg-success/10 text-success' : 'bg-alert/10 text-alert'
            }`}>
              {isApprove ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            </div>
            <div>
              <h3 className="text-base font-bold text-black-90">
                {isApprove ? 'Approve Quotation' : 'Reject Quotation'}
              </h3>
              <p className="text-xs text-black-90/55 font-medium">
                {quotation?.code || 'Quotation'} · {quotation?.dealName || 'Commercial Proposal'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close dialog"
            className="cursor-pointer rounded-[7px] p-1 text-black-90/50 hover:bg-gray transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content & Details */}
        <div className="flex flex-col gap-3 text-xs">
          <div className="grid grid-cols-2 gap-2 bg-gray p-3 rounded-[7px] border-b-2 border-stroke/80">
            <div>
              <span className="text-black-90/50 block">Quote Value</span>
              <strong className="text-black-90 text-sm font-bold">{quotation?.expectedValue || '—'}</strong>
            </div>
            <div>
              <span className="text-black-90/50 block">Account</span>
              <strong className="text-black-90 text-xs font-semibold truncate block" title={quotation?.accountName}>
                {quotation?.accountName || '—'}
              </strong>
            </div>
          </div>

          <p className="text-black-90/70 font-medium leading-relaxed">
            {isApprove
              ? 'Approving will confirm the commercial terms, pricing, and discount. The BDE will be notified and can send it to the customer.'
              : 'Please enter a reason for rejection. This feedback will be sent to the BDE so they can revise the proposal.'}
          </p>

          {/* Error Message */}
          {error && (
            <div className="p-2.5 rounded-[7px] border-b-2 border-alert/30 bg-alert/10 text-alert text-xs font-medium">
              {error}
            </div>
          )}

          {/* Reason / Note Textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-black-90 text-xs">
              {isApprove ? 'Manager Approval Note (Optional)' : 'Rejection Reason (Required)'}
            </label>
            <textarea
              rows={3}
              value={noteOrReason}
              onChange={(e) => {
                setNoteOrReason(e.target.value);
                setError('');
              }}
              placeholder={isApprove ? 'e.g. Approved with negotiated payment schedule.' : 'e.g. Discount too high, reduce discount to max 10%.'}
              className="w-full p-3 bg-gray border-b-2 border-stroke/80 rounded-[7px] text-xs text-black-90 placeholder:text-black-90/40 focus:outline-none transition-all resize-none"
              required={!isApprove}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 border-t border-stroke/50 pt-3.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer rounded-[7px] border-b-2 border-stroke/80 bg-gray px-4 py-2 text-xs font-semibold text-black-90 hover:bg-gray/80 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`cursor-pointer rounded-[7px] border-b-2 border-black-90/20 px-5 py-2 text-xs font-semibold text-white-100 transition-colors disabled:opacity-50 flex items-center gap-1.5 ${
              isApprove
                ? 'bg-success hover:bg-success/90'
                : 'bg-alert hover:bg-alert/90'
            }`}
          >
            {loading ? 'Processing…' : isApprove ? 'Approve Proposal' : 'Confirm Rejection'}
          </button>
        </div>
      </div>
    </div>
  );
});

QuotationApprovalModal.displayName = 'QuotationApprovalModal';
export default QuotationApprovalModal;
