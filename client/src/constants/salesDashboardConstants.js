//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    Lucide icons for Sales telemetry cards
//==================================================================================================================
import { Star, UserCheck, Users, TrendingDown } from 'lucide-react';

//==================================================================================================================
//    SALES STAT CARDS CONSTANTS (Image 3)
//==================================================================================================================
export const SALES_STAT_CARDS = [
  {
    id: 'total-leads',
    title: 'Total Leads',
    value: '3,128',
    subText: '12.05% from last month',
    trendType: 'positive',
    colorKey: 'secondary',
    icon: Star,
  },
  {
    id: 'assigned-leads',
    title: 'Assigned Leads',
    value: '3,128',
    subText: '5% from last month',
    trendType: 'negative',
    colorKey: 'success',
    icon: UserCheck,
  },
  {
    id: 'unassigned-leads',
    title: 'Unassigned Leads',
    value: '24,560',
    subText: '5% from last month',
    trendType: 'positive',
    colorKey: 'alert',
    icon: Users,
  },
  {
    id: 'lead-conversion',
    title: 'Lead Conversion',
    value: '3,128',
    subText: '5% from last month',
    trendType: 'negative',
    colorKey: 'purple',
    icon: TrendingDown,
  },
];

//==================================================================================================================
//    SALES REVENUE BAR CHART TELEMETRY (Image 4 Left)
//==================================================================================================================
export const SALES_REVENUE_CHART_MONTHLY = [
  { label: 'Jan', value: 30, displayValue: '₹30k' },
  { label: 'Feb', value: 50, displayValue: '₹50k' },
  { label: 'March', value: 10, displayValue: '₹10k' },
  { label: 'April', value: 70, displayValue: '₹70k' },
  { label: 'May', value: 50, displayValue: '₹50k' },
  { label: 'June', value: 60, displayValue: '₹60k' },
  { label: 'July', value: 45, displayValue: '₹45k' },
  { label: 'Aug', value: 50, displayValue: '₹50k' },
  { label: 'Sep', value: 70, displayValue: '₹70k' },
  { label: 'Oct', value: 30, displayValue: '₹30k' },
  { label: 'Nov', value: 50, displayValue: '₹50k' },
  { label: 'Dec', value: 60, displayValue: '₹60k' },
];

export const SALES_REVENUE_CHART_YEARLY = [
  { label: '2021', value: 40, displayValue: '₹400k' },
  { label: '2022', value: 55, displayValue: '₹550k' },
  { label: '2023', value: 65, displayValue: '₹650k' },
  { label: '2024', value: 72, displayValue: '₹720k' },
  { label: '2025', value: 80, displayValue: '₹800k' },
];

//==================================================================================================================
//    SALES LEAD OVERVIEW STAGE DISTRIBUTION (Image 4 Right)
//==================================================================================================================
export const SALES_LEAD_OVERVIEW_DATA = {
  totalBadge: '1,248 Total',
  stages: [
    {
      id: 'new-leads',
      label: 'New Leads',
      count: 312,
      percentage: '25.0%',
      colorClass: 'bg-[#001965]',
      dotColorClass: 'bg-[#001965]',
    },
    {
      id: 'contacted',
      label: 'Contacted',
      count: 420,
      percentage: '33.6%',
      colorClass: 'bg-secondary',
      dotColorClass: 'bg-secondary',
    },
    {
      id: 'qualified',
      label: 'Qualified',
      count: 268,
      percentage: '21.5%',
      colorClass: 'bg-[#78D5B1]',
      dotColorClass: 'bg-[#78D5B1]',
    },
    {
      id: 'converted',
      label: 'Converted',
      count: 224,
      percentage: '18.0%',
      colorClass: 'bg-success',
      dotColorClass: 'bg-success',
    },
    {
      id: 'lost',
      label: 'Lost',
      count: 48,
      percentage: '3.8%',
      colorClass: 'bg-[#98A2B3]',
      dotColorClass: 'bg-[#98A2B3]',
    },
    {
      id: 'unassigned',
      label: 'Unassigned',
      count: 24,
      percentage: '1.9%',
      colorClass: 'bg-[#FEDF89]',
      dotColorClass: 'bg-[#FEDF89]',
    },
  ],
};

//==================================================================================================================
//    SALES BDE PERFORMANCE TABLE DATA (Image 5)
//==================================================================================================================
export const SALES_BDE_PERFORMANCE_DATA = [
  {
    id: 'bde-1',
    code: '#001',
    name: 'Emily Carter',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    leadsHandled: '312 leads',
    conversionRate: '28.4%',
    pipelineValue: '₹14,20,000',
    wonRevenue: '₹5,80,000',
  },
  {
    id: 'bde-2',
    code: '#001',
    name: 'Emily Carter',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    leadsHandled: '312 leads',
    conversionRate: '28.4%',
    pipelineValue: '₹14,20,000',
    wonRevenue: '₹5,80,000',
  },
  {
    id: 'bde-3',
    code: '#001',
    name: 'Emily Carter',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    leadsHandled: '312 leads',
    conversionRate: '28.4%',
    pipelineValue: '₹14,20,000',
    wonRevenue: '₹5,80,000',
  },
];
