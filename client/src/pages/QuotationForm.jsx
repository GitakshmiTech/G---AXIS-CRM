//===========================================================================================
//    QUOTATION CREATE, EDIT, AND VIEW PAGE
// ===========================================================================================
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, X, Send, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TextInput } from '../components/common/inputs/TextInput';
import { TextAreaInput } from '../components/modules/quotations/TextAreaInput';
import { DropdownInput } from '../components/common/inputs/DropdownInput';
import { QuotationApprovalModal } from '../components/modules/quotations/QuotationApprovalModal';
import { fetchDeals } from '../services/dealsService';
import { fetchClient } from '../services/clientsService';
import {
  createQuotation,
  fetchQuotation,
  submitQuotationForApproval,
  updateQuotation,
  approveQuotation,
  rejectQuotation,
  sendQuotation,
} from '../services/quotationsService';
import { fromApiDate, isValidDDMMYYYY, toApiDate } from '../utils/dateUtils';
import { useToast } from '../hooks/useToast';

const EMPTY_FORM = { dealId: '', contactId: '', goLiveDate: '', validUntil: '', paymentTerms: '', productName: '', planName: '', userCount: '', unitPrice: '', billingFrequency: '', discountPercent: '', taxPercent: '', slaAppendix: '', internalNotes: '' };
const FREQUENCIES = [{ value: 'monthly', label: 'Monthly' }, { value: 'annual', label: 'Annual' }, { value: 'one_time', label: 'One time' }];

