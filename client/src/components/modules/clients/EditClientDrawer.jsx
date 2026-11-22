//===========================================================================================
//    ACCOUNT VIEW AND EDIT DRAWER
// ===========================================================================================
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Drawer } from '../../common/sidebar/Drawer';
import { TextInput } from '../../common/inputs/TextInput';
import { DropdownInput } from '../../common/inputs/DropdownInput';
import { BackButton } from '../../common/buttons/BackButton';

/** Display API-backed Account fields and its related Contacts and Deals. */
export const EditClientDrawer = memo(({ isOpen, onClose, onSave, initialData, mode = 'view', industries = [], isLoading = false }) => {
  const [form, setForm] = useState({ name: '', industryId: '', email: '', phone: '', address: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const isView = mode === 'view';

  useEffect(() => {
    setForm({
      name: initialData?.name || '',
      industryId: initialData?.industryId || '',
      originalIndustryId: initialData?.industryId || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
    });
    setError('');
  }, [initialData, isOpen]);

  const industryOptions = useMemo(() => [
    ...industries,
    ...(form.industryId && !industries.some((industry) => industry.value === form.industryId)
      ? [{ value: form.industryId, label: initialData?.industryType || form.industryId }]
      : []),
  ], [form.industryId, industries, initialData]);
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }, []);
  const handleSave = useCallback(async (event) => {
    event.preventDefault();
    if (!form.name.trim()) { setError('Account name is required.'); return; }
    try {
      setIsSaving(true);
      setError('');
      await onSave(form);
    } catch (saveError) {
      setError(saveError.message || 'Unable to save Account details.');
    } finally { setIsSaving(false); }
  }, [form, onSave]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isView ? 'View Account Details' : 'Edit Account'}
      subtitle="Account information and linked records from the CRM API."
      width="w-full sm:w-[600px]"
      bodyClassName="px-6 py-3"
      footer={<div className="flex items-center justify-between border-t border-stroke/60 bg-white-100 px-6 py-3"><BackButton onClick={onClose} label="Back" />{!isView && <button type="submit" form="account-edit-form" disabled={isSaving || isLoading} className="cursor-pointer rounded-[7px] border-b-2 border-black-90/20 bg-primary px-5 py-2 text-xs font-semibold text-white-100 transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60">{isSaving ? 'Saving…' : 'Save Details'}</button>}</div>}
    >
      {isLoading ? <p role="status" className="py-8 text-center text-sm text-black-90/60">Loading Account details…</p> : (
        <form id="account-edit-form" noValidate onSubmit={handleSave} className="flex flex-col gap-4">
          {error && <p role="alert" className="rounded-[7px] border-b-2 border-stroke/80 bg-alert/10 px-3 py-2 text-xs text-alert">{error}</p>}
          <TextInput label="Account Code" value={initialData?.code || ''} disabled readOnly />
          <TextInput label="Account Name" name="name" value={form.name} onChange={handleChange} disabled={isView} required />
          <TextInput label="Assigned BDE" value={initialData?.assignedBde || 'Unassigned'} disabled readOnly />
          <DropdownInput label="Industry" name="industryId" value={form.industryId} options={industryOptions} onChange={handleChange} disabled={isView} placeholder="Select industry" />
          <TextInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} disabled={isView} />
          <TextInput label="Contact Number" name="phone" value={form.phone} onChange={handleChange} disabled={isView} />
          <TextInput label="Address" name="address" value={form.address} onChange={handleChange} disabled={isView} />

          <section className="mt-2 border-t border-stroke/60 pt-4">
            <h3 className="mb-2 text-sm font-semibold text-black-90">Linked Contacts ({initialData?.contacts?.length || 0})</h3>
            {initialData?.contacts?.length ? <div className="flex flex-col divide-y divide-stroke/50">{initialData.contacts.map((contact) => <div key={contact.cnt_id} className="py-2"><p className="text-xs font-semibold text-black-90">{contact.cnt_name}{contact.cnt_is_primary ? ' · Primary' : ''}</p><p className="text-[11px] text-black-90/60">{contact.cnt_designation || '—'}{contact.cnt_email ? ` · ${contact.cnt_email}` : ''}</p></div>)}</div> : <p className="text-xs text-black-90/55">No linked contacts.</p>}
          </section>
          <section className="border-t border-stroke/60 pt-4">
            <h3 className="mb-2 text-sm font-semibold text-black-90">Related Deals ({initialData?.deals?.length || 0})</h3>
            {initialData?.deals?.length ? <div className="flex flex-col divide-y divide-stroke/50">{initialData.deals.map((deal) => <div key={deal.deal_id} className="flex items-center justify-between gap-3 py-2"><div className="min-w-0"><p className="truncate text-xs font-semibold text-black-90">{deal.deal_title || deal.deal_no}</p><p className="text-[11px] capitalize text-black-90/60">{deal.deal_stage}</p></div><span className="whitespace-nowrap text-xs font-semibold text-black-90">{deal.deal_value == null ? '—' : `₹${Number(deal.deal_value).toLocaleString('en-IN')}`}</span></div>)}</div> : <p className="text-xs text-black-90/55">No related deals.</p>}
          </section>
        </form>
      )}
    </Drawer>
  );
});

EditClientDrawer.displayName = 'EditClientDrawer';
export default EditClientDrawer;
