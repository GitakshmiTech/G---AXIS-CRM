//==================================================================================================================
//    LEAD COMMENTS DRAWER COMPONENT (ADMIN PANEL)
//    Slide-over drawer for team conversation, threaded notes, and activity comments on leads
//==================================================================================================================

import React, { useState, useEffect, memo } from 'react';
import { Drawer } from '../../common/sidebar/Drawer';

export const LeadCommentsDrawer = memo(({
  isOpen = false,
  onClose,
  initialComments = [],
  isLoading = false,
  loadError = '',
  onAddComment,
}) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) setComments(initialComments);
  }, [initialComments, isOpen]);

  const handleAddComment = async (e) => {
    if (e) e.preventDefault();
    if (!newComment.trim()) return;
    setIsSaving(true);
    setError('');
    try {
      const savedComment = await onAddComment(newComment.trim());
      setComments((prev) => [...prev, savedComment]);
      setNewComment('');
    } catch (saveError) {
      setError(saveError.message || 'Unable to save comment.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    //==================================================================================================================
    //    DRAWER CONTAINER
    //==================================================================================================================
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Lead Comments"
      subtitle="Create and qualify a new enterprise prospect. Real-time deduplication verification is active across customer records."
      width="w-full sm:w-[560px]"
      bodyClassName="px-6 py-2"
      footer={
        <form
          onSubmit={handleAddComment}
          className="px-3 sm:px-6 py-2.5 sm:py-3.5 bg-white-100 sticky bottom-0 z-20 flex items-center gap-2 sm:gap-3 shrink-0"
        >
          <input
            type="text"
            placeholder="Add comment here"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSaving || isLoading}
            className="flex-1 min-w-0 h-[34px] sm:h-[36px] px-3 sm:px-3.5 bg-gray border-b-2 border-stroke/80 rounded-[7px] text-xs text-black-90 placeholder:text-black-90/40 font-normal focus:outline-none transition-all"
          />
          <button
            type="submit"
            disabled={isSaving || isLoading || !newComment.trim()}
            className="px-4 sm:px-5 h-[34px] sm:h-[36px] bg-primary hover:bg-primary/90 disabled:opacity-50 text-white-100 text-xs font-semibold rounded-[7px] border-b-2 border-black-90/20 shrink-0 transition-colors cursor-pointer flex items-center justify-center"
          >
            {isSaving ? 'Saving…' : 'Submit'}
          </button>
        </form>
      }
    >
      <div className="flex flex-col gap-4">
        {error && <p className="text-xs text-alert" role="alert">{error}</p>}
        {loadError && <p className="text-xs text-alert" role="alert">{loadError}</p>}
        {isLoading && <p className="py-8 text-center text-xs text-black-90/60" role="status">Loading comments…</p>}
        {!isLoading && comments.length === 0 && <p className="py-8 text-center text-xs text-black-90/60">No comments yet. Add the first comment below.</p>}
        {comments.map((item) => (
          <div key={item.id} className="flex flex-col gap-1">
            <div className="flex items-start gap-3">
              {/* Comment Bubble */}
              <div className="flex-1 bg-gray border-b-2 border-stroke/80 rounded-[7px] p-3.5 text-xs text-black-90 leading-relaxed">
                {item.text}
              </div>

              {/* Author Avatar */}
              {item.avatar ? <img src={item.avatar} alt="Commenter" className="w-9 h-9 rounded-full object-cover border-none shrink-0" /> :
                <div title="Lead note" aria-label="Lead note" className="w-9 h-9 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">N</div>}
            </div>

            {/* Comment Timestamp */}
            <span className="text-[11px] text-black-90/80/70 pr-12 text-right font-medium">
              {item.timestamp}
            </span>
          </div>
        ))}
      </div>
    </Drawer>
  );
});

LeadCommentsDrawer.displayName = 'LeadCommentsDrawer';
export default LeadCommentsDrawer;
