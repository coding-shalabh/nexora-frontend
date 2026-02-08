/**
 * Redirect: Sales Sequences → Automation Sequences
 *
 * Sequences are managed in Automation Hub (primary owner).
 * Automation Hub handles all workflow and sequence automation.
 *
 * @see /automation/sequences - Primary sequence management
 */
import { redirect } from 'next/navigation';

export default function SalesSequencesPage() {
  redirect('/automation/sequences');
}
