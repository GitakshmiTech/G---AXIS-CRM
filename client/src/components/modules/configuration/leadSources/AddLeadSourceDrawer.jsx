//==================================================================================================================
//    ADD / EDIT LEAD SOURCE DRAWER (ADMIN CRM CONFIGURATION)
//    Slide-over drawer for configuring lead taxonomy parameters, entry methods, and lifecycle state (Image 5)
//==================================================================================================================

import React, { useState, useEffect, memo, useCallback } from 'react';
import { Drawer } from '../../../common/sidebar/Drawer';
import { DropdownInput } from '../../../common/inputs/DropdownInput';
import { IdInput } from '../../../common/inputs/IdInput';
import { StatusRadioInput } from '../../../common/inputs/StatusRadioInput';
import { BackButton } from '../../../common/buttons/BackButton';
import { DeleteButton } from '../../../common/buttons/DeleteButton';
import {
  LEAD_SOURCE_NAME_OPTIONS,
  ENTRY_METHOD_OPTIONS,
} from '../../../../constants/crmConfigurationConstants';

export const AddLeadSourceDrawer = memo(({
  isOpen = false,
  onClose,
  onSave,
  onDelete,
  initialData = null,
}) => {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState({
    code: '#001',
    name: '',
    entryMethod: '',
    status: 'Active',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || '#001',
        name: initialData.name || '',
        entryMethod: initialData.entryMethod || '',
        status: initialData.status || 'Active',
      });
    } else {
      setFormData({
        code: '#001',
        name: '',
        entryMethod: '',
        status: 'Active',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleDropdownChange = useCallback((name, val) => {
    setFormData((prev) => ({ ...prev, [name]: val }));
  }, []);

  const handleSubmit = useCallback((e) => {
    if (e) e.preventDefault();
    if (onSave) onSave(formData);
    if (onClose) onClose();
  }, [formData, onSave, onClose]);

  return (
    //==================================================================================================================
    //    DRAWER COMPONENT (Width fixed to 700px matching Figma specs)
    // ==================================================================================================================
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Lead Source' : 'Add Lead Source'}
      subtitle="Lorem Ipsum is simply dummy text of the printing and typesetting"
      width="w-full sm:w-[700px]"
      headerClassName="px-6 py-2"
      bodyClassName="px-6 py-2"
      footer={
        <div className="px-6 py-2.5 sm:py-3 bg-white-100 sticky bottom-0 z-20 flex justify-between items-center shrink-0">
          <BackButton onClick={onClose} label="Back" />
          <div className="flex items-center gap-2.5">
            <DeleteButton
              onClick={() => {
                if (isEdit && onDelete && initialData) {
                  onDelete(initialData);
                }
                onClose();
              }}
              label="Delete Lead"
            />
            <button
              type="button"
              onClick={handleSubmit}
              className="h-[34px] sm:h-[36px] px-5 rounded-[7px] border-b-2 border-black-90/20 bg-primary hover:bg-primary/90 text-white-100 text-xs sm:text-sm font-semibold transition-colors cursor-pointer active:scale-95 flex items-center justify-center"
            >
              Save Details
            </button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Row 1: ID and Lead Source */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <IdInput
            label="ID"
            name="code"
            value={formData.code}
          />
          <DropdownInput
            label="Lead Source"
            name="name"
            placeholder="Select Source"
            options={LEAD_SOURCE_NAME_OPTIONS}
            value={formData.name}
            onChange={(e) => handleDropdownChange('name', e.target.value)}
          />
        </div>

        {/* Row 2: Entry Method */}
        <div className="w-full">
          <DropdownInput
            label="Entry Method"
            name="entryMethod"
            placeholder="Select Method"
            options={ENTRY_METHOD_OPTIONS}
            value={formData.entryMethod}
            onChange={(e) => handleDropdownChange('entryMethod', e.target.value)}
          />
        </div>

        {/* Row 3: Status Radio Selection */}
        <StatusRadioInput
          label="Status"
          name="status"
          value={formData.status}
          activeValue="Active"
          inactiveValue="Inactive"
          onChange={handleChange}
          variant="solid"
          groupClassName="flex items-center gap-6 mt-1"
          optionLabelClassName="text-xs font-medium text-black-90"
        />
      </form>
    </Drawer>
  );
});

AddLeadSourceDrawer.displayName = 'AddLeadSourceDrawer';
export default AddLeadSourceDrawer;
