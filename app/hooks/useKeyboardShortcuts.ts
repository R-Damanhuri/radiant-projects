'use client';

import { useEffect, useCallback } from 'react';

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
}

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[], options: UseKeyboardShortcutsOptions = {}) {
  const { enabled = true } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Ignore if typing in input/textarea
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    for (const shortcut of shortcuts) {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : true;
      const shiftMatch = shortcut.shift ? event.shiftKey : true;
      const altMatch = shortcut.alt ? event.altKey : true;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault();
        shortcut.action();
        break;
      }
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    shortcuts: shortcuts.map(s => ({
      ...s,
      shortcut: [
        s.ctrl ? 'Ctrl+' : '',
        s.shift ? 'Shift+' : '',
        s.alt ? 'Alt+' : '',
        s.key.toUpperCase()
      ].join('')
    }))
  };
}

// Common shortcuts for the app
export const commonShortcuts = [
  {
    key: 'c',
    ctrl: true,
    action: () => document.execCommand('copy'),
    description: 'Copy selected content'
  },
  {
    key: 'z',
    ctrl: true,
    action: () => window.history.back(),
    description: 'Go back'
  },
  {
    key: 'h',
    ctrl: true,
    action: () => window.location.href = '/',
    description: 'Go to home'
  }
];
