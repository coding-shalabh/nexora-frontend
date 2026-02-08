/**
 * Redirect: CRM Segments → Marketing Segments
 *
 * Segments are managed in Marketing Hub (primary owner).
 * Marketing Hub handles audience segmentation and targeting.
 *
 * @see /marketing/segments - Primary segment management
 */
import { redirect } from 'next/navigation';

export default function CRMSegmentsPage() {
  redirect('/marketing/segments');
}
