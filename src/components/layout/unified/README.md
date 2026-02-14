# Unified Layout Components

A complete layout system for all hub pages in Nexora CRM.

## Components

| Component          | Purpose                                        |
| ------------------ | ---------------------------------------------- |
| `UnifiedLayout`    | Main wrapper with context, handles state       |
| `UnifiedCoreMenu`  | Accordion navigation sidebar (max 2 levels)    |
| `UnifiedStatusBar` | Top bar with breadcrumb, stats, actions        |
| `UnifiedFixedMenu` | Optional list panel with search, filters, list |

## Quick Start

```jsx
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';
import { Users, Plus, Upload, Star, Target } from 'lucide-react';

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);

  return (
    <UnifiedLayout
      hubId="crm"
      pageTitle="Contacts"
      stats={[
        createStat('Total', contacts.length, Users, 'blue'),
        createStat('Active', 890, Star, 'green'),
        createStat('Leads', 45, Target, 'amber'),
      ]}
      actions={[
        createAction('Import', Upload, handleImport),
        createAction('Add Contact', Plus, handleAdd, { primary: true }),
      ]}
      fixedMenu={{
        items: contacts,
        hasDetailPage: true,
        detailBasePath: '/crm/contacts',
        searchPlaceholder: 'Search contacts...',
        filters: [
          {
            id: 'status',
            label: 'Status',
            options: [
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ],
          },
        ],
      }}
    >
      <ContactDetailView contactId={selectedId} />
    </UnifiedLayout>
  );
}
```

## Props Reference

### UnifiedLayout

| Prop        | Type      | Description                          |
| ----------- | --------- | ------------------------------------ |
| `hubId`     | string    | Hub ID to load menu from hubs.js     |
| `menu`      | object    | Custom menu config (overrides hubId) |
| `pageTitle` | string    | Page title for breadcrumb            |
| `stats`     | array     | Array of stat objects (max 5)        |
| `actions`   | array     | Action button objects                |
| `fixedMenu` | object    | Fixed menu config (null = hidden)    |
| `children`  | ReactNode | Main content                         |
| `className` | string    | Additional CSS classes               |

### createStat(label, value, icon, color)

Creates a stat object for the status bar.

```jsx
createStat('Total', 1234, Users, 'blue');
// Colors: 'primary', 'blue', 'green', 'emerald', 'amber', 'purple', 'red', 'orange', 'cyan'
```

### createAction(label, icon, onClick, options)

Creates an action button object.

```jsx
// Basic action
createAction('Export', Download, handleExport);

// Primary action
createAction('Add', Plus, handleAdd, { primary: true });

// Link action
createAction('Settings', Settings, null, { href: '/settings' });

// With variant
createAction('Delete', Trash, handleDelete, { variant: 'destructive' });
```

### fixedMenu Config

| Option              | Type      | Description                    |
| ------------------- | --------- | ------------------------------ |
| `items`             | array     | List items to display          |
| `hasDetailPage`     | boolean   | Items link to detail pages     |
| `detailBasePath`    | string    | Base path for detail pages     |
| `getItemId`         | function  | Extract item ID                |
| `renderItem`        | function  | Custom item renderer           |
| `searchPlaceholder` | string    | Search input placeholder       |
| `filters`           | array     | Filter options for modal       |
| `switchOptions`     | array     | Switch dropdown options        |
| `footer`            | ReactNode | Footer content                 |
| `width`             | string    | Panel width (default: "340px") |
| `emptyMessage`      | string    | Empty state message            |
| `EmptyIcon`         | component | Empty state icon               |

## Context Hook

```jsx
import { useUnifiedLayout } from '@/components/layout/unified';

function ChildComponent() {
  const {
    hubId,
    hubName,
    pageTitle,
    isMenuCollapsed,
    toggleMenuCollapsed,
    selectedItemId,
    setSelectedItemId,
    searchQuery,
    setSearchQuery,
    switchValue,
    setSwitchValue,
  } = useUnifiedLayout();

  return <div>Current hub: {hubName}</div>;
}
```

## Migration Guide

### From HubLayout

```jsx
// Before: HubLayout
<HubLayout
  hubId="crm"
  title="Contacts"
  stats={stats}
  showFixedMenu={true}
  fixedMenuFilters={<FilterComponent />}
  fixedMenuList={<ListComponent />}
  fixedMenuFooter={<PaginationComponent />}
>
  {children}
</HubLayout>

// After: UnifiedLayout
<UnifiedLayout
  hubId="crm"
  pageTitle="Contacts"
  stats={stats}
  fixedMenu={{
    items: contacts,
    hasDetailPage: true,
    detailBasePath: '/crm/contacts',
    footer: <PaginationComponent />,
  }}
>
  {children}
</UnifiedLayout>
```

### From Custom Sidebar

```jsx
// Before: Custom sidebar components
<ModuleProvider>
  <div className="flex h-full">
    <ModuleSidebar />
    <div className="flex-1">
      <ModuleHeader />
      <div className="flex">
        <ModuleSubMenu />
        <main>{children}</main>
      </div>
    </div>
  </div>
</ModuleProvider>

// After: UnifiedLayout
<UnifiedLayout
  hubId="module"
  pageTitle="Page Name"
  stats={stats}
  actions={actions}
  fixedMenu={fixedMenuConfig} // or null if no fixed menu
>
  {children}
</UnifiedLayout>
```

## Features

### Core Menu (UnifiedCoreMenu)

- Accordion sections with max 2 levels of nesting
- Collapsible sidebar with toggle button
- Persists expanded/collapsed state in localStorage
- Auto-expands section containing active item
- Badge counts on items and sections
- Loads menu from hubs.js or custom config

### Status Bar (UnifiedStatusBar)

- Breadcrumb: "Hub Name / Page Title"
- Up to 5 stat badges with icons
- Action buttons (primary/outline, links or onClick)

### Fixed Menu (UnifiedFixedMenu)

- Search bar with live filtering
- Filter icon opens modal dialog
- Switch dropdown (for channel selection, etc.)
- Scrollable list with selection
- Auto-select first item when no selection
- Remember last selected item in localStorage
- Detail pages via URL pattern `/hub/path/[id]`
- Custom item renderer support

## When to Use

Use `UnifiedLayout` when:

- Creating a new hub page
- Page needs standard layout (sidebar + status bar + content)
- You want consistent behavior across hubs

Keep existing sidebar when:

- Hub has complex business logic in sidebar (e.g., Inbox with channel config)
- Custom modals/dialogs in sidebar
- Specialized context providers
