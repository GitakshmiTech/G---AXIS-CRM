//===========================================================================================
//    DEAL VIEW AND EDIT PAGE
// ===========================================================================================
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BackButton } from '../components/common/buttons/BackButton';
import { DropdownInput } from '../components/common/inputs/DropdownInput';
import { TextInput } from '../components/common/inputs/TextInput';
import { editDealSchema } from '../utils/validationSchemas';
import { clearFieldError, focusFirstInvalidField, validateForm } from '../utils/validationUtils';
import { CONVERSION_DEAL_STAGE_OPTIONS } from '../constants/dealsConstants';
import { fetchDeal, fetchDeals, saveDeal } from '../services/dealsService';

/** Load one Deal and expose the API-supported fields in a shared View/Edit page. */
const DealForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, mode: routeMode } = useParams();
  const mode = routeMode || (location.pathname.endsWith('/edit') ? 'edit' : 'view');
  const isView = mode === 'view';
  const [deal, setDeal] = useState(null);
  const [owners, setOwners] = useState([]);
  const [form, setForm] = useState({ dealName: '', dealAmount: '', productInterest: '', stage: '', closeDate: '', ownerId: '', probability: '', userCount: '', lostReason: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    let active = true;
    Promise.all([fetchDeal(id), fetchDeals({ limit: 100 })])
      .then(([result, list]) => {
        if (!active) return;
        setDeal(result);
        setOwners(list.owners);
        setForm({
          dealName: result.title,
          dealAmount: result.value ? Number(result.value).toLocaleString('en-IN') : '',
          productInterest: result.productId,
          stage: result.stageValue,
          closeDate: result.closeDate,
          ownerId: result.ownerId || '__unassigned__',
          probability: result.probability,
          userCount: result.userCount === '' ? '' : String(result.userCount),
          lostReason: result.lostReason,
        });
        setError('');
      })
      .catch((loadError) => { if (active) setError(loadError.message || 'Unable to load deal.'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [id]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    clearFieldError(setFieldErrors, name);
  }, []);

  const ownerOptions = useMemo(() => [
    { value: '__unassigned__', label: 'Unassigned' },
    ...owners,
    ...(form.ownerId && form.ownerId !== '__unassigned__' && !owners.some((owner) => owner.value === form.ownerId) ? [{ value: form.ownerId, label: deal?.assignedBde || 'Current owner' }] : []),
  ], [deal, form.ownerId, owners]);

  const handleSave = useCallback(async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const validation = await validateForm(editDealSchema, form);
    if (Object.keys(validation.errors).length) {
      setFieldErrors(validation.errors);
      focusFirstInvalidField(formElement, validation.errors);
      return;
    }
    try {
      setIsSaving(true);
      setError('');
      await saveDeal(id, form);
      navigate('/deals', { replace: true });
    } catch (saveError) {
      setError(saveError.message || 'Unable to save deal.');
    } finally {
      setIsSaving(false);
    }
  }, [form, id, navigate]);

  if (isLoading) return <div role="status" className="p-6 text-sm text-black-90/60">Loading deal…</div>;
  if (!deal && error) return <div role="alert" className="m-4 rounded-[7px] border-b-2 border-stroke/80 bg-alert/10 p-4 text-sm text-alert">{error}</div>;

  return (
    <div className="min-h-full w-full bg-gray p-4 sm:p-6">
      <section className="mx-auto w-full max-w-5xl rounded-[7px] border-b-2 border-stroke/80 bg-white-100">
        <header className="px-5 py-5 sm:px-8">
          <h1 className="text-xl font-bold text-primary">{isView ? 'View Deal Details' : 'Edit Deal'}</h1>
          <p className="mt-1 text-sm text-black-90/60">Deal details and account association from the CRM API.</p>
        </header>
        <form noValidate onSubmit={handleSave} className="flex flex-col gap-5 px-5 pb-5 sm:px-8">
          {error && <p role="alert" className="rounded-[7px] border-b-2 border-stroke/80 bg-alert/10 px-3 py-2 text-xs text-alert">{error}</p>}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput label="Deal Code" value={deal.code} disabled readOnly />
            <TextInput label="Deal Name" name="dealName" value={form.dealName} onChange={handleChange} disabled={isView} required error={fieldErrors.dealName} />
            <TextInput label="Account" value={deal.companyName || '—'} disabled readOnly />
            <DropdownInput label="Deal Stage" name="stage" value={form.stage} options={CONVERSION_DEAL_STAGE_OPTIONS} onChange={handleChange} disabled={isView} />
            <TextInput label="Expected Value" name="dealAmount" value={form.dealAmount} onChange={handleChange} disabled={isView} error={fieldErrors.dealAmount} />
            <TextInput label="Expected Close Date" name="closeDate" value={form.closeDate} onChange={handleChange} disabled={isView} placeholder="DD/MM/YYYY" error={fieldErrors.closeDate} />
            <DropdownInput label="Owner (BDE)" name="ownerId" value={form.ownerId} options={ownerOptions} onChange={handleChange} disabled={isView} placeholder="Select deal owner" />
            <TextInput label="Probability (%)" name="probability" type="number" min="0" max="100" step="1" value={form.probability} onChange={handleChange} disabled={isView} error={fieldErrors.probability} />
            <TextInput label="User Count" name="userCount" type="number" min="0" step="1" value={form.userCount} onChange={handleChange} disabled={isView} error={fieldErrors.userCount} />
            {(form.stage === 'closed lost' || form.lostReason) && <TextInput label="Lost Reason" name="lostReason" value={form.lostReason} onChange={handleChange} disabled={isView} maxLength={255} error={fieldErrors.lostReason} />}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stroke/60 pt-4">
            <BackButton onClick={() => navigate('/deals')} label="Back to Deals" />
            {!isView && <button type="submit" disabled={isSaving} className="cursor-pointer rounded-[7px] border-b-2 border-black-90/20 bg-primary px-4 py-2 text-xs font-semibold text-white-100 transition-colors hover:bg-primary/90 disabled:opacity-60">{isSaving ? 'Saving…' : 'Save Deal'}</button>}
            {isView && <button type="button" onClick={() => navigate(`/deals/${encodeURIComponent(id)}/edit`)} className="cursor-pointer rounded-[7px] border-b-2 border-black-90/20 bg-primary px-4 py-2 text-xs font-semibold text-white-100 transition-colors hover:bg-primary/90">Edit Deal</button>}
          </div>
        </form>
      </section>
    </div>
  );
};

export default DealForm;
