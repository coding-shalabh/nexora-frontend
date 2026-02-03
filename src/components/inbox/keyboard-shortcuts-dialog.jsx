'use client'

import { Keyboard } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getShortcutsByCategory } from '@/hooks/use-keyboard-shortcuts'

function ShortcutKey({ keyText }) {
  // Split by + for combinations like ctrl+enter
  const keys = keyText.split('+').map((k) => k.trim())

  return (
    <span className="flex items-center gap-1">
      {keys.map((key, idx) => (
        <span key={idx} className="flex items-center">
          {idx > 0 && <span className="text-muted-foreground mx-0.5">+</span>}
          <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            {key === 'ctrl' ? '⌘/Ctrl' : key === 'shift' ? '⇧' : key === 'alt' ? 'Alt' : key}
          </kbd>
        </span>
      ))}
    </span>
  )
}

export function KeyboardShortcutsDialog({ open, onOpenChange }) {
  const shortcutsByCategory = getShortcutsByCategory()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate and take actions quickly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {Object.entries(shortcutsByCategory).map(([category, shortcuts]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.id}
                    className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <ShortcutKey keyText={shortcut.key} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Press <kbd className="mx-1 px-1.5 py-0.5 rounded border bg-muted font-mono text-[10px]">?</kbd> anytime to show this dialog
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
