//==================================================================================================================
//    BDE DASHBOARD METRIC CONSTANTS
//    Standardized mock arrays and telemetry data for BDE stat cards
//==================================================================================================================
import { Sparkles, Users, IndianRupee } from 'lucide-react';

export const BDE_STAT_CARDS = [
  {
    id: 'total-leads',
    title: 'Total Leads',
    value: '3,128',
    colorKey: 'secondary',
    icon: Sparkles,
    trendType: 'neutral',
    subText: (
      <span>
        <strong className="text-success font-bold">128</strong> New Leads
      </span>
    ),
  },
  {
    id: 'follow-ups',
    title: 'Follow-ups',
    value: '24,560',
    colorKey: 'success',
    icon: Users,
    trendType: 'neutral',
    subText: (
      <span>
        <strong className="text-success font-bold">3,128</strong> Meeting Scheduled
      </span>
    ),
  },
  {
    id: 'total-deals',
    title: 'Total Deals',
    value: '3,128',
    colorKey: 'secondary',
    icon: IndianRupee,
    trendType: 'neutral',
    subText: (
      <span>
        <strong className="text-success font-bold">560</strong> Won Deals{' '}
        <span className="text-black-90/30 mx-1">|</span>{' '}
        <strong className="text-alert font-bold">128</strong> Lost Deals
      </span>
    ),
  },
  {
    id: 'expected-revenue',
    title: 'Expected Revenue',
    value: '₹483,500',
    colorKey: 'success',
    icon: IndianRupee,
    trendType: 'negative',
    subText: '5% from last month',
  },
];

//==================================================================================================================
//    BDE REVENUE CHART DATA (MONTHLY)
//    12-month telemetry values reflecting bar chart trends in Figma design
//==================================================================================================================
export const BDE_REVENUE_CHART_MONTHLY = [
  { m: 'Jan', label: 'Jan', value: 30 },
  { m: 'Feb', label: 'Feb', value: 50 },
  { m: 'Mar', label: 'March', value: 10 },
  { m: 'Apr', label: 'April', value: 70 },
  { m: 'May', label: 'May', value: 50 },
  { m: 'Jun', label: 'June', value: 60 },
  { m: 'Jul', label: 'July', value: 45 },
  { m: 'Aug', label: 'Aug', value: 50 },
  { m: 'Sep', label: 'Sep', value: 70 },
  { m: 'Oct', label: 'Oct', value: 30 },
  { m: 'Nov', label: 'Nov', value: 50 },
  { m: 'Dec', label: 'Dec', value: 60 },
];

//==================================================================================================================
//    BDE REVENUE CHART DATA (YEARLY)
//    Multi-year comparison values for revenue toggle view
//==================================================================================================================
export const BDE_REVENUE_CHART_YEARLY = [
  { m: '2021', label: '2021', value: 45 },
  { m: '2022', label: '2022', value: 55 },
  { m: '2023', label: '2023', value: 65 },
  { m: '2024', label: '2024', value: 70 },
  { m: '2025', label: '2025', value: 80 },
];

//==================================================================================================================
//    BDE DEAL DISTRIBUTION PIPELINE STAGES
//    Stage progression, valuation badges, and completion meters matching Figma design
//==================================================================================================================
export const BDE_DEAL_DISTRIBUTION_DATA = [
  {
    id: 'stage-1',
    index: 1,
    title: 'Discovery (5 Deals)',
    value: '₹70k',
    percent: 82,
    variant: 'success',
  },
  {
    id: 'stage-2',
    index: 2,
    title: 'Demo & Evaluation (5 Deals)',
    value: '₹70k',
    percent: 58,
    variant: 'success',
  },
  {
    id: 'stage-3',
    index: 3,
    title: 'Proposal / Quote Sent (5 Deals)',
    value: '₹70k',
    percent: 54,
    variant: 'success',
  },
  {
    id: 'stage-4',
    index: 4,
    title: 'Negotiation (5 Deals)',
    value: '₹70k',
    percent: 42,
    variant: 'success',
  },
  {
    id: 'stage-5',
    index: 5,
    title: 'Closing / Final Review (5 Deals)',
    value: '₹70k',
    percent: 28,
    variant: 'alert',
  },
  {
    id: 'stage-6',
    index: 6,
    title: 'Closing / Final Review (5 Deals)',
    value: '₹70k',
    percent: 28,
    variant: 'alert',
  },
  {
    id: 'stage-7',
    index: 7,
    title: 'Closing / Final Review (5 Deals)',
    value: '₹70k',
    percent: 28,
    variant: 'alert',
  },
];

//==================================================================================================================
//    BDE LAST 5 LEADS TABLE DATA
//    Standardized mock records for recent leads table matching Figma design
//==================================================================================================================
export const BDE_LAST_5_LEADS_DATA = [
  {
    id: 'lead-1',
    code: '#001',
    leadName: 'Johnson Doe',
    leadAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    companyName: 'ABC Company Pvt Ltd',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&crop=face',
    stage: 'Proposal',
    priority: 'Low',
    createdDate: '14 May 2025',
    createdTime: '08:45 AM',
  },
  {
    id: 'lead-2',
    code: '#001',
    leadName: 'Johnson Doe',
    leadAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    companyName: 'ABC Company Pvt Ltd',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&crop=face',
    stage: 'Proposal',
    priority: 'Low',
    createdDate: '14 May 2025',
    createdTime: '08:45 AM',
  },
  {
    id: 'lead-3',
    code: '#001',
    leadName: 'Johnson Doe',
    leadAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    companyName: 'ABC Company Pvt Ltd',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&crop=face',
    stage: 'Proposal',
    priority: 'Low',
    createdDate: '14 May 2025',
    createdTime: '08:45 AM',
  },
  {
    id: 'lead-4',
    code: '#001',
    leadName: 'Johnson Doe',
    leadAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    companyName: 'ABC Company Pvt Ltd',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&crop=face',
    stage: 'Proposal',
    priority: 'Low',
    createdDate: '14 May 2025',
    createdTime: '08:45 AM',
  },
  {
    id: 'lead-5',
    code: '#001',
    leadName: 'Johnson Doe',
    leadAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    companyName: 'ABC Company Pvt Ltd',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&crop=face',
    stage: 'Proposal',
    priority: 'Low',
    createdDate: '14 May 2025',
    createdTime: '08:45 AM',
  },
];


