/**
 * Redirect: CRM Tags → Settings Tags
 *
 * Tags are managed in Settings Hub (primary owner).
 * Settings Hub provides centralized tag management for all entities.
 *
 * @see /settings/tags - Primary tag management
 */
import { redirect } from 'next/navigation';

export default function CRMTagsPage() {
  redirect('/settings/tags');
}
