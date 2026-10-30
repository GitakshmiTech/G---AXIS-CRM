//==================================================================================================================
//    CRM CONFIGURATION PAGE COMPONENT (SUPER ADMIN WORKSPACE)
//    Taxonomies, classifications, left sub-navigation sidebar, and modular category views
//==================================================================================================================

import React, { useState, useMemo } from 'react';
import { CrmConfigSidebar } from './components/CrmConfigSidebar';
import { LeadSourcesTable } from './leadSources/LeadSourcesTable';
import { LeadStatusesTable } from './leadStatuses/LeadStatusesTable';
import { DealStagesTable } from './dealStages/DealStagesTable';
import { IndustryTierTable } from './industryTier/IndustryTierTable';
import { LostReasonsTable } from './lostReasons/LostReasonsTable';
import { ActivityModalitiesTable } from './activityModalities/ActivityModalitiesTable';

export const CrmConfiguration = () => {
  const [activeCategory, setActiveCategory] = useState('lead-sources');

  // Dynamically select the active taxonomy table component
  const ActiveComponent = useMemo(() => {
    switch (activeCategory) {
      case 'lead-sources':
        return LeadSourcesTable;
      case 'lead-statuses':
        return LeadStatusesTable;
      case 'deal-stages':
        return DealStagesTable;
      case 'industry-tier':
        return IndustryTierTable;
      case 'lost-reasons':
        return LostReasonsTable;
      case 'activity-modalities':
        return ActivityModalitiesTable;
      default:
        return LeadSourcesTable;
    }
  }, [activeCategory]);

  return (
    //==================================================================================================================
    //    MAIN CRM CONFIGURATION LAYOUT
    //==================================================================================================================
    <div className="flex flex-col lg:flex-row gap-5 w-full flex-1 min-h-0 h-full select-text">
      {/* Sub-Navigation Sidebar */}
      <CrmConfigSidebar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Dynamic Content Viewport for Selected Category */}
      <ActiveComponent />
    </div>
  );
};

export default CrmConfiguration;
