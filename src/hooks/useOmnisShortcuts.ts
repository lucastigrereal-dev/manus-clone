import { useHotkeys } from 'react-hotkeys-hook'
import { useUiStore } from '@/stores/uiStore'

export function useOmnisShortcuts(chatInputRef?: React.RefObject<HTMLTextAreaElement | null>) {
  const { setCommandPaletteOpen, toggleFocusMode, commandPaletteOpen } = useUiStore()

  // Ctrl+K / Cmd+K — open command palette
  useHotkeys(
    'mod+k',
    (e) => {
      e.preventDefault()
      setCommandPaletteOpen(!commandPaletteOpen)
    },
    { enableOnFormTags: true },
    [commandPaletteOpen, setCommandPaletteOpen],
  )

  // Ctrl+Shift+F / Cmd+Shift+F — toggle focus mode
  useHotkeys(
    'mod+shift+f',
    (e) => {
      e.preventDefault()
      toggleFocusMode()
    },
    { enableOnFormTags: true },
    [toggleFocusMode],
  )

  // Ctrl+J / Cmd+J — focus chat input
  useHotkeys(
    'mod+j',
    (e) => {
      e.preventDefault()
      chatInputRef?.current?.focus()
    },
    { enableOnFormTags: false },
    [chatInputRef],
  )
}
