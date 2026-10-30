//==================================================================================================================
//    CRM CONFIGURATION SUB-NAVIGATION SIDEBAR
//    Standardized category selector for CRM taxonomies, classifications, and parameters
//==================================================================================================================

import React, { memo } from 'react';
import {
  Filter,
  Info,
  CircleDollarSign,
  Factory,
  XCircle,
  Clock,
  CirclePercent,
  HandCoins,
} from 'lucide-react';
import { CONFIGURATION_CATEGORIES } from '../../../../constants/crmConfigurationConstants';

// Helper mapping for Lucide category icons
const CATEGORY_ICON_MAP = {
  Filter: Filter,
  Info: Info,
  CircleDollarSign: CircleDollarSign,
  Factory: Factory,
  XCircle: XCircle,
  Clock: Clock,
  CirclePercent: CirclePercent,
  HandCoins: HandCoins,
};

export const CrmConfigSidebar = memo(({ activeCategory, onSelectCategory }) => {
  return (
    <div className="w-full lg:w-[220px] bg-white-100 rounded-xl border border-stroke p-3 sm:p-3.5 shadow-2xs shrink-0 flex flex-col gap-1 self-start">
      {CONFIGURATION_CATEGORIES.map((cat) => {
        const IconComp = CATEGORY_ICON_MAP[cat.icon] || Filter;
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
              isActive
                ? 'bg-[#F0F4FE] text-primary font-bold'
                : 'text-black-90/70 hover:bg-gray hover:text-black-90 font-medium'
            }`}
          >
            <IconComp
              size={16}
              className={isActive ? 'text-primary' : 'text-black-90/50'}
            />
            <span className="truncate">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
});

CrmConfigSidebar.displayName = 'CrmConfigSidebar';
export default CrmConfigSidebar;
