/**
 * Redirect: Pipeline Leads → CRM Leads
 *
 * Leads are managed in CRM Hub (primary owner).
 * Pipeline Hub focuses on deal management.
 *
 * @see /crm/leads - Primary lead management
 */
import { redirect } from 'next/navigation';

export default function PipelineLeadsPage() {
  redirect('/crm/leads');
}
