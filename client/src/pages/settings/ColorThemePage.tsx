import { useState } from 'react'
import OptionCard from '@/components/settings/OptionCard'
import { usePreferences } from '@/context/PreferencesContext'
import { useToast } from '@/context/ToastContext'
import type { ThemePreference } from '@/lib/types'

const OPTIONS: { value: ThemePreference; icon: string; title: string; description: string }[] = [
  { value: 'light', icon: '/images/icon-sun.svg', title: 'Light Mode', description: 'Pick a clean and classic light theme' },
  { value: 'dark', icon: '/images/icon-moon.svg', title: 'Dark Mode', description: 'Select a sleek and modern dark theme' },
  { value: 'system', icon: '/images/icon-system-theme.svg', title: 'System', description: "Adapts to your device's theme" },
]

export default function ColorThemePage() {
  const { theme, setTheme } = usePreferences()
  const { showToast } = useToast()
  const [selected, setSelected] = useState(theme)
  const [syncedTheme, setSyncedTheme] = useState(theme)

  // Re-derive the local selection whenever the loaded preference changes
  // (e.g. it arrives after this component mounts), without an effect.
  if (theme !== syncedTheme) {
    setSyncedTheme(theme)
    setSelected(theme)
  }

  const handleApply = async () => {
    await setTheme(selected)
    showToast('Settings preferences updated!')
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-preset-3 text-neutral-950 dark:text-neutral-0">Color Theme</h2>
        <p className="text-preset-5 text-neutral-700 dark:text-neutral-400">Choose your color theme:</p>
      </div>

      <div className="flex flex-col gap-3">
        {OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            icon={<img src={option.icon} alt="" className="size-5 dark:invert" />}
            title={option.title}
            description={option.description}
            selected={selected === option.value}
            onSelect={() => setSelected(option.value)}
          />
        ))}
      </div>

      <button
        onClick={handleApply}
        className="self-end rounded-lg bg-blue-500 px-4 py-3 text-preset-4 text-white"
      >
        Apply Changes
      </button>
    </div>
  )
}
