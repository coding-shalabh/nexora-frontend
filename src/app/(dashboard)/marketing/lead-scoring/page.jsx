/**
 * Redirect: Marketing Lead Scoring → Automation Lead Scoring
 *
 * Lead Scoring is managed in Automation Hub (primary owner).
 * Marketing Hub can view and use scores but doesn't own the feature.
 *
 * @see /automation/lead-scoring - Primary lead scoring management
 */
import { redirect } from 'next/navigation';

export default function MarketingLeadScoringPage() {
  redirect('/automation/lead-scoring');
}
