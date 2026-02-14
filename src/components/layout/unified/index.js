/**
 * Unified Layout Components
 *
 * A complete layout system for all hub pages that provides:
 * - UnifiedLayout: Main wrapper component with context
 * - UnifiedCoreMenu: Accordion navigation sidebar
 * - UnifiedStatusBar: Top bar with breadcrumb, stats, actions
 * - UnifiedFixedMenu: Optional list panel with search, filters, list
 *
 * Usage Example:
 * ```jsx
 * import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';
 *
 * export default function ContactsPage() {
 *   return (
 *     <UnifiedLayout
 *       hubId="crm"
 *       pageTitle="Contacts"
 *       stats={[
 *         createStat('Total', 1234, Users, 'blue'),
 *         createStat('Active', 890, UserCheck, 'green'),
 *       ]}
 *       actions={[
 *         createAction('Import', Upload, handleImport),
 *         createAction('Add Contact', Plus, handleAdd, { primary: true }),
 *       ]}
 *       fixedMenu={{
 *         items: contacts,
 *         hasDetailPage: true,
 *         detailBasePath: '/crm/contacts',
 *         searchPlaceholder: 'Search contacts...',
 *       }}
 *     >
 *       {children}
 *     </UnifiedLayout>
 *   );
 * }
 * ```
 */

// Main layout wrapper
export { UnifiedLayout, useUnifiedLayout, createStat, createAction } from './unified-layout';

// Individual components for custom usage
export { UnifiedCoreMenu } from './unified-core-menu';
export { UnifiedStatusBar } from './unified-status-bar';
export { UnifiedFixedMenu } from './unified-fixed-menu';
