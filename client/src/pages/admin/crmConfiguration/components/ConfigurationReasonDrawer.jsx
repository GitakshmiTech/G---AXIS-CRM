//==================================================================================================================
//    LOST REASON AND ACTIVITY MODALITY EDITOR
//    Shared feature-level drawer built from existing common form components
// ==================================================================================================================

import React, { memo, useCallback, useEffect, useState } from 'react';
import { Drawer } from '../../../../components/common/Drawer';
import { DropdownInput } from '../../../../components/common/input common/DropdownInput/DropdownInput';
import { IdInput } from '../../../../components/common/input common/IdInput/IdInput';
import { StatusRadioInput } from '../../../../components/common/input common/StatusRadioInput/StatusRadioInput';
import { BackButton } from '../../../../components/common/buttons/BackButton';
import { DeleteButton } from '../../../../components/common/buttons/DeleteButton';

export const ConfigurationReasonDrawer = memo(({ isOpen, onClose, onSave, onDelete, initialData, config }) => {
  const [formData, setFormData] = useState({ code: '#001', name: '', relatedValue: '', status: 'Active' });
  const isEdit = Boolean(initialData);

  useEffect(() => {
    setFormData(initialData
      ? { code: initialData.code || '#001', name: initialData.name || '', relatedValue: initialData[config.relatedKey] || '', status: initialData.status || 'Active' }
      : { code: '#001', name: '', relatedValue: '', status: 'Active' });
  }, [initialData, isOpen, config.relatedKey]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    onSave({ code: formData.code, name: formData.name, [config.relatedKey]: formData.relatedValue, status: formData.status });
  }, [config.relatedKey, formData, onSave]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`${isEdit ? 'Edit' : 'Add'} ${config.title}`}
      subtitle="Configure CRM classifications and activity settings"
      width="w-full sm:w-[560px]"
      headerClassName="p-5 pb-2"
      bodyClassName="px-5 pt-2 pb-6"
      footer={(
        <div className="px-5 py-4 bg-white-100 border-t border-stroke sticky bottom-0 flex justify-between items-center shrink-0">
          <BackButton onClick={onClose} label="Back" />
          <div className="flex items-center gap-2.5">
            <DeleteButton onClick={() => isEdit && onDelete(initialData)} label={`Delete ${config.deleteLabel}`} />
            <button type="submit" form="configuration-reason-form" className="h-[44px] px-6 rounded-[7px] bg-primary hover:bg-primary/90 text-white-100 text-sm font-semibold transition-colors shadow-2xs cursor-pointer active:scale-95">Save Details</button>
          </div>
        </div>
      )}
    >
      <form id="configuration-reason-form" onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <IdInput label="ID" name="code" value={formData.code} readOnly />
          <DropdownInput label={config.nameLabel} name="name" placeholder={config.namePlaceholder} options={config.nameOptions} value={formData.name} onChange={handleChange} />
        </div>
        <DropdownInput label={config.relatedLabel} name="relatedValue" placeholder={config.relatedPlaceholder} options={config.relatedOptions} value={formData.relatedValue} onChange={handleChange} />
        <StatusRadioInput label="Status" name="status" value={formData.status} activeValue="Active" inactiveValue="Inactive" onChange={handleChange} variant="solid" groupClassName="flex items-center gap-6 mt-1" optionLabelClassName="text-xs font-medium text-black-90" />
      </form>
    </Drawer>
  );
});

ConfigurationReasonDrawer.displayName = 'ConfigurationReasonDrawer';
