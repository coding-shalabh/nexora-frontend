'use client'

import { useEffect, useCallback, useRef } from 'react'

/**
 * Check if an element is an input-like element
 */
function isInputElement(element) {
  if (!element) return false
  const tagName = element.tagName?.toLowerCase()
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    element.isContentEditable
  )
}

/**
 * Hook to handle keyboard shortcuts
 * @param {Object} shortcuts - Object mapping key combinations to handler functions
 * @param {Object} options - Configuration options
 * @param {boolean} options.enabled - Whether shortcuts are enabled (default: true)
 * @param {boolean} options.ignoreInputs - Whether to ignore shortcuts when in input fields (default: true)
 * @param {string[]} options.allowInInputs - List of keys to still handle even in inputs (default: ['Escape'])
 */
export function useKeyboardShortcuts(shortcuts, options = {}) {
  const {
    enabled = true,
    ignoreInputs = true,
    allowInInputs = ['Escape'],
  } = options

  const shortcutsRef = useRef(shortcuts)
  shortcutsRef.current = shortcuts

  const handleKeyDown = useCallback(
    (event) => {
      if (!enabled) return

      // Check if we're in an input field
      const inInput = isInputElement(event.target)

      // Build key combination string
      const parts = []
      if (event.ctrlKey || event.metaKey) parts.push('ctrl')
      if (event.altKey) parts.push('alt')
      if (event.shiftKey) parts.push('shift')

      // Get the key - normalize special keys
      let key = event.key.toLowerCase()
      if (key === ' ') key = 'space'
      if (key === 'arrowup') key = 'up'
      if (key === 'arrowdown') key = 'down'
      if (key === 'arrowleft') key = 'left'
      if (key === 'arrowright') key = 'right'

      parts.push(key)
      const combo = parts.join('+')

      // Also check just the key without modifiers for simple shortcuts
      const simpleKey = key

      // Find matching shortcut
      let handler = shortcutsRef.current[combo] || shortcutsRef.current[simpleKey]

      if (!handler) return

      // Check if we should handle this shortcut in inputs
      if (inInput && ignoreInputs) {
        const isAllowed = allowInInputs.some((allowedKey) => {
          const normalized = allowedKey.toLowerCase()
          return combo === normalized || simpleKey === normalized || combo.endsWith('+' + normalized)
        })
        if (!isAllowed) return
      }

      // Execute the handler
      event.preventDefault()
      handler(event)
    },
    [enabled, ignoreInputs, allowInInputs]
  )

  useEffect(() => {
    if (!enabled) return

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, handleKeyDown])
}

/**
 * Inbox-specific keyboard shortcuts definitions
 */
export const INBOX_SHORTCUTS = {
  // Navigation
  j: { key: 'j', description: 'Next conversation', category: 'Navigation' },
  k: { key: 'k', description: 'Previous conversation', category: 'Navigation' },
  'g+i': { key: 'g i', description: 'Go to inbox', category: 'Navigation' },
  'g+s': { key: 'g s', description: 'Go to snoozed', category: 'Navigation' },
  'g+r': { key: 'g r', description: 'Go to resolved', category: 'Navigation' },

  // Actions
  r: { key: 'r', description: 'Reply to conversation', category: 'Actions' },
  e: { key: 'e', description: 'Resolve conversation', category: 'Actions' },
  s: { key: 's', description: 'Snooze conversation', category: 'Actions' },
  a: { key: 'a', description: 'Assign conversation', category: 'Actions' },
  n: { key: 'n', description: 'Add note', category: 'Actions' },

  // Search & UI
  '/': { key: '/', description: 'Search conversations', category: 'Search & UI' },
  escape: { key: 'esc', description: 'Close panel / Clear selection', category: 'Search & UI' },
  '?': { key: '?', description: 'Show keyboard shortcuts', category: 'Search & UI' },
  'ctrl+enter': { key: 'ctrl+enter', description: 'Send message', category: 'Compose' },
  'ctrl+/': { key: 'ctrl+/', description: 'Insert canned response', category: 'Compose' },
}

/**
 * Get shortcuts grouped by category
 */
export function getShortcutsByCategory() {
  const categories = {}

  Object.entries(INBOX_SHORTCUTS).forEach(([id, shortcut]) => {
    const category = shortcut.category || 'Other'
    if (!categories[category]) {
      categories[category] = []
    }
    categories[category].push({ id, ...shortcut })
  })

  return categories
}

export default useKeyboardShortcuts
