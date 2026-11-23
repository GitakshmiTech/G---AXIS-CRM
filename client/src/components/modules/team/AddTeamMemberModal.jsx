//===========================================================================================
//    ADD NEW SALES TEAM MEMBER MODAL (FRD 11.24)
//    Modal popup to provision a new BDE or Sales Executive to the manager's team
//    Strict Flat Design: no drop shadows, 7px radius, 2px bottom border in stroke/80
// ===========================================================================================
import React, { memo, useState, useCallback, useEffect } from 'react';
import { UserPlus, X } from 'lucide-react';
import { TextInput } from '../../common/inputs/TextInput';
import { DropdownInput } from '../../common/inputs/DropdownInput';
import { TextAreaInput } from '../quotations/TextAreaInput';
import { fetchTerritories, createTeamMember } from '../../../services/teamService';
import { useToast } from '../../../hooks/useToast';

const ROLE_OPTIONS = [
  { value: 'BDE', label: 'BDE' },
  { value: 'Sales Executive', label: 'Sales Executive' },
  { value: 'Senior Sales Executive', label: 'Senior Sales Executive' },
];

const INITIAL_FORM = {
  name: '',
  employeeCode: '',
  role: 'BDE',
  email: '',
  phone: '',
  territory: '',
  notes: '',
};

export const AddTeamMemberModal = memo(({
  isOpen = false,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [form, setForm] = useState(INITIAL_FORM);
  const [territoryOptions, setTerritoryOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load territories on open
  useEffect(() => {
    if (isOpen) {
      setForm(INITIAL_FORM);
      setError('');
      fetchTerritories().then((list) => {
        setTerritoryOptions((list || []).map((t) => ({ value: t, label: t })));
      });
    }
  }, [isOpen]);

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Full Legal Name is required.');
    if (!form.email.trim() || !form.email.includes('@')) return setError('Valid Corporate Email is required.');

    setLoading(true);
    setError('');
    try {
      await createTeamMember(form);
      toast('Sales team member provisioned and invitation sent successfully.', 'success');
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add team member. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [form, onSuccess, onClose, toast]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[540px] rounded-[7px] border-b-2 border-stroke/80 bg-white-100 p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-stroke/50 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[7px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <UserPlus size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-black-90">Add New Sales Team Member</h3>
              <p className="text-xs text-black-90/55 font-medium">
                Provision a new BDE or Sales Executive into your reporting team.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close dialog"
            className="cursor-pointer rounded-[7px] p-1 text-black-90/50 hover:bg-gray transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div role="alert" className="p-3 rounded-[7px] border-b-2 border-alert/30 bg-alert/10 text-alert text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput
              label="Full Legal Name"
              name="name"
              placeholder="e.g. Rohan Sharma"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
            <TextInput
              label="Employee ID (Optional)"
              name="employeeCode"
              placeholder="e.g. EMP-004"
              value={form.employeeCode}
              onChange={(e) => handleChange('employeeCode', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput
              label="Corporate Email"
              name="email"
              type="email"
              placeholder="e.g. rohan.sharma@gitakshmi.com"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
            <TextInput
              label="Direct Business Phone"
              name="phone"
              placeholder="e.g. +91 9876543210"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DropdownInput
              label="Primary Role"
              name="role"
              placeholder="Select Role"
              options={ROLE_OPTIONS}
              value={form.role}
              onChange={(e) => handleChange('role', e.target.value)}
              required
            />
            <DropdownInput
              label="Territory / State Allocation"
              name="territory"
              placeholder="Select Territory"
              options={territoryOptions}
              value={form.territory}
              onChange={(e) => handleChange('territory', e.target.value)}
            />
          </div>

          <TextAreaInput
            label="Internal Onboarding Notes"
            name="notes"
            placeholder="Add handover or territory focus notes..."
            rows={2}
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
          />

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2.5 border-t border-stroke/50 pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="cursor-pointer rounded-[7px] border-b-2 border-stroke/80 bg-gray px-4 py-2 text-xs font-semibold text-black-90 hover:bg-gray/80 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer rounded-[7px] border-b-2 border-black-90/20 bg-primary px-5 py-2 text-xs font-semibold text-white-100 hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Provisioning…' : 'Confirm & Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

AddTeamMemberModal.displayName = 'AddTeamMemberModal';
export default AddTeamMemberModal;