/** Render a full-page quotation workflow and persist it through the quotation API. */
const QuotationForm = ({ mode: routeMode }) => {
  const { id } = useParams();
  const mode = routeMode || (id ? 'view' : 'create');
  const navigate = useNavigate();
  const toast = useToast();
  const authRole = useSelector((state) => state.auth?.role);
  const authUser = useSelector((state) => state.auth?.user);
  const isApprover = useMemo(() => {
    const role = (authRole || authUser?.role || '').toLowerCase();
    const designation = (authUser?.roleLabel || authUser?.designation || '').toLowerCase();
    return role === 'admin' || role === 'sales' || /admin|manager|vp/i.test(designation);
  }, [authRole, authUser]);

  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const [form, setForm] = useState(EMPTY_FORM);
  const [quotation, setQuotation] = useState(null);
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Approval modal state
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'approve' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      (!id || isEdit) ? fetchDeals({ page: 1, limit: 100, signal: controller.signal }) : Promise.resolve({ rows: [] }),
      id ? fetchQuotation(id) : Promise.resolve(null),
    ]).then(([dealResult, quote]) => {
      if (controller.signal.aborted) return;
      setDeals(dealResult.rows);
      setQuotation(quote);
      if (quote) {
        const item = quote.lineItems?.[0] || {};
        setForm({
          ...EMPTY_FORM,
          dealId: quote.quo_deal_id || quote.deal?.id || '',
          contactId: quote.quo_contact_id || quote.contact?.id || '',
          goLiveDate: fromApiDate(quote.quo_go_live_date),
          validUntil: fromApiDate(quote.quo_valid_until),
          paymentTerms: quote.quo_payment_terms || '',
          productName: item.productName || '', planName: item.planName || '',
          userCount: item.userCount ? String(item.userCount) : '',
          unitPrice: item.unitPrice ? String(item.unitPrice) : '',
          billingFrequency: item.billingFrequency || '',
          discountPercent: quote.quo_discount_percent ? String(quote.quo_discount_percent) : '',
          taxPercent: quote.quo_tax_percent ? String(quote.quo_tax_percent) : '',
          slaAppendix: quote.quo_sla_appendix || '',
          internalNotes: quote.quo_internal_notes || '',
        });
      }
    }).catch((requestError) => {
      if (!controller.signal.aborted) setError(requestError.message || 'Unable to load quotation details.');
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id, isEdit]);

  const selectedDeal = useMemo(() => deals.find((deal) => deal.id === form.dealId), [deals, form.dealId]);
  useEffect(() => {
    if (!selectedDeal?.accountId || isView) return undefined;
    let active = true;
    fetchClient(selectedDeal.accountId)
      .then((account) => { if (active) setContacts(account.contacts || []); })
      .catch((requestError) => { if (active) setError(requestError.message || 'Unable to load the Account Contacts.'); });
    return () => { active = false; };
  }, [selectedDeal?.accountId, isView]);

  const dealOptions = useMemo(() => deals.map((deal) => ({ value: deal.id, label: `${deal.code} · ${deal.title} — ${deal.companyName}` })), [deals]);
  const contactOptions = useMemo(() => contacts.map((contact) => ({ value: contact.cnt_id || contact.id, label: `${contact.cnt_name || contact.name}${contact.cnt_is_primary ? ' · Primary' : ''}` })), [contacts]);
  const updateField = useCallback((name, value) => { setForm((current) => ({ ...current, [name]: value })); setError(''); }, []);
  const selectDeal = useCallback((event) => {
    setForm((current) => ({ ...current, dealId: event.target.value, contactId: '' }));
    setContacts([]);
    setError('');
  }, []);

  const handleSave = useCallback(async (submitForApproval = false) => {
    if (!form.dealId) return setError('Select a Deal.');
    if (!form.contactId) return setError('Select a Contact linked to the Deal Account.');
    if (!isValidDDMMYYYY(form.validUntil)) return setError('Enter a valid expiry date as DD/MM/YYYY.');
    if (form.goLiveDate && !isValidDDMMYYYY(form.goLiveDate)) return setError('Enter a valid go-live date as DD/MM/YYYY.');
    if (!form.productName.trim() || !Number(form.userCount) || Number(form.userCount) < 1 || form.unitPrice === '' || Number(form.unitPrice) < 0 || !form.billingFrequency) return setError('Complete the product, user count, unit price, and billing frequency.');
    const payload = {
      ...(isEdit ? {} : { dealId: form.dealId }),
      contactId: form.contactId,
      goLiveDate: form.goLiveDate ? toApiDate(form.goLiveDate) : null,
      validUntil: toApiDate(form.validUntil),
      paymentTerms: form.paymentTerms.trim(), slaAppendix: form.slaAppendix, internalNotes: form.internalNotes,
      currency: 'INR', discountPercent: Number(form.discountPercent) || 0, taxPercent: Number(form.taxPercent) || 0,
      lineItems: [{ productName: form.productName.trim(), planName: form.planName.trim(), userCount: Number(form.userCount), unitPrice: Number(form.unitPrice), billingFrequency: form.billingFrequency }],
    };
    setSaving(true);
    setError('');
    try {
      const saved = isEdit ? await updateQuotation(id, payload) : await createQuotation(payload);
      if (submitForApproval) await submitQuotationForApproval(saved.id);
      navigate('/quotations');
    } catch (requestError) {
      setError(requestError.message || 'Unable to save the quotation.');
    } finally { setSaving(false); }
  }, [form, isEdit, id, navigate]);

  const isPendingApproval = quotation?.statusValue === 'pending_approval';
  const isApproved = quotation?.statusValue === 'approved' || quotation?.approvalStatus === 'approved';
  const isRejected = quotation?.statusValue === 'rejected' || quotation?.approvalStatus === 'rejected';
  const canSend = isView && isApproved && quotation?.statusValue !== 'sent' && quotation?.statusValue !== 'accepted';

  const handleApproveClick = useCallback(() => {
    setModalConfig({ isOpen: true, type: 'approve' });
  }, []);

  const handleRejectClick = useCallback(() => {
    setModalConfig({ isOpen: true, type: 'reject' });
  }, []);

  const handleModalClose = useCallback(() => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleModalConfirm = useCallback(async (payload) => {
    setActionLoading(true);
    try {
      if (modalConfig.type === 'approve') {
        const updated = await approveQuotation(id, payload);
        setQuotation(updated);
        toast('Quotation approved successfully. Commercial proposal confirmed.', 'success');
      } else {
        const updated = await rejectQuotation(id, payload);
        setQuotation(updated);
        toast('Quotation rejected and sent back to BDE for revision.', 'info');
      }
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
    } catch (err) {
      toast(err.message || 'Operation failed. Please try again.', 'error');
    } finally {
      setActionLoading(false);
    }
  }, [id, modalConfig.type, toast]);

  const handleSendToCustomer = useCallback(async () => {
    setActionLoading(true);
    try {
      const updated = await sendQuotation(id);
      setQuotation(updated);
      toast('Quotation dispatched to customer successfully.', 'success');
    } catch (err) {
      toast(err.message || 'Unable to send quotation. Please try again.', 'error');
    } finally {
      setActionLoading(false);
    }
  }, [id, toast]);

  const title = isView ? 'View Quotation' : isEdit ? 'Edit Quotation Draft' : 'Create Quotation';
  if (loading) return <div className="flex min-h-[320px] items-center justify-center text-sm text-black-90/60" role="status">Loading quotation…</div>;

  return (
    <main className="w-full flex-1 min-h-0 overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl rounded-[7px] bg-white-100 px-5 py-5 sm:px-7">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-stroke pb-4">
          <div>
            <button type="button" onClick={() => navigate('/quotations')} className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer">
              <ArrowLeft size={15} /> Back to Quotations
            </button>
            <h1 className="text-xl font-bold text-primary">{title}</h1>
            <p className="mt-1 text-sm text-black-90/60">
              {quotation?.code ? `${quotation.code} · ${quotation.status}` : 'Create a commercial proposal linked to an accessible Deal and Account Contact.'}
            </p>
          </div>

          {/* Action CTAs in Header (FRD 11.36) */}
          {isView && (
            <div className="flex flex-wrap items-center gap-2">
              {isPendingApproval && isApprover && (
                <>
                  <button
                    type="button"
                    onClick={handleApproveClick}
                    disabled={actionLoading}
                    title="Approve this quotation"
                    className="cursor-pointer rounded-[7px] border-b-2 border-stroke/80 bg-success px-4 py-2 text-xs font-semibold text-white-100 hover:bg-success/90 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Check size={14} /> Approve Quotation
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectClick}
                    disabled={actionLoading}
                    title="Reject this quotation"
                    className="cursor-pointer rounded-[7px] border-b-2 border-stroke/80 bg-alert/10 text-alert px-4 py-2 text-xs font-semibold hover:bg-alert/20 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <X size={14} /> Reject Quotation
                  </button>
                </>
              )}
              {canSend && (
                <button
                  type="button"
                  onClick={handleSendToCustomer}
                  disabled={actionLoading}
                  title="Send quotation to customer"
                  className="cursor-pointer rounded-[7px] border-b-2 border-stroke/80 bg-primary px-4 py-2 text-xs font-semibold text-white-100 hover:bg-primary/90 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send size={14} /> Send to Customer
                </button>
              )}
              {quotation?.canEdit && (
                <button
                  type="button"
                  onClick={() => navigate(`/quotations/${encodeURIComponent(id)}/edit`)}
                  title="Edit quotation draft"
                  className="cursor-pointer rounded-[7px] border-b-2 border-stroke/80 bg-primary px-4 py-2 text-xs font-semibold text-white-100 hover:bg-primary/90 transition-colors"
                >
                  Edit Draft
                </button>
              )}
            </div>
          )}
        </div>

        {/* Status Callout Banner */}
        {isView && isPendingApproval && (
          <div className="mb-4 flex items-center gap-2.5 rounded-[7px] border-b-2 border-stroke/80 bg-warning/10 p-3.5 text-xs text-black-90 font-medium">
            <Clock size={16} className="text-warning shrink-0" />
            <div>
              <span className="font-bold text-black-90">Pending Manager Review:</span> This quotation has been submitted by BDE for approval.
              {isApprover ? ' As a Sales Manager or Admin, review the commercial terms and click Approve or Reject above.' : ' Awaiting manager action.'}
            </div>
          </div>
        )}

        {isView && isApproved && (
          <div className="mb-4 flex items-center gap-2.5 rounded-[7px] border-b-2 border-stroke/80 bg-success/10 p-3.5 text-xs text-black-90 font-medium">
            <CheckCircle2 size={16} className="text-success shrink-0" />
            <div>
              <span className="font-bold text-success">Approved:</span> Commercial proposal was reviewed and approved by management.
              {quotation?.approvalNote && <span className="block mt-0.5 text-black-90/70 font-normal">Manager Note: &ldquo;{quotation.approvalNote}&rdquo;</span>}
            </div>
          </div>
        )}

        {isView && isRejected && (
          <div className="mb-4 flex items-center gap-2.5 rounded-[7px] border-b-2 border-stroke/80 bg-alert/10 p-3.5 text-xs text-black-90 font-medium">
            <XCircle size={16} className="text-alert shrink-0" />
            <div>
              <span className="font-bold text-alert">Rejected:</span> Commercial proposal was rejected by manager.
              {quotation?.approvalNote && <span className="block mt-0.5 text-black-90/70 font-normal">Reason: &ldquo;{quotation.approvalNote}&rdquo;</span>}
              <span className="block mt-0.5 text-black-90/55 font-normal">The BDE can revise this proposal to adjust the discount or pricing and re-submit.</span>
            </div>
          </div>
        )}

        {error && <p role="alert" className="mb-4 rounded-[7px] border-b-2 border-stroke/80 bg-alert/10 px-4 py-2 text-sm text-alert">{error}</p>}

        <form onSubmit={(event) => { event.preventDefault(); handleSave(false); }} className="flex flex-col gap-5">
          <section><h2 className="mb-3 text-sm font-bold text-black-90">Deal & Customer</h2><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {isView ? <TextInput label="Deal" name="dealName" value={quotation?.deal?.name || ''} disabled /> : <DropdownInput label="Deal" name="dealId" placeholder="Select Deal" options={dealOptions} value={form.dealId} onChange={selectDeal} required />}
            {isView ? <TextInput label="Account" name="accountName" value={quotation?.account?.name || ''} disabled /> : <TextInput label="Account" name="accountName" value={selectedDeal?.companyName || ''} disabled placeholder="Selected from Deal" />}
            {isView ? <TextInput label="Decision Maker / Contact" name="contactName" value={quotation?.contact?.name || ''} disabled /> : <DropdownInput label="Decision Maker / Contact" name="contactId" placeholder="Select Account Contact" options={contactOptions} value={form.contactId} onChange={(event) => updateField('contactId', event.target.value)} disabled={!selectedDeal?.accountId} required />}
          </div></section>
          <section><h2 className="mb-3 text-sm font-bold text-black-90">Quotation & Product</h2><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <TextInput label="Product" name="productName" value={form.productName} onChange={(event) => updateField('productName', event.target.value)} placeholder="Enter product name" disabled={isView} required />
            <TextInput label="Plan" name="planName" value={form.planName} onChange={(event) => updateField('planName', event.target.value)} placeholder="Enter plan name" disabled={isView} />
            <TextInput label="User Count" name="userCount" type="number" min="1" value={form.userCount} onChange={(event) => updateField('userCount', event.target.value)} placeholder="Enter user count" disabled={isView} required />
            <TextInput label="Unit Price (INR)" name="unitPrice" type="number" min="0" step="0.01" value={form.unitPrice} onChange={(event) => updateField('unitPrice', event.target.value)} placeholder="Enter unit price" disabled={isView} required />
            <DropdownInput label="Billing Frequency" name="billingFrequency" placeholder="Select frequency" options={FREQUENCIES} value={form.billingFrequency} onChange={(event) => updateField('billingFrequency', event.target.value)} disabled={isView} required />
            <TextInput label="Valid Until" name="validUntil" value={form.validUntil} onChange={(event) => updateField('validUntil', event.target.value)} placeholder="DD/MM/YYYY" disabled={isView} required />
            <TextInput label="Go-live Date" name="goLiveDate" value={form.goLiveDate} onChange={(event) => updateField('goLiveDate', event.target.value)} placeholder="DD/MM/YYYY" disabled={isView} />
            <TextInput label="Discount (%)" name="discountPercent" type="number" min="0" max="100" step="0.01" value={form.discountPercent} onChange={(event) => updateField('discountPercent', event.target.value)} placeholder="0–100" disabled={isView} />
            <TextInput label="Tax (%)" name="taxPercent" type="number" min="0" max="100" step="0.01" value={form.taxPercent} onChange={(event) => updateField('taxPercent', event.target.value)} placeholder="0–100" disabled={isView} />
            <TextInput label="Payment Terms" name="paymentTerms" value={form.paymentTerms} onChange={(event) => updateField('paymentTerms', event.target.value)} placeholder="Enter payment terms" disabled={isView} />
          </div></section>
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2"><TextAreaInput label="SLA Appendix" name="slaAppendix" value={form.slaAppendix} onChange={(event) => updateField('slaAppendix', event.target.value)} placeholder="Add SLA details" rows={3} disabled={isView} /><TextAreaInput label="Internal Notes" name="internalNotes" value={form.internalNotes} onChange={(event) => updateField('internalNotes', event.target.value)} placeholder="Add internal notes" rows={3} disabled={isView} /></section>
          {isView && <section className="grid grid-cols-1 gap-3 rounded-[7px] bg-gray p-4 sm:grid-cols-3 text-sm"><p><span className="text-black-90/60">Quotation:</span> <strong>{quotation?.code || '—'}</strong></p><p><span className="text-black-90/60">Status:</span> <strong>{quotation?.status || '—'}</strong></p><p><span className="text-black-90/60">Total:</span> <strong>{quotation?.expectedValue || '—'}</strong></p></section>}
          {!isView && <div className="flex flex-wrap justify-end gap-2 border-t border-stroke pt-4"><button type="button" onClick={() => navigate('/quotations')} className="rounded-[7px] border-b-2 border-stroke/80 bg-gray px-4 py-2 text-xs font-semibold hover:bg-gray/80 cursor-pointer">Cancel</button><button type="button" disabled={saving} onClick={() => handleSave(false)} className="rounded-[7px] border-b-2 border-stroke/80 bg-gray px-4 py-2 text-xs font-semibold hover:bg-gray/80 cursor-pointer disabled:opacity-50">{saving ? 'Saving…' : 'Save Draft'}</button><button type="button" disabled={saving} onClick={() => handleSave(true)} className="rounded-[7px] border-b-2 border-stroke/80 bg-primary px-4 py-2 text-xs font-semibold text-white-100 hover:bg-primary/90 cursor-pointer disabled:opacity-50">Submit for Approval</button></div>}
        </form>
      </div>

      {/* Quotation Approval / Rejection Modal (FRD 11.35, 11.36) */}
      <QuotationApprovalModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        quotation={quotation}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        loading={actionLoading}
      />
    </main>
  );
};

export default QuotationForm;
