// Commerce Layout - Uses HubLayout pattern (pages render their own layout)
// Simplified to avoid double-sidebar and context errors
// The old CommerceProvider/CommerceSidebar pattern conflicted with HubLayout used in pages
export default function CommerceLayout({ children }) {
  return <>{children}</>;
}
