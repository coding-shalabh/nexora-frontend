/**
 * Redirect: Inbox Chatbots → Automation Chatbots
 *
 * Chatbots are managed in Automation Hub (primary owner).
 * Automation Hub handles all AI bots and workflow automation.
 *
 * @see /automation/chatbots - Primary chatbot management
 * @see docs/NEXORA_COMPLETE_FEATURES.md - Module Ownership Matrix
 */
import { redirect } from 'next/navigation';

export default function InboxChatbotsPage() {
  redirect('/automation/chatbots');
}
