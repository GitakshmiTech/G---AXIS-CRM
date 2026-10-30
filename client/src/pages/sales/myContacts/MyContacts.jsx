//==================================================================================================================
//    MY CONTACTS PAGE COMPONENT (SALES WORKSPACE)
//    Stakeholders & contact directory workspace module featuring direct communication, deals count & drawer actions
//==================================================================================================================

import React, { useState, useMemo, useCallback } from 'react';
import { Mail } from 'lucide-react';
import whatsappIcon from '../../../assets/icons/Group.png';
import { TableContainer } from '../../../components/common/TableContainer';
import { DataTableToolbar } from '../../../components/common/DataTableToolbar';
import { DataTable } from '../../../components/common/DataTable';
import { Pagination } from '../../../components/common/Pagination';
import { ViewBtn } from '../../../components/common/buttons/ViewBtn';
import { EditBtn } from '../../../components/common/buttons/EditBtn';
import { EditContactDrawer } from './EditContactDrawer';
import { INITIAL_CONTACTS_DATA } from '../../../constants/contactsConstants';

//==================================================================================================================
//    MY CONTACTS COMPONENT
//==================================================================================================================
export const MyContacts = () => {
  const [contacts, setContacts] = useState(INITIAL_CONTACTS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Drawer state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  //==================================================================================================================
  //    DRAWER TRIGGER HANDLERS
  //==================================================================================================================
  const handleOpenEdit = useCallback((contact) => {
    setSelectedContact(contact);
    setIsEditOpen(true);
  }, []);

  const handleOpenView = useCallback((contact) => {
    setSelectedContact(contact);
    setIsEditOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsEditOpen(false);
    setSelectedContact(null);
  }, []);

  const handleSaveContact = useCallback((updatedData) => {
    if (selectedContact) {
      setContacts((prev) =>
        prev.map((c) => (c.id === selectedContact.id ? { ...c, ...updatedData } : c))
      );
    }
    handleCloseDrawer();
  }, [selectedContact, handleCloseDrawer]);

  //==================================================================================================================
  //    FILTERING LOGIC (OPTIMIZED WITH USEMEMO)
  //==================================================================================================================
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      return (
        !searchQuery.trim() ||
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [contacts, searchQuery]);

  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredContacts.slice(start, start + pageSize);
  }, [filteredContacts, currentPage, pageSize]);

  //==================================================================================================================
  //    TABLE COLUMNS DEFINITION
  //==================================================================================================================
  const columns = useMemo(() => [
    {
      key: 'code',
      label: 'Code',
      className: 'w-20 pl-4',
      render: (row) => (
        <span className="font-semibold text-black-90">{row.code}</span>
      ),
    },
    {
      key: 'name',
      label: 'Contact Name',
      className: 'max-sm:min-w-[170px] max-sm:pr-4',
      headerClassName: 'max-sm:min-w-[170px] max-sm:pr-4',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.avatar}
            alt={row.name}
            className="w-8 h-8 rounded-full object-cover border border-stroke shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-black-90 whitespace-nowrap">
              {row.name}
            </span>
            <span className="text-[11px] text-black-90/50 font-normal truncate">
              {row.designation}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'companyName',
      label: 'Client Name',
      className: 'max-sm:min-w-[170px] max-sm:pr-4',
      headerClassName: 'max-sm:min-w-[170px] max-sm:pr-4',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.companyLogo}
            alt={row.companyName}
            className="w-7 h-7 rounded-full object-cover border border-stroke shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-black-90 whitespace-nowrap">
              {row.companyName}
            </span>
            <span className="text-[11px] text-black-90/50 font-normal truncate">
              {row.website}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'activeDeals',
      label: 'Active Deals',
      className: 'max-sm:min-w-[110px] max-sm:pr-3',
      headerClassName: 'max-sm:min-w-[110px] max-sm:pr-3',
      render: (row) => (
        <span className="font-semibold text-black-90">
          {row.activeDeals}
        </span>
      ),
    },
    {
      key: 'quickContact',
      label: 'Quick Contact',
      align: 'center',
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <a
            href={`https://wa.me/${row.phone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 rounded-full bg-gray flex items-center justify-center hover:bg-gray/80 transition-colors cursor-pointer shrink-0"
            title="Chat on WhatsApp"
          >
            <img src={whatsappIcon} alt="WhatsApp" className="w-4 h-4 object-contain" />
          </a>
          <a
            href={`mailto:${row.email}`}
            className="w-8 h-8 rounded-full bg-[#F3F5FA] flex items-center justify-center text-primary hover:bg-gray transition-colors cursor-pointer shrink-0"
            title="Send Email"
          >
            <Mail size={16} strokeWidth={2} />
          </a>
        </div>
      ),
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col text-[11px] leading-tight">
          <span className="font-medium text-black-90">{row.createdDate}</span>
          <span className="text-black-90/50 mt-0.5">{row.createdTime}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      align: 'center',
      className: 'pr-4',
      render: (row) => (
        <div className="flex items-center justify-center gap-1.5">
          <ViewBtn onClick={() => handleOpenView(row)} title="View Contact Details" />
          <EditBtn onClick={() => handleOpenEdit(row)} title="Edit Contact" />
        </div>
      ),
    },
  ], [handleOpenView, handleOpenEdit]);

  //==================================================================================================================
  //    RENDER MAIN COMPONENT
  //==================================================================================================================
  return (
    <div className="w-full flex-1 flex flex-col min-h-0 select-text">
      <TableContainer
        toolbar={
          <DataTableToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search here..."
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onExport={() => alert('Exporting Contacts Data...')}
          />
        }
        pagination={
          <Pagination
            currentPage={currentPage}
            totalEntries={180}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            className="pt-0 border-t-0"
          />
        }
      >
        <DataTable
          columns={columns}
          data={paginatedContacts}
          rowKey="id"
          emptyMessage="No contacts found matching the current search criteria."
        />
      </TableContainer>

      {/* Slide-over Edit Contact Details Drawer (Image 5) */}
      <EditContactDrawer
        isOpen={isEditOpen}
        onClose={handleCloseDrawer}
        onSave={handleSaveContact}
        initialData={selectedContact}
      />
    </div>
  );
};

export default MyContacts;
