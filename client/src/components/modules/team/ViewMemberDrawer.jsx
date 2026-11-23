//===========================================================================================
//    TEAM MEMBER DETAIL DRAWER (FRD 11.25)
//    Detailed performance telemetry, work summary, and module quick navigation
//    Strict Flat Design: no drop shadows, 7px radius, 2px bottom border in stroke/80
// ===========================================================================================
import React, { useState, useEffect, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Shield,
  Briefcase,
  TrendingUp,
  FileText,
  Clock,
  Layers,
  Users,
  Building,
  ExternalLink,
  UserX,
  Edit2,
  Check,
} from 'lucide-react';
import { Drawer } from '../../common/sidebar/Drawer';
import { DropdownInput } from '../../common/inputs/DropdownInput';
import { fetchTeamMemberDetail, updateTeamMember, deactivateTeamMember } from '../../../services/teamService';
import { formatCurrency } from '../../../utils/formatters';
import { useToast } from '../../../hooks/useToast';

const ROLE_OPTIONS = [
  { value: 'BDE', label: 'BDE' },
  { value: 'Sales Executive', label: 'Sales Executive' },
  { value: 'Senior Sales Executive', label: 'Senior Sales Executive' },
  { value: 'Sales Manager', label: 'Sales Manager' },
];

export const ViewMemberDrawer = memo(({
  isOpen = false,
  onClose,
  member = null,
  allTeamMembers = [],
  onMemberUpdated,
}) => {
  const navigate = useNavigate();
  const toast = useToast();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRole, setEditRole] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Deactivation confirmation modal state
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [reassignUserId, setReassignUserId] = useState('');

  // Fetch full telemetry when opened
  useEffect(() => {
    if (isOpen && member?.id) {
      setLoading(true);
      setIsEditing(false);
      setShowDeactivateModal(false);
      fetchTeamMemberDetail(member.id)
        .then((res) => {
          setDetail(res);
          setEditRole(res.role || 'BDE');
          setEditPhone(res.phone || '');
        })
        .catch(() => setDetail(member))
        .finally(() => setLoading(false));
    }
  }, [isOpen, member]);

  // Handle Save Edit
  const handleSaveEdit = useCallback(async () => {
    if (!detail?.id) return;
    setActionLoading(true);
    try {
      const updated = await updateTeamMember(detail.id, { role: editRole, phone: editPhone });
      setDetail(updated);
      setIsEditing(false);
      toast('Team member details updated successfully.', 'success');
      onMemberUpdated?.();
    } catch (err) {
      toast(err.message || 'Failed to update details.', 'error');
    } finally {
      setActionLoading(false);
    }
  }, [detail?.id, editRole, editPhone, toast, onMemberUpdated]);

  // Handle Deactivate Confirm
  const handleConfirmDeactivate = useCallback(async () => {
    if (!detail?.id) return;
    setActionLoading(true);
    try {
      await deactivateTeamMember(detail.id, { reassignToUserId: reassignUserId });
      toast('Team member deactivated and workloads safely reassigned.', 'success');
      setShowDeactivateModal(false);
      onMemberUpdated?.();
      onClose();
    } catch (err) {
      toast(err.message || 'Deactivation failed.', 'error');
    } finally {
      setActionLoading(false);
    }
  }, [detail?.id, reassignUserId, toast, onMemberUpdated, onClose]);

  if (!isOpen) return null;

  const currentMember = detail || member;
  const workSummary = currentMember?.workSummary || {
    assignedLeads: currentMember?.leads || currentMember?.assignedLeads || 0,
    activeDeals: currentMember?.deals || currentMember?.activeDeals || 0,
    managedAccounts: 0,
    linkedContacts: 0,
    pendingFollowups: 0,
    conversionRate: 0,
    activePipelineValue: 0,
  };

  const otherActiveMembers = allTeamMembers
    .filter((m) => m.id !== currentMember?.id && m.status === 'Active')
    .map((m) => ({ value: m.id, label: `${m.name} (${m.role})` }));

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Team Member Detail"
      subtitle="View employee profile, live pipeline telemetry, and workload distribution."
      maxWidth="max-w-[560px]"
    >
      <div className="flex flex-col gap-5 p-5 text-xs text-black-90">
        {loading ? (
          <div className="py-16 text-center text-sm text-black-90/60" role="status">Loading member details…</div>
        ) : (
          <>
            {/* Top Identity Card */}
            <div className="flex items-center gap-4 p-4 rounded-[7px] border-b-2 border-stroke/80 bg-gray">
              <div className="w-14 h-14 rounded-full overflow-hidden border-none shrink-0 bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                {currentMember?.avatar ? (
                  <img src={currentMember.avatar} alt={currentMember.name} className="w-full h-full object-cover" />
                ) : (
                  currentMember?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'TM'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-black-90 truncate">{currentMember?.name}</h3>
                  <span className={`px-2 py-0.5 rounded-[7px] text-[11px] font-semibold ${
                    currentMember?.status === 'Active' ? 'bg-success/10 text-success' : 'bg-gray text-black-90/60'
                  }`}>
                    {currentMember?.status || 'Active'}
                  </span>
                </div>
                <p className="text-xs text-black-90/60 font-medium mt-0.5">
                  ID: <span className="font-semibold text-black-90">{currentMember?.code || currentMember?.id}</span> · {currentMember?.role}
                </p>
                <p className="text-[11px] text-black-90/50 mt-0.5">
                  Supervisor: <span className="font-semibold text-black-90">{currentMember?.supervisor?.name || 'Marcus Vance'}</span>
                </p>
              </div>
            </div>

            {/* Basic Information */}
            <section className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-black-90 uppercase tracking-wider text-[11px]">Basic Information</h4>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                    title="Edit role or phone"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="text-[11px] text-black-90/60 hover:underline cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-success hover:underline cursor-pointer"
                    >
                      <Check size={12} /> Save
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-[7px] border-b-2 border-stroke/80 bg-white-100">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-black-90/40 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-black-90/50 block">Corporate Email</span>
                    <span className="font-semibold text-black-90 truncate block" title={currentMember?.email}>
                      {currentMember?.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-black-90/40 shrink-0" />
                  <div>
                    <span className="text-[10px] text-black-90/50 block">Phone</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full bg-gray px-2 py-1 rounded-[7px] border-b-2 border-stroke/80 text-xs"
                      />
                    ) : (
                      <span className="font-semibold text-black-90">{currentMember?.phone || '—'}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:col-span-2">
                  <Shield size={14} className="text-black-90/40 shrink-0" />
                  <div className="flex-1">
                    <span className="text-[10px] text-black-90/50 block">Primary Role</span>
                    {isEditing ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="w-full bg-gray px-2 py-1 rounded-[7px] border-b-2 border-stroke/80 text-xs mt-0.5"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="font-semibold text-black-90">{currentMember?.role || '—'}</span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Work Summary & Pipeline Allocation (Live Telemetry) */}
            <section className="flex flex-col gap-2.5">
              <h4 className="font-bold text-black-90 uppercase tracking-wider text-[11px]">Work Summary & Pipeline Allocation</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-[7px] border-b-2 border-stroke/80 bg-gray">
                  <span className="text-[10px] text-black-90/50 block">Assigned Leads</span>
                  <strong className="text-base font-bold text-black-90">{workSummary.assignedLeads}</strong>
                </div>

                <div className="p-3 rounded-[7px] border-b-2 border-stroke/80 bg-gray">
                  <span className="text-[10px] text-black-90/50 block">Active Deals</span>
                  <strong className="text-base font-bold text-black-90">{workSummary.activeDeals}</strong>
                </div>

                <div className="p-3 rounded-[7px] border-b-2 border-stroke/80 bg-gray">
                  <span className="text-[10px] text-black-90/50 block">Conversion Rate</span>
                  <strong className="text-base font-bold text-success">{workSummary.conversionRate}%</strong>
                </div>

                <div className="p-3 rounded-[7px] border-b-2 border-stroke/80 bg-gray">
                  <span className="text-[10px] text-black-90/50 block">Accounts Managed</span>
                  <strong className="text-base font-bold text-black-90">{workSummary.managedAccounts}</strong>
                </div>

                <div className="p-3 rounded-[7px] border-b-2 border-stroke/80 bg-gray">
                  <span className="text-[10px] text-black-90/50 block">Linked Contacts</span>
                  <strong className="text-base font-bold text-black-90">{workSummary.linkedContacts}</strong>
                </div>

                <div className="p-3 rounded-[7px] border-b-2 border-stroke/80 bg-gray">
                  <span className="text-[10px] text-black-90/50 block">Pending Tasks</span>
                  <strong className="text-base font-bold text-warning">{workSummary.pendingFollowups}</strong>
                </div>

                {workSummary.activePipelineValue > 0 && (
                  <div className="p-3 rounded-[7px] border-b-2 border-stroke/80 bg-primary/10 col-span-2 sm:col-span-3 flex items-center justify-between">
                    <span className="text-xs text-primary font-semibold">Active Pipeline ARR</span>
                    <strong className="text-sm font-bold text-primary">{formatCurrency(workSummary.activePipelineValue, '₹')}</strong>
                  </div>
                )}
              </div>
            </section>

            {/* Module Quick Navigation (1-Click Deep Links) */}
            <section className="flex flex-col gap-2.5">
              <h4 className="font-bold text-black-90 uppercase tracking-wider text-[11px]">Module Quick Navigation</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { onClose(); navigate(`/leads?search=${encodeURIComponent(currentMember?.name || '')}`); }}
                  title="View leads assigned to this executive"
                  className="cursor-pointer flex items-center justify-between p-2.5 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 hover:bg-gray transition-colors text-left"
                >
                  <span className="font-semibold text-black-90 flex items-center gap-1.5">
                    <Layers size={13} className="text-primary" /> View Leads
                  </span>
                  <ExternalLink size={12} className="text-black-90/40" />
                </button>

                <button
                  type="button"
                  onClick={() => { onClose(); navigate(`/deals?search=${encodeURIComponent(currentMember?.name || '')}`); }}
                  title="View deals owned by this executive"
                  className="cursor-pointer flex items-center justify-between p-2.5 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 hover:bg-gray transition-colors text-left"
                >
                  <span className="font-semibold text-black-90 flex items-center gap-1.5">
                    <TrendingUp size={13} className="text-secondary" /> View Deals
                  </span>
                  <ExternalLink size={12} className="text-black-90/40" />
                </button>

                <button
                  type="button"
                  onClick={() => { onClose(); navigate(`/clients?search=${encodeURIComponent(currentMember?.name || '')}`); }}
                  title="View accounts associated with this executive"
                  className="cursor-pointer flex items-center justify-between p-2.5 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 hover:bg-gray transition-colors text-left"
                >
                  <span className="font-semibold text-black-90 flex items-center gap-1.5">
                    <Building size={13} className="text-primary" /> View Accounts
                  </span>
                  <ExternalLink size={12} className="text-black-90/40" />
                </button>

                <button
                  type="button"
                  onClick={() => { onClose(); navigate(`/contacts?search=${encodeURIComponent(currentMember?.name || '')}`); }}
                  title="View contacts associated with this executive"
                  className="cursor-pointer flex items-center justify-between p-2.5 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 hover:bg-gray transition-colors text-left"
                >
                  <span className="font-semibold text-black-90 flex items-center gap-1.5">
                    <Users size={13} className="text-primary" /> View Contacts
                  </span>
                  <ExternalLink size={12} className="text-black-90/40" />
                </button>
              </div>
            </section>

            {/* Deactivation Modal / Workflow */}
            {showDeactivateModal && (
              <div className="p-4 rounded-[7px] border-b-2 border-alert/30 bg-alert/5 flex flex-col gap-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-alert font-bold">
                  <UserX size={16} /> Deactivate Team Member
                </div>
                <p className="text-xs text-black-90/70">
                  Deactivating this member will stop automatic lead round-robin assignment.
                  {workSummary.assignedLeads > 0 || workSummary.activeDeals > 0 ? (
                    <span className="block mt-1 font-semibold text-black-90">
                      This member has {workSummary.assignedLeads} active leads and {workSummary.activeDeals} open deals.
                      Select an active BDE to safely reassign their workloads:
                    </span>
                  ) : (
                    ' Are you sure you want to proceed?'
                  )}
                </p>

                {(workSummary.assignedLeads > 0 || workSummary.activeDeals > 0) && (
                  <DropdownInput
                    label="Reassign Workloads To"
                    placeholder="Select active BDE"
                    options={otherActiveMembers}
                    value={reassignUserId}
                    onChange={(e) => setReassignUserId(e.target.value)}
                  />
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDeactivateModal(false)}
                    className="cursor-pointer px-3 py-1.5 rounded-[7px] border-b-2 border-stroke/80 bg-gray text-xs font-semibold text-black-90"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDeactivate}
                    disabled={actionLoading}
                    className="cursor-pointer px-3.5 py-1.5 rounded-[7px] border-b-2 border-black-90/20 bg-alert text-xs font-semibold text-white-100 hover:bg-alert/90 disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing…' : 'Confirm Deactivation'}
                  </button>
                </div>
              </div>
            )}

            {/* Drawer Actions */}
            <div className="flex items-center justify-between border-t border-stroke/50 pt-4 mt-2">
              {currentMember?.status === 'Active' && !showDeactivateModal && (
                <button
                  type="button"
                  onClick={() => setShowDeactivateModal(true)}
                  className="cursor-pointer text-alert hover:underline text-xs font-semibold flex items-center gap-1"
                  title="Deactivate this team member"
                >
                  <UserX size={13} /> Deactivate Member
                </button>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer rounded-[7px] border-b-2 border-stroke/80 bg-gray px-4 py-2 text-xs font-semibold text-black-90 hover:bg-gray/80 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
});

ViewMemberDrawer.displayName = 'ViewMemberDrawer';
export default ViewMemberDrawer;
