//==================================================================================================================
//    ACTIVITY MODALITIES CONFIGURATION SCREEN
//    Displays and edits CRM activity types and their default sync bridge
// ==================================================================================================================

import React from 'react';
import { ConfigurationReasonTable } from '../components/ConfigurationReasonTable';
import { ACTIVITY_MODALITY_OPTIONS, INITIAL_ACTIVITY_MODALITIES, SYNC_BRIDGE_OPTIONS } from '../../../../constants/crmConfigurationReasonConstants';

const ACTIVITY_MODALITY_CONFIG = {
  title: 'Activity Type', deleteLabel: 'Activity Type', addLabel: 'Add Activity Type', idPrefix: 'am', initialItems: INITIAL_ACTIVITY_MODALITIES,
  nameLabel: 'Activity Type', namePlaceholder: 'Select Activity Type', nameOptions: ACTIVITY_MODALITY_OPTIONS,
  relatedKey: 'syncBridge', relatedLabel: 'Default Sync Bridge', relatedPlaceholder: 'Select Sync Bridge', relatedOptions: SYNC_BRIDGE_OPTIONS,
  showActivityIcon: true,
};

export const ActivityModalitiesTable = () => <ConfigurationReasonTable config={ACTIVITY_MODALITY_CONFIG} />;
export default ActivityModalitiesTable;
