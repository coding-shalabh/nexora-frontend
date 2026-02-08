import { redirect } from 'next/navigation';

/**
 * CRM Custom Fields - Redirects to Settings Hub
 *
 * This page has been consolidated. The Settings Hub (/settings/custom-fields) is now
 * the primary location for custom field management across all entities.
 *
 * @see /settings/custom-fields - Primary custom fields view
 * @see docs/NEXORA_DUPLICATE_FEATURES_ANALYSIS.md - Consolidation rationale
 */
export default function CRMFieldsPage() {
  redirect('/settings/custom-fields');
}
