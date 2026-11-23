//===========================================================================================
//    TEAM MEMBER DETAIL PAGE (FRD 11.25)
//    Full-page employee profile, real-time pipeline telemetry, workload distribution, and safe management
//    Strict Flat Design: 100% border-only, no drop shadows, 7px radius, 2px bottom border in stroke/80
// ===========================================================================================
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mail,
  Phone,
  Shield,
  Layers,
  TrendingUp,
  Building,
  Users,
  Clock,
  ExternalLink,
  Edit2,
  Check,
  X,
  UserX,
  Copy,
  CheckCheck,
  Award,
  Calendar,
  MapPin,
  Briefcase,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { BackButton } from '../components/common/buttons/BackButton';
import { DropdownInput } from '../components/common/inputs/DropdownInput';
import { PhoneNumber } from '../components/common/inputs/PhoneNumber';
import { TextInput } from '../components/common/inputs/TextInput';
import {
  fetchTeamMemberDetail,
  fetchTeamMembers,
  updateTeamMember,
  deactivateTeamMember,
} from '../services/teamService';
import { formatCurrency } from '../utils/formatters';
import { formatDateDDMMYYYY } from '../utils/dateUtils';
import { useToast } from '../hooks/useToast';

// Role options according to FRD Section 11
const ROLE_OPTIONS = [
  { value: 'BDE', label: 'BDE' },
  { value: 'Sales Executive', label: 'Sales Executive' },
  { value: 'Senior Sales Executive', label: 'Senior Sales Executive' },
  { value: 'Sales Manager', label: 'Sales Manager' },
];

