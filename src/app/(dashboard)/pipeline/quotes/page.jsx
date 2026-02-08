import { redirect } from 'next/navigation';

/**
 * Pipeline Quotes - Redirects to Commerce Hub
 *
 * This page has been consolidated. The Commerce Hub (/commerce/quotes) is now
 * the primary location for quote management.
 *
 * @see /commerce/quotes - Primary quotes view
 * @see docs/NEXORA_DUPLICATE_FEATURES_ANALYSIS.md - Consolidation rationale
 */
export default function PipelineQuotesPage() {
  redirect('/commerce/quotes');
}
