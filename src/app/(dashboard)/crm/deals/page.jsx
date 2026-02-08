/**
 * Redirect: CRM Deals → Pipeline Deals
 *
 * Deals are managed in Pipeline Hub (primary owner).
 * CRM Hub provides contact management, not deal pipelines.
 *
 * @see /pipeline/deals - Primary deal management
 */
import { redirect } from 'next/navigation';

export default function CRMDealsPage() {
  redirect('/pipeline/deals');
}
