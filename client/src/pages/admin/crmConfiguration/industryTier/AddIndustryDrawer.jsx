//==================================================================================================================
//    ADD / EDIT INDUSTRY DRAWER (ADMIN CRM CONFIGURATION)
//    Slide-over drawer for configuring industry taxonomy and active state (Image 2)
//==================================================================================================================

import React, { useState, useEffect, memo, useCallback } from 'react';
import { Drawer } from '../../../../components/common/Drawer';
import { TextInput } from '../../../../components/common/input common/TextInput/TextInput';
import { IdInput } from '../../../../components/common/input common/IdInput/IdInput';
import { StatusRadioInput } from '../../../../components/common/input common/StatusRadioInput/StatusRadioInput';
import { BackButton } from '../../../../components/common/buttons/BackButton';
import { DeleteButton } from '../../../../components/common/buttons/DeleteButton';

export const AddIndustryDrawer = memo(({
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
    status: 'Active',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || '#001',
        name: initialData.name || '',
        status: initialData.status || 'Active',
      });
    } else {
      setFormData({
        code: '#001',
        name: '',
        status: 'Active',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    if (e) e.preventDefault();
    if (onSave) onSave(formData);
    if (onClose) onClose();
  }, [formData, onSave, onClose]);

  return (
    //==================================================================================================================
    //    DRAWER COMPONENT (Width 700px matching Figma specs)
    // ==================================================================================================================
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Industry' : 'Add Industry'}
      subtitle="Lorem Ipsum is simply dummy text of the printing and typesetting"
      width="w-full sm:w-[700px]"
      headerClassName="p-5 pb-2"
      bodyClassName="px-6 pt-2 pb-6"
      footer={
        <div className="px-6 py-4 bg-white-100 border-t border-stroke sticky bottom-0 z-20 flex justify-between items-center shrink-0">
          <BackButton onClick={onClose} label="Back" />
          <div className="flex items-center gap-2.5">
            <DeleteButton
              onClick={() => {
                if (isEdit && onDelete && initialData) {
                  onDelete(initialData);
                }
                onClose();
              }}
              label="Delete Industry"
            />
            <button
              type="button"
              onClick={handleSubmit}
              className="h-[44px] px-6 rounded-[7px] bg-primary hover:bg-primary/90 text-white-100 text-sm font-semibold transition-colors shadow-2xs cursor-pointer active:scale-95 flex items-center justify-center"
            >
              Save Details
            </button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Row 1: ID and Industry Sector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <IdInput
            label="ID"
            name="code"
            value={formData.code}
          />
          <TextInput
            label="Industry Sector"
            name="name"
            placeholder="Add Sector"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* Row 2: Status Radio Selection */}
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

AddIndustryDrawer.displayName = 'AddIndustryDrawer';
export default AddIndustryDrawer;
