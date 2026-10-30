//==================================================================================================================
//    LEAD COMMENTS DRAWER COMPONENT
//    Slide-over drawer for team conversation, threaded notes, and activity comments on leads
//==================================================================================================================

import React, { useState, memo } from 'react';
import { Drawer } from '../../../components/common/Drawer';
import { Button } from '../../../components/common/buttons/Button';
import { MOCK_COMMENTS } from '../../../constants/leadsConstants';

export const LeadCommentsDrawer = memo(({
  isOpen = false,
  onClose,
  initialComments = MOCK_COMMENTS,
}) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = (e) => {
    if (e) e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj = {
      id: `com-${Date.now()}`,
      text: newComment.trim(),
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    };

    setComments((prev) => [...prev, commentObj]);
    setNewComment('');
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
      bodyClassName="px-6 py-5"
      footer={
        <form
          onSubmit={handleAddComment}
          className="px-3 sm:px-6 py-2.5 sm:py-3.5 bg-white-100 border-t border-stroke sticky bottom-0 z-20 flex items-center gap-2 sm:gap-3 shrink-0"
        >
          <input
            type="text"
            placeholder="Add comment here"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 min-w-0 h-[38px] sm:h-[40px] px-3 sm:px-3.5 bg-[#F8F9FC] border border-[#D0D5DD] rounded-lg text-xs text-black-90 placeholder:text-[#475467] font-normal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
          <button
            type="submit"
            className="px-4 sm:px-5 h-[38px] sm:h-[40px] bg-primary hover:bg-primary/90 text-white-100 text-xs font-semibold rounded-lg shrink-0 transition-colors cursor-pointer flex items-center justify-center"
          >
            Submit
          </button>
        </form>
      }
    >
      <div className="flex flex-col gap-4">
        {comments.map((item) => (
          <div key={item.id} className="flex flex-col gap-1">
            <div className="flex items-start gap-3">
              {/* Comment Bubble */}
              <div className="flex-1 bg-[#F2F4F7] border border-[#E4E7EC] rounded-2xl p-3.5 text-xs text-[#344054] leading-relaxed shadow-2xs">
                {item.text}
              </div>

              {/* Author Avatar */}
              <img
                src={item.avatar}
                alt="Commenter"
                className="w-9 h-9 rounded-full object-cover shrink-0 border border-stroke"
              />
            </div>

            {/* Comment Timestamp */}
            <span className="text-[11px] text-[#475467]/70 pr-12 text-right font-medium">
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
