//==================================================================================================================
//    LEAD SOURCES TABLE VIEWPORT (CRM CONFIGURATION)
//    Data table for managing Lead Sources taxonomies, entry methods, and active states
//==================================================================================================================

import React, { useState, useMemo, useCallback } from 'react';
import {
  Globe,
  Share2,
  ThumbsUp,
  Calendar,
  Mail,
  Phone,
  Users,
  Handshake,
  PenLine,
  Megaphone,
} from 'lucide-react';
import { TableContainer } from '../../../../components/common/TableContainer';
import { DataTableToolbar } from '../../../../components/common/DataTableToolbar';
import { DataTable } from '../../../../components/common/DataTable';
import { Pagination } from '../../../../components/common/Pagination';
import { EditBtn } from '../../../../components/common/buttons/EditBtn';
import { AddLeadSourceDrawer } from './AddLeadSourceDrawer';
import { INITIAL_LEAD_SOURCES } from '../../../../constants/crmConfigurationConstants';

// Helper mapping for Lead Source table row icons
const SOURCE_ICON_MAP = {
  Globe: Globe,
  Share2: Share2,
  ThumbsUp: ThumbsUp,
  Calendar: Calendar,
  Mail: Mail,
  Phone: Phone,
  Users: Users,
  Handshake: Handshake,
  PenLine: PenLine,
  Megaphone: Megaphone,
};

export const LeadSourcesTable = () => {
  const [sources, setSources] = useState(INITIAL_LEAD_SOURCES);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const pageSize = 10;

  // Drawer handlers
  const handleOpenAdd = useCallback(() => {
    setSelectedSource(null);
    setIsDrawerOpen(true);
  }, []);

  const handleOpenEdit = useCallback((source) => {
    setSelectedSource(source);
    setIsDrawerOpen(true);
  }, []);

  const handleSaveSource = useCallback((formData) => {
    if (selectedSource) {
      setSources((prev) =>
        prev.map((item) =>
          item.id === selectedSource.id ? { ...item, ...formData } : item
        )
      );
    } else {
      const newSource = {
        id: `src-${Date.now()}`,
        code: `#${String(sources.length + 1).padStart(3, '0')}`,
        name: formData.name || 'Website',
        icon: 'Globe',
        entryMethod: formData.entryMethod || 'Manual',
        status: formData.status || 'Active',
      };
      setSources((prev) => [newSource, ...prev]);
    }
    setIsDrawerOpen(false);
  }, [selectedSource, sources.length]);

  const handleDeleteSource = useCallback((source) => {
    setSources((prev) => prev.filter((item) => item.id !== source.id));
    setIsDrawerOpen(false);
  }, []);

  const handleExport = useCallback(() => {
    // Standard mock export handler
  }, []);

  // Filtering & Pagination
  const filteredSources = useMemo(() => {
    return sources.filter((item) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.entryMethod.toLowerCase().includes(q)
      );
    });
  }, [sources, searchQuery]);

  const paginatedSources = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSources.slice(start, start + pageSize);
  }, [filteredSources, currentPage, pageSize]);

  // Columns definition
  const columns = useMemo(() => [
    {
      key: 'code',
      label: 'ID',
      sortable: true,
      className: 'w-24',
      render: (row) => (
        <span className="font-semibold text-black-90 text-xs sm:text-sm">
          {row.code}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Lead Source',
      sortable: true,
      className: 'w-full min-w-[200px]',
      render: (row) => {
        const IconComponent = SOURCE_ICON_MAP[row.icon] || Globe;
        return (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#EBF1FD] text-primary flex items-center justify-center shrink-0">
              <IconComponent size={14} />
            </div>
            <span className="font-semibold text-black-90 text-xs sm:text-sm whitespace-nowrap">
              {row.name}
            </span>
          </div>
        );
      },
    },
    {
      key: 'entryMethod',
      label: 'Entry Method',
      sortable: true,
      align: 'center',
      className: 'w-[140px] text-center',
      render: (row) => (
        <div className="flex items-center justify-center">
          <span className="w-[112px] h-[23px] rounded-[4px] px-3 py-1 bg-[#262727]/10 text-black-90 text-xs font-semibold inline-flex items-center justify-center whitespace-nowrap">
            {row.entryMethod}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      align: 'center',
      render: (row) => (
        <div className="flex items-center justify-center">
          <span
            className={`w-[112px] h-[23px] rounded-[4px] text-xs font-semibold whitespace-nowrap inline-flex items-center justify-center select-none ${
              row.status === 'Active'
                ? 'bg-[#019F68]/10 text-success'
                : 'bg-gray text-black-90'
            }`}
          >
            {row.status}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      align: 'center',
      className: 'pr-4 w-20',
      render: (row) => (
        <div className="flex items-center justify-center">
          <EditBtn onClick={() => handleOpenEdit(row)} title="Edit Lead Source" />
        </div>
      ),
    },
  ], [handleOpenEdit]);

  return (
    <div className="flex-1 w-full min-w-0 h-full flex flex-col min-h-0">
      <TableContainer
        toolbar={
          <DataTableToolbar
            searchPlaceholder="Search here..."
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onExport={handleExport}
            actionButton={{
              label: 'Add Lead Source',
              onClick: handleOpenAdd,
            }}
          />
        }
        pagination={
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredSources.length / pageSize) || 1}
            totalEntries={filteredSources.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            className="pt-0 border-t-0"
          />
        }
      >
        <DataTable
          columns={columns}
          data={paginatedSources}
          rowKey="id"
          emptyMessage="No lead sources configured."
        />
      </TableContainer>

      <AddLeadSourceDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveSource}
        onDelete={handleDeleteSource}
        initialData={selectedSource}
      />
    </div>
  );
};

export default LeadSourcesTable;
