/**
 * Redirect: Sales Contacts → CRM Contacts
 *
 * Contacts are managed in CRM Hub (primary owner).
 * Sales Hub can view contacts via CRM but doesn't own the feature.
 *
 * @see /crm/contacts - Primary contact management
 * @see docs/NEXORA_COMPLETE_FEATURES.md - Module Ownership Matrix
 */
import { redirect } from 'next/navigation';

export default function SalesContactsPage() {
  redirect('/crm/contacts');
}
