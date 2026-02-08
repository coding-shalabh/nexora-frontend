/**
 * Redirect: Sales Accounts → CRM Companies
 *
 * Companies/Accounts are managed in CRM Hub (primary owner).
 * Sales Hub can view accounts via CRM but doesn't own the feature.
 *
 * @see /crm/companies - Primary company management
 */
import { redirect } from 'next/navigation';

export default function SalesAccountsPage() {
  redirect('/crm/companies');
}
