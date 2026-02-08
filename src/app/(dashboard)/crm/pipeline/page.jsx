import { redirect } from 'next/navigation';

/**
 * CRM Pipeline - Redirects to Pipeline Hub
 *
 * This page has been consolidated. The Pipeline Hub (/pipeline/deals) is now
 * the primary location for deal pipeline management.
 *
 * @see /pipeline/deals - Primary pipeline view
 * @see docs/NEXORA_DUPLICATE_FEATURES_ANALYSIS.md - Consolidation rationale
 */
export default function CRMPipelinePage() {
  redirect('/pipeline/deals');
}