export const TeamMemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Inline editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editRole, setEditRole] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editTerritory, setEditTerritory] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Deactivation with safe workload reassignment
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [activePeers, setActivePeers] = useState([]);
  const [reassignUserId, setReassignUserId] = useState('');

  //===========================================================================================
  //    DATA FETCHING
  // ===========================================================================================
  const loadMemberDetail = useCallback(() => {
    if (!id) return;
    setLoading(true);
    setError('');

    fetchTeamMemberDetail(id)
      .then((res) => {
        setDetail(res);
        setEditRole(res?.role || 'BDE');
        setEditPhone(res?.phone || res?.contact || '');
        setEditTerritory(res?.territory || 'North Region');
      })
      .catch((err) => {
        setError(err.message || 'Unable to load team member telemetry.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    loadMemberDetail();
  }, [loadMemberDetail]);

  // Load active peers for reassignment dropdown
  useEffect(() => {
    if (showDeactivateModal) {
      fetchTeamMembers({ page: 1, limit: 100, status: 'Active' })
        .then((res) => {
          const peers = (res.rows || [])
            .filter((m) => String(m.id) !== String(id))
            .map((m) => ({ value: String(m.id), label: `${m.name} (${m.role})` }));
          setActivePeers(peers);
          if (peers.length > 0) {
            setReassignUserId(peers[0].value);
          }
        })
        .catch(() => {});
    }
  }, [showDeactivateModal, id]);

  //===========================================================================================
  //    HANDLERS: COPY, EDIT & DEACTIVATE
  // ===========================================================================================
  const handleCopyEmail = useCallback(() => {
    if (detail?.email) {
      navigator.clipboard.writeText(detail.email);
      setCopiedEmail(true);
      toast('Corporate email copied to clipboard.', 'success');
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  }, [detail?.email, toast]);

  const handleSaveEdit = useCallback(async () => {
    if (!detail?.id) return;
    setActionLoading(true);
    try {
      const updated = await updateTeamMember(detail.id, {
        role: editRole,
        phone: editPhone,
        territory: editTerritory,
      });
      setDetail((prev) => ({
        ...prev,
        ...updated,
        role: editRole,
        phone: editPhone,
        territory: editTerritory,
      }));
      setIsEditing(false);
      toast('Team member details updated successfully.', 'success');
    } catch (err) {
      toast(err.message || 'Failed to update details.', 'error');
    } finally {
      setActionLoading(false);
    }
  }, [detail?.id, editRole, editPhone, editTerritory, toast]);

  const handleConfirmDeactivate = useCallback(async () => {
    if (!detail?.id) return;
    setActionLoading(true);
    try {
      await deactivateTeamMember(detail.id, { reassignToUserId: reassignUserId });
      toast('Team member deactivated and active workloads safely reassigned.', 'success');
      setShowDeactivateModal(false);
      loadMemberDetail();
    } catch (err) {
      toast(err.message || 'Deactivation failed.', 'error');
    } finally {
      setActionLoading(false);
    }
  }, [detail?.id, reassignUserId, toast, loadMemberDetail]);

  // Telemetry metric values
  const workSummary = useMemo(() => {
    return detail?.workSummary || {
      assignedLeads: detail?.assignedLeads ?? detail?.leads ?? 0,
      activeDeals: detail?.activeDeals ?? detail?.deals ?? 0,
      managedAccounts: 0,
      linkedContacts: 0,
      pendingFollowups: 0,
      conversionRate: 0,
      activePipelineValue: 0,
    };
  }, [detail]);

  const memberName = detail?.name || 'Team Member';
  const memberCode = detail?.code || detail?.id || '—';
  const memberInitials = useMemo(() => {
    return memberName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [memberName]);

  return (
    <div className="w-full flex-1 flex flex-col select-text gap-4 pb-16">
      {/* ===========================================================================================
          TOP NAVIGATION & HEADER ACTIONS
      =========================================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <BackButton onClick={() => navigate('/team')} label="Back to Team" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-black-90">Team Member Detail</h1>
            <p className="text-xs text-black-90/60 mt-0.5">
              Live performance telemetry, pipeline workload, and domain assignments.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={loading}
              title="Edit role and contact phone"
              className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 hover:bg-gray text-xs font-semibold text-black-90 transition-colors"
            >
              <Edit2 size={13} className="text-primary" />
              <span>Edit Details</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditRole(detail?.role || 'BDE');
                  setEditPhone(detail?.phone || detail?.contact || '');
                  setEditTerritory(detail?.territory || 'North Region');
                }}
                disabled={actionLoading}
                className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 rounded-[7px] border-b-2 border-stroke/80 bg-gray text-xs font-semibold text-black-90 hover:bg-gray/80"
              >
                <X size={12} /> Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={actionLoading}
                className="cursor-pointer inline-flex items-center gap-1 px-3.5 py-1.5 rounded-[7px] border-b-2 border-success/80 bg-success text-xs font-bold text-white-100 hover:bg-success/90"
              >
                <Check size={12} /> {actionLoading ? 'Saving…' : 'Save'}
              </button>
            </div>
          )}

          {detail?.status === 'Active' && (
            <button
              type="button"
              onClick={() => setShowDeactivateModal(true)}
              disabled={loading || actionLoading}
              title="Safely deactivate and reassign workloads"
              className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[7px] border-b-2 border-alert/30 bg-alert/10 hover:bg-alert/15 text-xs font-semibold text-alert transition-colors"
            >
              <UserX size={13} />
              <span>Deactivate</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white-100 rounded-[7px] border-b-2 border-stroke/80">
          <div className="w-9 h-9 border-4 border-stroke border-t-primary rounded-full animate-spin" />
          <p className="text-xs text-black-90/60 font-medium mt-3">Loading team member telemetry…</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-alert/5 rounded-[7px] border-b-2 border-alert/30 text-center">
          <p className="text-sm font-semibold text-alert">{error}</p>
          <button
            type="button"
            onClick={loadMemberDetail}
            className="mt-3 cursor-pointer px-4 py-1.5 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 text-xs font-semibold text-black-90"
          >
            Retry Loading
          </button>
        </div>
      ) : (
        <>
          {/* ===========================================================================================
              TOP MEMBER IDENTITY BANNER (STRICT FLAT & CIRCULAR BORDERLESS AVATAR)
          =========================================================================================== */}
          <div className="p-5 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              {/* Circular Borderless Profile Photo (Rule #24) */}
              <div
                data-preserve-radius="true"
                className="w-16 h-16 rounded-full overflow-hidden border-none shrink-0 bg-primary/10 flex items-center justify-center text-primary font-bold text-xl select-none"
              >
                {detail?.avatar ? (
                  <img src={detail.avatar} alt={memberName} className="w-full h-full object-cover" />
                ) : (
                  memberInitials
                )}
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-bold text-black-90 leading-none">{memberName}</h2>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-[7px] text-[11px] font-semibold whitespace-nowrap ${
                      detail?.status === 'Active'
                        ? 'bg-success/10 text-success'
                        : 'bg-gray text-black-90/60'
                    }`}
                  >
                    {detail?.status || 'Active'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-[7px] text-[11px] font-semibold bg-primary/10 text-primary whitespace-nowrap">
                    {detail?.role}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-2 text-xs text-black-90/60 flex-wrap">
                  <span>
                    Employee Code: <strong className="font-semibold text-black-90">{memberCode}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Reporting To:{' '}
                    <strong className="font-semibold text-black-90">
                      {detail?.supervisor?.name || 'Marcus Vance (Sales Manager)'}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    Territory:{' '}
                    <strong className="font-semibold text-black-90">{detail?.territory || 'North Region'}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick ARR Badge */}
            {workSummary.activePipelineValue > 0 && (
              <div className="self-start md:self-auto p-3 rounded-[7px] border-b-2 border-stroke/80 bg-primary/5 flex flex-col items-start md:items-end">
                <span className="text-[11px] font-medium text-black-90/60">Active Pipeline ARR</span>
                <strong className="text-lg font-bold text-primary">
                  {formatCurrency(workSummary.activePipelineValue, '₹')}
                </strong>
              </div>
            )}
          </div>

          {/* ===========================================================================================
              KPI TELEMETRY GRID (LIVE PIPELINE TELEMETRY)
          =========================================================================================== */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 flex flex-col justify-between">
              <span className="text-[11px] text-black-90/50 font-medium">Assigned Leads</span>
              <strong className="text-xl font-bold text-black-90 mt-1">{workSummary.assignedLeads}</strong>
              <span className="text-[10px] text-black-90/40 mt-1">Live allocation</span>
            </div>

            <div className="p-3.5 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 flex flex-col justify-between">
              <span className="text-[11px] text-black-90/50 font-medium">Active Deals</span>
              <strong className="text-xl font-bold text-secondary mt-1">{workSummary.activeDeals}</strong>
              <span className="text-[10px] text-black-90/40 mt-1">Negotiation / Pipeline</span>
            </div>

            <div className="p-3.5 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 flex flex-col justify-between">
              <span className="text-[11px] text-black-90/50 font-medium">Conversion Rate</span>
              <strong className="text-xl font-bold text-success mt-1">{workSummary.conversionRate}%</strong>
              <span className="text-[10px] text-success/80 mt-1">Lead to Deal win</span>
            </div>

            <div className="p-3.5 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 flex flex-col justify-between">
              <span className="text-[11px] text-black-90/50 font-medium">Accounts Managed</span>
              <strong className="text-xl font-bold text-black-90 mt-1">{workSummary.managedAccounts}</strong>
              <span className="text-[10px] text-black-90/40 mt-1">Active client portfolios</span>
            </div>

            <div className="p-3.5 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 flex flex-col justify-between">
              <span className="text-[11px] text-black-90/50 font-medium">Linked Contacts</span>
              <strong className="text-xl font-bold text-black-90 mt-1">{workSummary.linkedContacts}</strong>
              <span className="text-[10px] text-black-90/40 mt-1">Stakeholder network</span>
            </div>

            <div className="p-3.5 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 flex flex-col justify-between">
              <span className="text-[11px] text-black-90/50 font-medium">Pending Tasks</span>
              <strong className="text-xl font-bold text-warning mt-1">{workSummary.pendingFollowups}</strong>
              <span className="text-[10px] text-warning/80 mt-1">Follow-ups due</span>
            </div>
          </div>

          {/* ===========================================================================================
              TWO-COLUMN RESPONSIVE SECTION: PROFILE INFORMATION & MODULE QUICK NAVIGATION
          =========================================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Card: Basic Information & Profile */}
            <div className="p-5 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-stroke/40 pb-3">
                <h3 className="font-bold text-black-90 text-sm flex items-center gap-2">
                  <Briefcase size={16} className="text-primary" />
                  <span>Basic Information & Role</span>
                </h3>
                <span className="text-xs text-black-90/50 font-medium">Corporate Profile</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Corporate Email */}
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-xs font-semibold text-black-90">Corporate Email</label>
                  <div className="flex items-center justify-between w-full h-[40px] px-3 bg-gray border-b-2 border-stroke/80 rounded-[7px] text-xs text-black-90 font-medium">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail size={14} className="text-black-90/40 shrink-0" />
                      <span className="truncate" title={detail?.email}>{detail?.email || '—'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      title="Copy Email"
                      className="cursor-pointer p-1 rounded hover:bg-white-100 transition-colors text-black-90/60 hover:text-black-90 shrink-0"
                    >
                      {copiedEmail ? <CheckCheck size={14} className="text-success" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                {/* Contact Phone (Mobile Number) */}
                {isEditing ? (
                  <PhoneNumber
                    label="Contact Phone"
                    name="phone"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder=""
                  />
                ) : (
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-xs font-semibold text-black-90">Contact Phone</label>
                    <div className="flex items-center gap-2 w-full h-[40px] px-3 bg-gray border-b-2 border-stroke/80 rounded-[7px] text-xs text-black-90 font-medium">
                      <Phone size={14} className="text-black-90/40 shrink-0" />
                      <span>{detail?.phone || detail?.contact || '—'}</span>
                    </div>
                  </div>
                )}

                {/* Primary CRM Role */}
                {isEditing ? (
                  <DropdownInput
                    label="Primary CRM Role"
                    name="role"
                    value={editRole}
                    options={ROLE_OPTIONS}
                    onChange={(e) => setEditRole(e.target.value)}
                    placeholder=""
                  />
                ) : (
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-xs font-semibold text-black-90">Primary CRM Role</label>
                    <div className="flex items-center gap-2 w-full h-[40px] px-3 bg-gray border-b-2 border-stroke/80 rounded-[7px] text-xs text-black-90 font-medium">
                      <Shield size={14} className="text-primary shrink-0" />
                      <span>{detail?.role || '—'}</span>
                    </div>
                  </div>
                )}

                {/* Reporting Manager */}
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-xs font-semibold text-black-90">Reporting Manager</label>
                  <div className="flex items-center gap-2 w-full h-[40px] px-3 bg-gray border-b-2 border-stroke/80 rounded-[7px] text-xs text-black-90 font-medium">
                    <UserCheck size={14} className="text-black-90/40 shrink-0" />
                    <span className="truncate">{detail?.supervisor?.name || 'Marcus Vance (Sales Manager)'}</span>
                  </div>
                </div>

                {/* Assigned Territory */}
                {isEditing ? (
                  <TextInput
                    label="Assigned Territory"
                    name="territory"
                    value={editTerritory}
                    onChange={(e) => setEditTerritory(e.target.value)}
                    placeholder=""
                  />
                ) : (
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-xs font-semibold text-black-90">Assigned Territory</label>
                    <div className="flex items-center gap-2 w-full h-[40px] px-3 bg-gray border-b-2 border-stroke/80 rounded-[7px] text-xs text-black-90 font-medium">
                      <MapPin size={14} className="text-black-90/40 shrink-0" />
                      <span>{detail?.territory || 'North Region'}</span>
                    </div>
                  </div>
                )}

                {/* Joined Date */}
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-xs font-semibold text-black-90">Joined Date</label>
                  <div className="flex items-center gap-2 w-full h-[40px] px-3 bg-gray border-b-2 border-stroke/80 rounded-[7px] text-xs text-black-90 font-medium">
                    <Calendar size={14} className="text-black-90/40 shrink-0" />
                    <span>
                      {formatDateDDMMYYYY(detail?.createdAt || detail?.joinedDate || new Date().toISOString())}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Module Quick Navigation & Workload Deep Links */}
            <div className="p-5 rounded-[7px] border-b-2 border-stroke/80 bg-white-100 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between border-b border-stroke/40 pb-3">
                <h3 className="font-bold text-black-90 text-sm flex items-center gap-2">
                  <Layers size={16} className="text-secondary" />
                  <span>Module Quick Navigation</span>
                </h3>
                <span className="text-xs text-black-90/50 font-medium">1-Click Record Filter</span>
              </div>

              <p className="text-xs text-black-90/60 leading-relaxed">
                Seamlessly jump to core CRM modules pre-filtered for <strong>{memberName}</strong> to inspect ongoing
                pipelines, customer touches, and assigned revenue records.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {/* View Leads */}
                <button
                  type="button"
                  onClick={() => window.open(`/leads?search=${encodeURIComponent(memberName)}`, '_blank')}
                  title={`View all leads assigned to ${memberName} (opens in new tab)`}
                  className="cursor-pointer flex items-center justify-between p-3.5 rounded-[7px] border-b-2 border-stroke/80 bg-gray hover:bg-white-100 hover:border-stroke transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[7px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Layers size={15} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-black-90 block group-hover:text-primary transition-colors">
                        View Leads
                      </span>
                      <span className="text-[10px] text-black-90/50">{workSummary.assignedLeads} Assigned</span>
                    </div>
                  </div>
                  <ExternalLink size={13} className="text-black-90/40 group-hover:text-primary transition-colors" />
                </button>

                {/* View Deals */}
                <button
                  type="button"
                  onClick={() => window.open(`/deals?search=${encodeURIComponent(memberName)}&ownerId=${encodeURIComponent(detail?.id || '')}`, '_blank')}
                  title={`View all deals owned by ${memberName} (opens in new tab)`}
                  className="cursor-pointer flex items-center justify-between p-3.5 rounded-[7px] border-b-2 border-stroke/80 bg-gray hover:bg-white-100 hover:border-stroke transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[7px] bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                      <TrendingUp size={15} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-black-90 block group-hover:text-secondary transition-colors">
                        View Deals
                      </span>
                      <span className="text-[10px] text-black-90/50">{workSummary.activeDeals} Active</span>
                    </div>
                  </div>
                  <ExternalLink size={13} className="text-black-90/40 group-hover:text-secondary transition-colors" />
                </button>

                {/* View Accounts */}
                <button
                  type="button"
                  onClick={() => window.open(`/clients?search=${encodeURIComponent(memberName)}`, '_blank')}
                  title={`View accounts managed by ${memberName} (opens in new tab)`}
                  className="cursor-pointer flex items-center justify-between p-3.5 rounded-[7px] border-b-2 border-stroke/80 bg-gray hover:bg-white-100 hover:border-stroke transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[7px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Building size={15} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-black-90 block group-hover:text-primary transition-colors">
                        View Accounts
                      </span>
                      <span className="text-[10px] text-black-90/50">{workSummary.managedAccounts} Portfolios</span>
                    </div>
                  </div>
                  <ExternalLink size={13} className="text-black-90/40 group-hover:text-primary transition-colors" />
                </button>

                {/* View Contacts */}
                <button
                  type="button"
                  onClick={() => window.open(`/contacts?search=${encodeURIComponent(memberName)}`, '_blank')}
                  title={`View contacts associated with ${memberName} (opens in new tab)`}
                  className="cursor-pointer flex items-center justify-between p-3.5 rounded-[7px] border-b-2 border-stroke/80 bg-gray hover:bg-white-100 hover:border-stroke transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[7px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Users size={15} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-black-90 block group-hover:text-primary transition-colors">
                        View Contacts
                      </span>
                      <span className="text-[10px] text-black-90/50">{workSummary.linkedContacts} Connected</span>
                    </div>
                  </div>
                  <ExternalLink size={13} className="text-black-90/40 group-hover:text-primary transition-colors" />
                </button>
              </div>

              {/* Status Note */}
              <div className="mt-auto p-3 rounded-[7px] border-b-2 border-stroke/80 bg-gray flex items-center gap-2 text-[11px] text-black-90/70">
                <Award size={14} className="text-success shrink-0" />
                <span>
                  Telemetry syncs directly with active CRM pipelines and round-robin allocations.
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===========================================================================================
          SAFE DEACTIVATION & WORKLOAD REASSIGNMENT MODAL (FRD 11.25)
      =========================================================================================== */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white-100 rounded-[7px] border-b-2 border-alert/40 p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2.5 text-alert font-bold text-base">
              <AlertTriangle size={18} />
              <span>Deactivate Team Member</span>
            </div>

            <p className="text-xs text-black-90/70 leading-relaxed">
              Deactivating <strong className="text-black-90">{memberName}</strong> will stop automatic lead round-robin
              assignment and revoke their active login sessions.
            </p>

            {workSummary.assignedLeads > 0 || workSummary.activeDeals > 0 ? (
              <div className="p-3.5 rounded-[7px] border-b-2 border-stroke/80 bg-gray flex flex-col gap-3">
                <span className="text-xs font-semibold text-black-90">
                  This member currently has {workSummary.assignedLeads} active leads and {workSummary.activeDeals} open
                  deals. Select a colleague to reassign them to:
                </span>

                <DropdownInput
                  label="Reassign Workloads To"
                  placeholder="Select active BDE or Executive"
                  options={activePeers}
                  value={reassignUserId}
                  onChange={(e) => setReassignUserId(e.target.value)}
                />
              </div>
            ) : (
              <p className="text-xs text-black-90/60 font-medium">
                This member has no active open workloads. Are you sure you want to proceed?
              </p>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stroke/40">
              <button
                type="button"
                onClick={() => setShowDeactivateModal(false)}
                disabled={actionLoading}
                className="cursor-pointer px-4 py-2 rounded-[7px] border-b-2 border-stroke/80 bg-gray text-xs font-semibold text-black-90 hover:bg-gray/80"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeactivate}
                disabled={actionLoading}
                className="cursor-pointer px-4 py-2 rounded-[7px] border-b-2 border-alert/80 bg-alert text-xs font-semibold text-white-100 hover:bg-alert/90 disabled:opacity-50"
              >
                {actionLoading ? 'Processing…' : 'Confirm Deactivation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMemberDetail;
