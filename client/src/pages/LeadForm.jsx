//===========================================================================================
//    LEAD CREATE, VIEW, AND EDIT PAGE
//    Enterprise form shell with structured section cards and dynamic BDE assignment
// ===========================================================================================
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { BackButton } from '../components/common/buttons/BackButton';
import { AddLeadDrawer } from '../components/modules/leads/AddLeadDrawer';
import {
  createLead,
  deleteLeadDocument,
  downloadLeadDocument,
  fetchLead,
  fetchLeads,
  updateLead,
  updateLeadStatus,
  uploadLeadDocuments,
  viewLeadDocument,
} from '../services/leadsService';
import { useToast } from '../hooks/useToast';
import { mapApiValidationErrors } from '../utils/validationUtils';

/** Use one full-page form layout for creating, viewing, and editing leads. */
const LeadForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const { id, mode: routeMode } = useParams();
  const mode = id ? (routeMode || (location.pathname.endsWith('/view') ? 'view' : 'edit')) : 'create';
  const [lead, setLead] = useState(null);
  const [error, setError] = useState('');
  const [loadedLeadId, setLoadedLeadId] = useState(null);
  const [duplicateLeadState, setDuplicateLeadState] = useState({ id: null, lead: null });
  const [serverFieldErrors, setServerFieldErrors] = useState({});
  const isLoading = Boolean(id) && loadedLeadId !== id;
  const currentLead = loadedLeadId === id ? lead : null;
  const duplicateLead = duplicateLeadState.id === id ? duplicateLeadState.lead : null;

  useEffect(() => {
    if (!id) return undefined;
    let active = true;
    fetchLead(id)
      .then((result) => {
        if (!active) return;
        setLead(result);
        setError('');
        setLoadedLeadId(id);
      })
      .catch((fetchError) => {
        if (!active) return;
        setLead(null);
        setError(fetchError.message || 'Unable to load lead details.');
        setLoadedLeadId(id);
        toast(fetchError.message || 'Unable to load lead details.', 'error');
      });
    return () => { active = false; };
  }, [id, mode, toast]);

  const handleSave = useCallback(async (formData, files = [], remainingDocuments = []) => {
    try {
      setError('');
      setDuplicateLeadState({ id, lead: null });
      setServerFieldErrors({});
      const savedLead = mode === 'edit' && id ? await updateLead(id, formData) : await createLead(formData);
      const leadId = id || savedLead.id;
      const removed = (currentLead?.documents || []).filter((doc) => !remainingDocuments.some((item) => item.id === doc.id));
      try {
        for (const doc of removed) await deleteLeadDocument(leadId, doc.id);
        if (files.length) await uploadLeadDocuments(leadId, files);
      } catch (documentError) {
        setError(`Lead saved, but its documents were not fully saved: ${documentError.message}.`);
        if (mode !== 'edit') navigate(`/leads/${encodeURIComponent(leadId)}/edit`, { replace: true });
        toast(`Lead saved, but a document operation failed: ${documentError.message}. Select the documents again on the edit page.`, 'error');
        return;
      }
      toast(mode === 'edit' ? 'Lead updated successfully.' : 'Lead created successfully.');
      navigate('/leads', { replace: true });
    } catch (saveError) {
      const errors = mapApiValidationErrors(saveError.data?.errors || saveError.data?.error, {
        fullName: 'name', contactName: 'name', company: 'companyName',
      });
      setServerFieldErrors(errors);
      setError(Object.keys(errors).length ? '' : saveError.message || 'Unable to save lead.');
      if (!Object.keys(errors).length) toast(saveError.message || 'Unable to save lead.', 'error');
      if (saveError.status === 409) {
        try {
          const searches = [formData.email, formData.phone].filter(Boolean);
          for (const search of searches) {
            const { rows } = await fetchLeads({ search, limit: 100 });
            const match = rows.find((row) =>
              (formData.email && row.email?.toLowerCase() === formData.email.trim().toLowerCase()) ||
              (formData.phone && row.phone?.replace(/\D/g, '') === formData.phone.replace(/\D/g, ''))
            );
            if (match) { setDuplicateLeadState({ id, lead: match }); break; }
          }
        } catch {
          // Keep the API duplicate message visible if lookup is unavailable.
        }
      }
    }
  }, [id, mode, navigate, currentLead, toast]);

  const handleDeactivate = useCallback(async () => {
    try {
      await updateLeadStatus(id, 'Lost');
      toast('Lead deactivated successfully.');
      navigate('/leads', { replace: true });
    } catch (statusError) {
      setError(statusError.message || 'Unable to update lead status.');
      toast(statusError.message || 'Unable to update lead status.', 'error');
    }
  }, [id, navigate, toast]);

  const handleDownloadDocument = useCallback((documentId, name) => {
    downloadLeadDocument(id, documentId, name).catch((downloadError) => {
      setError(downloadError.message || 'Unable to download document.');
      toast(downloadError.message || 'Unable to download document.', 'error');
    });
  }, [id, toast]);

  const handleViewDocument = useCallback((documentId) => {
    viewLeadDocument(id, documentId).catch((viewError) => {
      setError(viewError.message || 'Unable to preview document.');
      toast(viewError.message || 'Unable to preview document.', 'error');
    });
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <div className="w-8 h-8 border-4 border-stroke border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-gray p-3 sm:p-5 lg:p-6 overflow-y-auto no-scrollbar">
      {/* Breadcrumb & Navigation Bar */}
      <div className="mx-auto w-full max-w-5xl mb-3 flex items-center justify-between text-xs text-black-90/50">
        <div className="flex items-center gap-3">
          <BackButton onClick={() => navigate('/leads')} label="Back to Leads" />
          <div className="flex items-center gap-1.5 font-medium">
            <button
              type="button"
              onClick={() => navigate('/leads')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Lead Management
            </button>
            <ChevronRight size={12} className="text-black-90/40" />
            <span className="text-black-90 font-semibold">
              {mode === 'create'
                ? 'Add New Lead'
                : mode === 'edit'
                  ? `Edit Lead (${currentLead?.code || ''})`
                  : `View Lead (${currentLead?.code || ''})`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Form Container Card */}
      <div className="mx-auto min-h-full w-full max-w-5xl rounded-[7px] bg-white-100 border-b-2 border-stroke/80 overflow-hidden">
        <AddLeadDrawer
          isOpen
          presentation="page"
          onClose={() => navigate('/leads')}
          onSave={handleSave}
          saveError={error}
          serverErrors={serverFieldErrors}
          duplicateLead={duplicateLead}
          onOpenDuplicate={(duplicate) => navigate(`/leads/${encodeURIComponent(duplicate.id)}/view`)}
          onDeactivate={handleDeactivate}
          onConvert={() => navigate(`/leads/${encodeURIComponent(id)}/convert`)}
          initialData={currentLead ? { ...currentLead, onDownloadDocument: handleDownloadDocument, onViewDocument: handleViewDocument } : currentLead}
          mode={mode}
        />
      </div>
    </div>
  );
};

export default LeadForm;
