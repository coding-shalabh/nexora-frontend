/**
 * Redirect: Marketing Templates → Settings Templates
 *
 * Templates are managed in Settings Hub (primary owner).
 * Settings Hub provides centralized template management for all hubs.
 *
 * @see /settings/templates - Primary template management
 */
import { redirect } from 'next/navigation';

export default function MarketingTemplatesPage() {
  redirect('/settings/templates');
}
