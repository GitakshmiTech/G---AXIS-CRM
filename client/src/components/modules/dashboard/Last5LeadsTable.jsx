//==================================================================================================================
//    LAST 5 LEADS TABLE SUBCOMPONENT
//    Directly implemented for BDE dashboard showing recent leads with quick communication actions
//==================================================================================================================
import React, { memo } from 'react';
import { ChevronDown, ChevronRight, Mail } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { ViewBtn } from '../../common/buttons/ViewBtn';
import { EditBtn } from '../../common/buttons/EditBtn';
import { BDE_LAST_5_LEADS_DATA } from '../../../constants/bdeDashboardConstants';

export const Last5LeadsTable = memo(() => {
  return (
    <div className="bg-white-100 rounded-xl border-b-2 border-stroke/80 overflow-hidden flex flex-col ">
      {/* Table Header Section */}
      <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 flex justify-between items-center">
        <h3 className="font-bold text-base sm:text-lg text-black-90">Last 5 Leads</h3>
        <button
          type="button"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[7px] border-b-2 border-stroke/80 bg-gray text-xs sm:text-sm font-semibold text-primary hover:bg-gray/80 transition-colors cursor-pointer"
        >
          <span>View All Leads</span>
          <ChevronRight size={14} className="text-primary flex-shrink-0" />
        </button>
      </div>

      {/* Table Data Rows */}
      <div className="overflow-x-auto w-full px-3 sm:px-4 pb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-0">
          <thead>
            <tr className="bg-gray">
              <th className="py-2 px-3 text-xs font-medium text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                Code
              </th>
              <th className="py-2 px-3 text-xs font-medium text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                Lead Name
              </th>
              <th className="py-2 px-3 text-xs font-medium text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                Company Name
              </th>
              <th className="py-2 px-3 text-xs font-medium text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                Stage
              </th>
              <th className="py-2 px-3 text-xs font-medium text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                Priority
              </th>
              <th className="py-2 px-3 text-xs font-medium text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                Quick Contact
              </th>
              <th className="py-2 px-3 text-xs font-medium text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                <div className="inline-flex items-center gap-1">
                  <span>Created Date</span>
                  <ChevronDown size={13} className="text-primary flex-shrink-0" />
                </div>
              </th>
              <th className="py-2 px-3 text-xs font-medium text-black-90 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {BDE_LAST_5_LEADS_DATA.map((lead, idx) => (
              <tr
                key={`${lead.id}-${idx}`}
                className="border-b border-stroke/60 last:border-0 hover:bg-gray/20 transition-colors"
              >
                {/* Code */}
                <td className="py-2 px-3 text-xs sm:text-sm font-bold text-black-90 whitespace-nowrap">
                  {lead.code}
                </td>

                {/* Lead Name */}
                <td className="py-2 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={lead.leadAvatar}
                      alt={lead.leadName}
                      className="w-7 h-7 rounded-full object-cover border-none flex-shrink-0"
                    />
                    <span className="text-xs sm:text-sm font-bold text-black-90">
                      {lead.leadName}
                    </span>
                  </div>
                </td>

                {/* Company Name */}
                <td className="py-2 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={lead.companyLogo}
                      alt={lead.companyName}
                      className="w-7 h-7 rounded-full object-cover border-none flex-shrink-0"
                    />
                    <span className="text-xs sm:text-sm font-bold text-black-90">
                      {lead.companyName}
                    </span>
                  </div>
                </td>

                {/* Stage */}
                <td className="py-2 px-3 whitespace-nowrap">
                  <span className="inline-flex items-center justify-center w-[100px] h-[22px] px-2.5 py-0.5 rounded-[7px] text-xs font-semibold bg-gray text-black-90">
                    {lead.stage}
                  </span>
                </td>

                {/* Priority */}
                <td className="py-2 px-3 whitespace-nowrap">
                  <span className="inline-flex items-center justify-center w-[100px] h-[22px] px-2.5 py-0.5 rounded-[7px] text-xs font-semibold bg-warning/15 text-warning">
                    {lead.priority}
                  </span>
                </td>

                {/* Quick Contact */}
                <td className="py-2 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      title="WhatsApp Contact"
                      aria-label="WhatsApp Contact"
                      className="w-7 h-7 rounded-[7px] bg-gray border-b-2 border-stroke/80 flex items-center justify-center hover:bg-gray/80 transition-colors cursor-pointer shrink-0"
                    >
                      <FaWhatsapp size={15} className="text-[#25D366]" />
                    </button>
                    <button
                      type="button"
                      title="Email Contact"
                      aria-label="Email Contact"
                      className="w-7 h-7 rounded-[7px] bg-gray border-b-2 border-stroke/80 text-primary flex items-center justify-center hover:bg-gray/80 transition-colors cursor-pointer shrink-0"
                    >
                      <Mail size={14} strokeWidth={2} />
                    </button>
                  </div>
                </td>

                {/* Created Date */}
                <td className="py-2 px-3 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-semibold text-black-90">
                      {lead.createdDate}
                    </span>
                    <span className="text-[11px] font-medium text-black-90/60 mt-0.5">
                      {lead.createdTime}
                    </span>
                  </div>
                </td>

                {/* Action */}
                <td className="py-2 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <ViewBtn title="View Lead Details" />
                    <EditBtn title="Edit Lead" />
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

export default Last5LeadsTable;
