//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, Lucide icons, view action button, and telemetry constants
//==================================================================================================================
import React, { memo } from 'react';
import { ChevronRight } from 'lucide-react';
import { ViewBtn } from '../../../../components/common/buttons/ViewBtn';
import { SALES_BDE_PERFORMANCE_DATA } from '../../../../constants/salesDashboardConstants';

//==================================================================================================================
//    BDE PERFORMANCE TABLE COMPONENT (Image 5)
//    Team performance metrics ranking conversion rates, pipeline and won revenues
//==================================================================================================================
export const BdePerformanceTable = memo(({ data = SALES_BDE_PERFORMANCE_DATA }) => {
  return (
    <div className="bg-white-100 rounded-xl border border-stroke overflow-hidden flex flex-col shadow-2xs">
      {/* ==============================================================================================================
          Table Header Section
      ============================================================================================================== */}
      <div className="p-4 sm:p-5 pb-3 flex justify-between items-center select-none">
        <h3 className="font-bold text-lg text-black-90">
          BDE Performance
        </h3>
        <button
          type="button"
          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-stroke text-xs sm:text-sm font-semibold text-primary hover:bg-gray/60 transition-colors cursor-pointer select-none"
        >
          <span>Team Roaster</span>
          <ChevronRight size={14} className="text-primary flex-shrink-0" />
        </button>
      </div>

      {/* ==============================================================================================================
          Table Data Content
      ============================================================================================================== */}
      <div className="overflow-x-auto w-full px-4 sm:px-5 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <table className="w-full text-left border-collapse min-w-[760px] lg:min-w-0">
          <thead>
            <tr className="bg-gray">
              <th className="py-2.5 px-4 text-xs font-semibold text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                BDE Code
              </th>
              <th className="py-2.5 px-4 text-xs font-semibold text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                Name
              </th>
              <th className="py-2.5 px-4 text-xs font-semibold text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                Leads Handled
              </th>
              <th className="py-2.5 px-4 text-xs font-semibold text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                Conversion Rate
              </th>
              <th className="py-2.5 px-4 text-xs font-semibold text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                Pipeline Value
              </th>
              <th className="py-2.5 px-4 text-xs font-semibold text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                Won Revenue
              </th>
              <th className="py-2.5 px-4 text-xs font-semibold text-black-90 whitespace-nowrap text-center first:rounded-l-lg last:rounded-r-lg">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, idx) => (
              <tr
                key={`${item.id}-${idx}`}
                className="border-b border-stroke/50 last:border-0 hover:bg-gray/30 transition-colors"
              >
                {/* BDE Code */}
                <td className="py-3 px-4 text-sm font-bold text-black-90 whitespace-nowrap">
                  {item.code}
                </td>

                {/* Name & Avatar */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-8 h-8 rounded-full object-cover border border-stroke"
                    />
                    <span className="text-sm font-bold text-black-90">
                      {item.name}
                    </span>
                  </div>
                </td>

                {/* Leads Handled */}
                <td className="py-3 px-4 text-sm font-medium text-black-90 whitespace-nowrap">
                  {item.leadsHandled}
                </td>

                {/* Conversion Rate */}
                <td className="py-3 px-4 text-sm font-medium text-black-90 whitespace-nowrap">
                  {item.conversionRate}
                </td>

                {/* Pipeline Value */}
                <td className="py-3 px-4 text-sm font-bold text-primary whitespace-nowrap">
                  {item.pipelineValue}
                </td>

                {/* Won Revenue */}
                <td className="py-3 px-4 text-sm font-bold text-primary whitespace-nowrap">
                  {item.wonRevenue}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    <ViewBtn
                      onClick={() => console.log('View BDE:', item.name)}
                      title={`View details for ${item.name}`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

BdePerformanceTable.displayName = 'BdePerformanceTable';

export default BdePerformanceTable;
