//==================================================================================================================
//    LOST REASON AND ACTIVITY MODALITY TABLE
//    Feature-level table view using the existing shared CRM table components
// ==================================================================================================================

import React, { memo, useCallback, useMemo, useState } from 'react';
import { CircleX, Clock, Mail, NotebookText, Phone, Video, CircleCheck } from 'lucide-react';
import { TableContainer } from '../../../../components/common/TableContainer';
import { DataTableToolbar } from '../../../../components/common/DataTableToolbar';
import { DataTable } from '../../../../components/common/DataTable';
import { Pagination } from '../../../../components/common/Pagination';
import { EditBtn } from '../../../../components/common/buttons/EditBtn';
import { ConfigurationReasonDrawer } from './ConfigurationReasonDrawer';

const ACTIVITY_ICONS = { Phone, Mail, Video, CircleCheck, Clock, NotebookText };

export const ConfigurationReasonTable = memo(({ config }) => {
  const [items, setItems] = useState(config.initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const pageSize = 10;

  const handleOpenAdd = useCallback(() => { setSelectedItem(null); setIsDrawerOpen(true); }, []);
  const handleOpenEdit = useCallback((item) => { setSelectedItem(item); setIsDrawerOpen(true); }, []);
  const handleSave = useCallback((formData) => {
    setItems((previous) => selectedItem
      ? previous.map((item) => item.id === selectedItem.id ? { ...item, ...formData } : item)
      : [{ ...formData, id: `${config.idPrefix}-${Date.now()}` }, ...previous]);
    setIsDrawerOpen(false);
  }, [config.idPrefix, selectedItem]);
  const handleDelete = useCallback((item) => {
    setItems((previous) => previous.filter((entry) => entry.id !== item.id));
    setIsDrawerOpen(false);
  }, []);
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return items.filter((item) => !query || [item.code, item.name, item[config.relatedKey], item.status].some((value) => String(value || '').toLowerCase().includes(query)));
  }, [config.relatedKey, items, searchQuery]);
  const visibleItems = useMemo(() => filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize), [currentPage, filteredItems]);

  const columns = useMemo(() => [
    { key: 'code', label: 'ID', sortable: true, className: 'w-16', render: (row) => <span className="font-semibold text-black-90 text-xs">{row.code}</span> },
    {
      key: 'name', label: config.nameLabel, sortable: true, className: 'min-w-[190px]',
      render: (row) => {
        const Icon = config.showActivityIcon ? ACTIVITY_ICONS[row.icon] || CircleX : CircleX;
        return <div className="flex items-center gap-2.5"><span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${config.showActivityIcon ? 'bg-[#EBF1FD] text-primary border-stroke' : 'bg-gray text-danger border-stroke'}`}><Icon size={14} /></span><span className="font-semibold text-black-90 text-xs whitespace-nowrap">{row.name}</span></div>;
      },
    },
    { key: config.relatedKey, label: config.relatedLabel, sortable: true, className: 'min-w-[220px]', render: (row) => <span className="text-black-90 text-xs whitespace-nowrap">{row[config.relatedKey]}</span> },
    { key: 'status', label: 'Status', sortable: true, align: 'center', className: 'w-[120px]', render: (row) => <span className={`w-[92px] h-[23px] rounded-[4px] text-xs font-semibold inline-flex items-center justify-center ${row.status === 'Active' ? 'bg-success/10 text-success' : 'bg-gray text-black-90'}`}>{row.status}</span> },
    { key: 'actions', label: 'Action', align: 'center', className: 'w-16', render: (row) => <div className="flex justify-center"><EditBtn onClick={() => handleOpenEdit(row)} title={`Edit ${config.title}`} /></div> },
  ], [config, handleOpenEdit]);

  return (
    <div className="flex-1 w-full min-w-0 h-full flex flex-col min-h-0">
      <TableContainer
        toolbar={<DataTableToolbar searchPlaceholder="Search here..." searchQuery={searchQuery} onSearchChange={(value) => { setSearchQuery(value); setCurrentPage(1); }} viewMode={viewMode} onViewModeChange={setViewMode} onExport={() => {}} actionButton={{ label: config.addLabel, onClick: handleOpenAdd }} />}
        pagination={<Pagination currentPage={currentPage} totalEntries={filteredItems.length} pageSize={pageSize} onPageChange={setCurrentPage} className="pt-0 border-t-0" />}
      >
        <DataTable columns={columns} data={visibleItems} rowKey="id" emptyMessage={`No ${config.title.toLowerCase()} configured.`} />
      </TableContainer>
      <ConfigurationReasonDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} onSave={handleSave} onDelete={handleDelete} initialData={selectedItem} config={config} />
    </div>
  );
});

ConfigurationReasonTable.displayName = 'ConfigurationReasonTable';
