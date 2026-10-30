//==================================================================================================================
//    LOST REASONS CONFIGURATION SCREEN
//    Displays and edits CRM lost reason classifications
// ==================================================================================================================

import React from 'react';
import { ConfigurationReasonTable } from '../components/ConfigurationReasonTable';
import { INITIAL_LOST_REASONS, LOST_REASON_OPTIONS, REPORTING_BUCKET_OPTIONS } from '../../../../constants/crmConfigurationReasonConstants';

const LOST_REASON_CONFIG = {
  title: 'Lost Reason', deleteLabel: 'Reason', addLabel: 'Add Lost Reason', idPrefix: 'lr', initialItems: INITIAL_LOST_REASONS,
  nameLabel: 'Lost Reason Classification', namePlaceholder: 'Add Reason', nameOptions: LOST_REASON_OPTIONS,
  relatedKey: 'reportingBucket', relatedLabel: 'Win/Loss Reporting Bucket', relatedPlaceholder: 'Add Reporting Bucket', relatedOptions: REPORTING_BUCKET_OPTIONS,
  showActivityIcon: false,
};

export const LostReasonsTable = () => <ConfigurationReasonTable config={LOST_REASON_CONFIG} />;
export default LostReasonsTable;
