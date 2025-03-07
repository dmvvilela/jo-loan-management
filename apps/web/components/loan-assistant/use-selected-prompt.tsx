'use client'

import { useEffect } from 'react'

export const useSelectedPrompt = (
  setInput: (value: string) => void,
  handleSend: (e: React.FormEvent) => Promise<void>
) => {
  useEffect(() => {
    const selectedPrompt = localStorage.getItem('selectedPrompt')
    if (selectedPrompt) {
      setInput(selectedPrompt)
      // Create a synthetic form event
      const event = {
        preventDefault: () => {},
      } as React.FormEvent

      // Small delay to ensure the UI updates first
      setTimeout(() => {
        handleSend(event)
        // Clear the selected prompt after using it
        localStorage.removeItem('selectedPrompt')
      }, 100)
    }
  }, [])
}
