/**
 * Redirect: Sales Leads → CRM Leads
 *
 * Leads are managed in CRM Hub (primary owner).
 * Sales Hub can view leads via CRM but doesn't own the feature.
 *
 * @see /crm/leads - Primary leads management
 */
import { redirect } from 'next/navigation';

export default function SalesLeadsPage() {
  redirect('/crm/leads');
}
