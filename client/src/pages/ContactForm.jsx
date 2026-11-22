//===========================================================================================
//    CONTACT VIEW AND EDIT PAGE
// ===========================================================================================
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BackButton } from '../components/common/buttons/BackButton';
import { ContactAvatarPlaceholder } from '../components/common/avatar/ContactAvatarPlaceholder';
import { PhoneNumber } from '../components/common/inputs/PhoneNumber';
import { TextInput } from '../components/common/inputs/TextInput';
import { DropdownInput } from '../components/common/inputs/DropdownInput';
import { fetchContact, updateContact } from '../services/contactsService';
import { contactSchema } from '../utils/validationSchemas';
import { clearFieldError, focusFirstInvalidField, mapApiValidationErrors, validateForm } from '../utils/validationUtils';

/** Load and update a contact on a shared full-page View/Edit route. */
const ContactForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, mode: routeMode } = useParams();
  const mode = routeMode || (location.pathname.endsWith('/view') ? 'view' : 'edit');
  const isView = mode === 'view';
  const [contact, setContact] = useState(null);
  const [form, setForm] = useState({ name: '', designation: '', email: '', phone: '', isPrimary: false });
  const [loadedContactId, setLoadedContactId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const isLoading = loadedContactId !== id;

  // Fetch the contact and linked Account details whenever this page ID changes.
  useEffect(() => {
    let active = true;
    fetchContact(id)
      .then((result) => {
        if (!active) return;
        setContact(result);
        setForm({ name: result.name, designation: result.designation, email: result.email, phone: result.phone, isPrimary: result.isPrimary });
        setError('');
        setLoadedContactId(id);
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError.message || 'Unable to load contact.');
        setLoadedContactId(id);
      });
    return () => { active = false; };
  }, [id]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    clearFieldError(setFieldErrors, name);
  }, []);

  const handleSave = useCallback(async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const validation = await validateForm(contactSchema, form);
    if (Object.keys(validation.errors).length) {
      setFieldErrors(validation.errors);
      focusFirstInvalidField(formElement, validation.errors);
      return;
    }
    setFieldErrors({});
    try {
      setIsSaving(true);
      setError('');
      await updateContact(id, form);
      navigate('/contacts', { replace: true });
    } catch (saveError) {
      const serverErrors = mapApiValidationErrors(saveError.data?.errors);
      if (Object.keys(serverErrors).length) {
        setFieldErrors(serverErrors);
        focusFirstInvalidField(formElement, serverErrors);
      } else setError(saveError.message || 'Unable to save contact.');
    } finally {
      setIsSaving(false);
    }
  }, [form, id, navigate]);

  if (isLoading) return <div role="status" className="p-6 text-sm text-black-90/60">Loading contact…</div>;
  if (error && !contact) return <div role="alert" className="m-4 rounded-[7px] border-b-2 border-stroke/80 bg-alert/10 p-4 text-sm text-alert">{error}</div>;

  return (
    <div className="min-h-full w-full bg-gray p-4 sm:p-6">
      <section className="mx-auto w-full max-w-5xl rounded-[7px] bg-white-100 border-b-2 border-stroke/80">
        <header className="flex items-start justify-between gap-4 px-5 py-5 sm:px-8">
          <div>
            <h1 className="text-xl font-bold text-primary">{isView ? 'View Contact' : 'Edit Contact'}</h1>
            <p className="mt-1 text-sm text-black-90/60">Contact details linked to {contact?.companyName || 'the associated account'}.</p>
          </div>
          <ContactAvatarPlaceholder size="w-12 h-12" />
        </header>

        <form noValidate onSubmit={handleSave} className="flex flex-col gap-5 px-5 pb-5 sm:px-8">
          {error && <p role="alert" className="rounded-[7px] border-b-2 border-stroke/80 bg-alert/10 px-3 py-2 text-xs text-alert">{error}</p>}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput label="Contact Code" value={contact?.code || ''} readOnly disabled />
            <TextInput label="Full Name" name="name" placeholder="Enter contact name" value={form.name} onChange={handleChange} disabled={isView} required error={fieldErrors.name} />
            <TextInput label="Designation" name="designation" placeholder="Enter designation" value={form.designation} onChange={handleChange} disabled={isView} error={fieldErrors.designation} />
            <TextInput label="Email" name="email" type="email" placeholder="Enter email address" value={form.email} onChange={handleChange} disabled={isView} error={fieldErrors.email} />
            <PhoneNumber label="Contact Number" name="phone" placeholder="Enter phone number" value={form.phone} onChange={handleChange} disabled={isView} error={fieldErrors.phone} />
            <TextInput label="Linked Client" value={contact?.companyName || '—'} readOnly disabled />
            <DropdownInput label="Contact Role" name="isPrimary" value={String(form.isPrimary)} options={[{ value: 'true', label: 'Primary contact' }, { value: 'false', label: 'Contact' }]} onChange={(event) => { setForm((previous) => ({ ...previous, isPrimary: event.target.value === 'true' })); clearFieldError(setFieldErrors, 'isPrimary'); }} disabled={isView} error={fieldErrors.isPrimary} />
            <TextInput label="Active Deals" value={`${contact?.activeDeals ?? 0} (${contact?.activeDealValue ? `₹${Number(contact.activeDealValue).toLocaleString('en-IN')}` : '₹0'})`} readOnly disabled />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stroke/60 pt-4">
            <BackButton onClick={() => navigate('/contacts')} label="Back to Contacts" />
            <div className="flex items-center gap-2">
              {isView && <button type="button" onClick={() => navigate(`/contacts/${encodeURIComponent(id)}/edit`)} className="rounded-[7px] bg-primary px-4 py-2 text-xs font-semibold text-white-100 border-b-2 border-black-90/20 transition-colors hover:bg-primary/90 cursor-pointer">Edit Contact</button>}
              {!isView && <button type="submit" disabled={isSaving} className="rounded-[7px] bg-primary px-4 py-2 text-xs font-semibold text-white-100 border-b-2 border-black-90/20 transition-colors hover:bg-primary/90 disabled:opacity-60 cursor-pointer">{isSaving ? 'Saving…' : 'Save Contact'}</button>}
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ContactForm;
