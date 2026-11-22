//===========================================================================================
//    CLIENT ACCOUNT VIEW AND EDIT PAGE
// ===========================================================================================
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BackButton } from '../components/common/buttons/BackButton';
import { DropdownInput } from '../components/common/inputs/DropdownInput';
import { TextInput } from '../components/common/inputs/TextInput';
import { fetchClient, fetchIndustries, saveClient } from '../services/clientsService';

/** Load an authorized Account and provide its API-supported fields on a full page. */
const ClientForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isView = location.pathname.endsWith('/view');
  const [client, setClient] = useState(null);
  const [industries, setIndustries] = useState(location.state?.industries || []);
  const [form, setForm] = useState({ name: '', industryId: '', originalIndustryId: '', email: '', phone: '', gstNo: '', address: '' });
  const [loadedClientId, setLoadedClientId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const isLoading = loadedClientId !== id;

  // Load account details and industry options for both direct links and directory navigation.
  useEffect(() => {
    let active = true;
    Promise.all([
      fetchClient(id),
      industries.length ? Promise.resolve(null) : fetchIndustries(),
    ])
      .then(([result, optionsResult]) => {
        if (!active) return;
        setClient(result);
        if (optionsResult) setIndustries(optionsResult);
        setForm({
          name: result.name || '',
          industryId: result.industryId || '',
          originalIndustryId: result.industryId || '',
          email: result.email || '',
          phone: result.phone || '',
          gstNo: result.gstNo || '',
          address: result.address || '',
        });
        setError('');
        setNameError('');
        setLoadedClientId(id);
      })
      .catch((loadError) => {
        if (!active) return;
        setError(loadError.message || 'Unable to load account details.');
        setLoadedClientId(id);
      });
    return () => { active = false; };
  }, [id, industries.length]);

  const industryOptions = useMemo(() => [
    ...industries,
    ...(form.industryId && !industries.some((industry) => industry.value === form.industryId)
      ? [{ value: form.industryId, label: client?.industryType || form.industryId }]
      : []),
  ], [client, form.industryId, industries]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (name === 'name') setNameError('');
  }, []);

  const handleSave = useCallback(async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setNameError('Account name is required.');
      event.currentTarget.elements.name?.focus();
      return;
    }
    try {
      setIsSaving(true);
      setError('');
      await saveClient(id, form);
      navigate('/clients', { replace: true });
    } catch (saveError) {
      setError(saveError.message || 'Unable to save account details.');
    } finally {
      setIsSaving(false);
    }
  }, [form, id, navigate]);

  if (isLoading) return <div role="status" aria-busy="true" className="m-4 space-y-4 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 p-6"><div className="h-6 w-1/3 animate-pulse rounded-[4px] bg-gray" /><div className="h-10 w-full animate-pulse rounded-[4px] bg-gray" /><div className="h-10 w-full animate-pulse rounded-[4px] bg-gray" /></div>;
  if (!client) return <div role="alert" className="m-4 rounded-[7px] border-b-2 border-stroke/80 bg-alert/10 p-4 text-sm text-alert">{error || 'Account not found.'}<div className="mt-3"><BackButton onClick={() => navigate('/clients')} label="Back to Accounts" /></div></div>;

  return (
    <div className="min-h-full w-full bg-gray p-4 sm:p-6">
      <section className="mx-auto w-full max-w-5xl rounded-[7px] border-b-2 border-stroke/80 bg-white-100">
        <header className="px-5 py-5 sm:px-8">
          <h1 className="text-xl font-bold text-primary">{isView ? 'View Account Details' : 'Edit Account'}</h1>
          <p className="mt-1 text-sm text-black-90/60">Account information, linked contacts, and related deals from the CRM API.</p>
        </header>
        <form noValidate onSubmit={handleSave} className="flex flex-col gap-5 px-5 pb-5 sm:px-8">
          {error && <p role="alert" className="rounded-[7px] border-b-2 border-stroke/80 bg-alert/10 px-3 py-2 text-xs text-alert">{error}</p>}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput label="Account Code" value={client.code || ''} disabled readOnly />
            <TextInput label="Account Name" name="name" value={form.name} onChange={handleChange} disabled={isView} required error={nameError} />
            <TextInput label="Assigned BDE" value={client.assignedBde || 'Unassigned'} disabled readOnly />
            <DropdownInput label="Industry" name="industryId" value={form.industryId} options={industryOptions} onChange={handleChange} disabled={isView} placeholder="Select industry" />
            <TextInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} disabled={isView} />
            <TextInput label="Contact Number" name="phone" value={form.phone} onChange={handleChange} disabled={isView} />
            <TextInput label="GST Number" name="gstNo" value={form.gstNo} onChange={handleChange} disabled={isView} />
            <TextInput label="Address" name="address" value={form.address} onChange={handleChange} disabled={isView} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <section className="min-w-0 border-t border-stroke/60 pt-4">
              <h2 className="mb-2 text-sm font-semibold text-black-90">Linked Contacts ({client.contacts?.length || 0})</h2>
              {client.contacts?.length ? <div className="space-y-2">{client.contacts.map((contact) => <article key={contact.cnt_id} className="min-w-0 rounded-[7px] border-b-2 border-stroke/80 bg-gray p-3"><p className="break-words text-xs font-semibold text-black-90">{contact.cnt_name}{contact.cnt_is_primary ? ' · Primary' : ''}</p><p className="mt-1 break-words text-[11px] text-black-90/60">{contact.cnt_designation || '—'}{contact.cnt_email ? ` · ${contact.cnt_email}` : ''}</p></article>)}</div> : <p className="rounded-[7px] border-b-2 border-stroke/80 bg-gray p-3 text-xs text-black-90/55">No linked contacts.</p>}
            </section>

            <section className="min-w-0 border-t border-stroke/60 pt-4">
              <h2 className="mb-2 text-sm font-semibold text-black-90">Related Deals ({client.deals?.length || 0})</h2>
              {client.deals?.length ? <div className="space-y-2">{client.deals.map((deal) => <article key={deal.deal_id} className="flex min-w-0 items-center justify-between gap-3 rounded-[7px] border-b-2 border-stroke/80 bg-gray p-3"><div className="min-w-0"><p className="break-words text-xs font-semibold text-black-90">{deal.deal_title || deal.deal_no}</p><p className="mt-1 break-words text-[11px] capitalize text-black-90/60">{deal.deal_stage}</p></div><span className="shrink-0 whitespace-nowrap text-xs font-semibold text-black-90">{deal.deal_value == null ? '—' : `₹${Number(deal.deal_value).toLocaleString('en-IN')}`}</span></article>)}</div> : <p className="rounded-[7px] border-b-2 border-stroke/80 bg-gray p-3 text-xs text-black-90/55">No related deals.</p>}
            </section>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-stroke/60 pt-4">
            <BackButton onClick={() => navigate('/clients')} label="Back to Accounts" />
            {isView ? <button type="button" onClick={() => navigate(`/clients/${encodeURIComponent(id)}/edit`, { state: { industries } })} className="cursor-pointer rounded-[7px] border-b-2 border-black-90/20 bg-primary px-4 py-2 text-xs font-semibold text-white-100 transition-colors hover:bg-primary/90">Edit Account</button> : <button type="submit" disabled={isSaving} className="cursor-pointer rounded-[7px] border-b-2 border-black-90/20 bg-primary px-4 py-2 text-xs font-semibold text-white-100 transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60">{isSaving ? 'Saving…' : 'Save Account'}</button>}
          </footer>
        </form>
      </section>
    </div>
  );
};

export default ClientForm;
