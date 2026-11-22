//==================================================================================================================
//    LEAD ACTIVITY DRAWER COMPONENT (ADMIN PANEL)
//    Slide-over drawer displaying timeline activities using reusable ActivityCard components
//==================================================================================================================

import React, { memo } from 'react';
import { Drawer } from '../../common/sidebar/Drawer';
import { ActivityCard } from './ActivityCard';
import { BackButton } from '../../common/buttons/BackButton';
import { MOCK_ACTIVITIES } from '../../../constants/leadsConstants';

export const LeadActivityDrawer = memo(({
  isOpen = false,
  onClose,
  activities = MOCK_ACTIVITIES,
}) => {
  return (
    //==================================================================================================================
    //    DRAWER CONTAINER
    //==================================================================================================================
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Lead Activity"
      subtitle="Create and qualify a new enterprise prospect. Real-time deduplication verification is active across customer records."
      width="w-full sm:w-[560px]"
      bodyClassName="px-6 py-2"
      footer={
        <div className="px-6 py-2.5 sm:py-3 bg-white-100 sticky bottom-0 z-20 flex justify-end items-center shrink-0 w-full">
          <BackButton onClick={onClose} label="Back" />
        </div>
      }
    >
      <div className="flex flex-col gap-3.5">
        {activities.length === 0 && <p className="py-8 text-center text-xs text-black-90/60">No activity recorded for this lead.</p>}
        {activities.map((item) => (
          <ActivityCard
            key={item.id}
            title={item.title}
            fromStage={item.fromStage}
            toStage={item.toStage}
            description={item.description}
            timestamp={item.timestamp}
          />
        ))}
      </div>
    </Drawer>
  );
});

LeadActivityDrawer.displayName = 'LeadActivityDrawer';
export default LeadActivityDrawer;
