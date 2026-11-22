import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BackButton } from '../components/common/buttons/BackButton';
import { DropdownInput } from '../components/common/inputs/DropdownInput';
import { TextInput } from '../components/common/inputs/TextInput';
import { LeadSummaryCard } from '../components/modules/leads/LeadSummaryCard';
import { CONVERSION_DEAL_STAGE_OPTIONS } from '../constants/dealsConstants';
import { useToast } from '../hooks/useToast';
import { convertLead, fetchLead } from '../services/leadsService';
import { parseDealCloseDate } from '../utils/dealUtils';
import { dealConversionSchema } from '../utils/validationSchemas';
import { clearFieldError, focusFirstInvalidField, mapApiValidationErrors, validateForm } from '../utils/validationUtils';

/** Convert an eligible lead into an account, contact, and API-backed deal. */
const LeadConversion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const formRef = useRef(null);
  const [deal, setDeal] = useState({ title: '', amount: '', stage: '', closeDate: '' });

  useEffect(() => {
    let active = true;
    fetchLead(id)
      .then((result) => { if (active) setLead(result); })
      .catch((loadError) => {
        if (!active) return;
        setError(loadError.message || 'Unable to load lead details.');
        toast(loadError.message || 'Unable to load lead details.', 'error');
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [id, toast]);

  /** Keep the form controlled while the user prepares deal details. */
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    const normalizedValue = name === 'closeDate' && /^\d{2}-\d{2}-\d{4}$/.test(value) ? value.replaceAll('-', '/') : value;
    setDeal((current) => ({ ...current, [name]: normalizedValue }));
    clearFieldError(setFieldErrors, name);
    setError('');
  }, []);

  /** Submit the deal payload to the transactional lead-conversion endpoint. */
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    const validation = await validateForm(dealConversionSchema, deal);
    if (Object.keys(validation.errors).length) {
      setFieldErrors(validation.errors);
      focusFirstInvalidField(formRef.current, validation.errors);
      return;
    }
    setFieldErrors({});
    const date = parseDealCloseDate(deal.closeDate);
    if (date.error) { setError(date.error); toast(date.error, 'error'); return; }
    setIsSaving(true);
    setError('');
    try {
      const result = await convertLead(id, {
        title: deal.title.trim(),
        amount: deal.amount === '' ? null : Number(deal.amount),
        stage: deal.stage || 'prospect',
        closeDate: date.value || null,
      });
      toast(result?.deal?.deal_no ? `Lead converted and deal ${String(result.deal.deal_no).toUpperCase()} created.` : 'Lead converted successfully.');
      navigate('/deals', { replace: true });
    } catch (conversionError) {
      const serverErrors = mapApiValidationErrors(conversionError.data?.errors);
      if (Object.keys(serverErrors).length) {
        setFieldErrors(serverErrors);
        focusFirstInvalidField(formRef.current, serverErrors);
      } else {
        setError(conversionError.message || 'Unable to convert this lead.');
        toast(conversionError.message || 'Unable to convert this lead.', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  }, [deal, id, navigate, toast]);

  if (isLoading) return <div className="p-6 text-sm text-black-90/60" role="status">Loading lead details…</div>;
  if (!lead) return <div className="p-6 text-sm text-alert" role="alert">{error || 'Lead not found.'}</div>;

  const canConvert = lead.stage === 'Qualified';
  const address = [lead.address, lead.city, lead.state, lead.country].filter(Boolean).join(', ');

  return (
    <div className="min-h-full w-full bg-gray p-4 sm:p-6">
      <form ref={formRef} noValidate onSubmit={handleSubmit} className="mx-auto flex min-h-full w-full max-w-5xl flex-col rounded-[7px] border-b-2 border-stroke/80 bg-white-100">
        <header className="flex items-start justify-between gap-4 px-4 pt-4 sm:px-6 sm:pt-6">
          <div>
            <h1 className="text-lg font-bold text-black-90">Convert Lead</h1>
            <p className="mt-1 text-sm text-black-90/60">Review the lead details and create its linked account, contact, and deal.</p>
          </div>
          <button type="button" onClick={() => navigate(`/leads/${encodeURIComponent(id)}/edit`)} className="cursor-pointer rounded-[7px] border-b-2 border-stroke/80 bg-gray px-3 py-2 text-sm text-black-90 transition-colors hover:bg-gray/80" title="Close conversion page" aria-label="Close conversion page">×</button>
        </header>

        <div className="flex-1 space-y-5 overflow-visible px-4 py-5 sm:px-6">
          {error && <div role="alert" className="rounded-[7px] border-b-2 border-stroke/80 bg-alert/10 px-4 py-3 text-sm text-alert">{error}</div>}
          {!canConvert && <div role="status" className="rounded-[7px] border-b-2 border-stroke/80 bg-warning/10 px-4 py-3 text-sm text-black-90">Only qualified leads can be converted. Current stage: {lead.stage || 'Unknown'}.</div>}

          <section aria-label="Lead summary" className="space-y-3">
            <LeadSummaryCard
              avatar={lead.avatar || ''}
              title={lead.name}
              subtitle={lead.code}
              subline={[lead.designation, lead.email, lead.phone].filter(Boolean).join(' • ')}
              priority={lead.priority}
              products={lead.productInterest ? [lead.productInterest] : []}
            />
            <LeadSummaryCard
              avatar={lead.companyLogo || ''}
              title={lead.companyName}
              subtitle={lead.industry}
              subline={[lead.employeeScale && `${lead.employeeScale} employees`, lead.website].filter(Boolean).join(' • ')}
              address={address}
            />
          </section>

          <section className="space-y-4" aria-labelledby="deal-details-heading">
            <div>
              <h2 id="deal-details-heading" className="text-base font-bold text-black-90">Deal Details</h2>
              <p className="mt-1 text-sm text-black-90/60">The deal will be linked to this lead and its converted company account.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextInput label="Deal Title" name="title" value={deal.title} onChange={handleChange} placeholder="Enter deal title" required maxLength={200} error={fieldErrors.title} />
              <TextInput label="Deal Amount" name="amount" type="number" value={deal.amount} onChange={handleChange} placeholder="Enter deal amount" min="0" max="9999999999.99" step="0.01" error={fieldErrors.amount} />
              <DropdownInput label="Deal Stage" name="stage" placeholder="Select deal stage (defaults to Prospect)" options={CONVERSION_DEAL_STAGE_OPTIONS} value={deal.stage} onChange={(event) => handleChange({ target: { name: 'stage', value: event.target.value } })} error={fieldErrors.stage} />
              <TextInput label="Expected Close Date" name="closeDate" value={deal.closeDate} onChange={handleChange} placeholder="DD/MM/YYYY" inputMode="numeric" error={fieldErrors.closeDate} />
            </div>
            <div className="grid grid-cols-1 gap-3 rounded-[7px] bg-gray p-4 text-sm text-black-90/70 sm:grid-cols-2">
              <p><span className="font-semibold text-black-90">Product interest:</span> {lead.productInterest || 'None provided on the lead'}</p>
              <p><span className="font-semibold text-black-90">Deal owner:</span> Follows the lead assignment; unassigned leads use your account.</p>
            </div>
          </section>
        </div>

        <footer className="flex flex-col-reverse justify-between gap-3 border-t-2 border-stroke/80 bg-white-100 px-4 py-3 sm:flex-row sm:px-6">
          <BackButton onClick={() => navigate(`/leads/${encodeURIComponent(id)}/edit`)} />
          <button type="submit" disabled={isSaving || !canConvert} className="cursor-pointer rounded-[7px] border-b-2 border-black-90/20 bg-primary px-5 py-2.5 text-sm font-semibold text-white-100 transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">
            {isSaving ? 'Converting…' : 'Confirm & Convert Lead'}
          </button>
        </footer>
      </form>
    </div>
  );
};

export default LeadConversion;
