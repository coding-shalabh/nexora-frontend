/**
 * Redirect: Inbox Sequences → Automation Sequences
 *
 * Sequences are managed in Automation Hub (primary owner).
 * Inbox Hub uses sequences but doesn't manage them.
 *
 * @see /automation/sequences - Primary sequence management
 */
import { redirect } from 'next/navigation';

export default function InboxSequencesPage() {
  redirect('/automation/sequences');
}
