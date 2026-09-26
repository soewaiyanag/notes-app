import { useState } from 'react'
import OptionCard from '@/components/settings/OptionCard'
import { usePreferences } from '@/context/PreferencesContext'
import { useToast } from '@/context/ToastContext'
import type { FontTheme } from '@/lib/types'

const OPTIONS: { value: FontTheme; fontClass: string; title: string; description: string }[] = [
  { value: 'sans', fontClass: 'font-sans', title: 'Sans-serif', description: 'Clean and modern, easy to read.' },
  { value: 'serif', fontClass: 'font-serif', title: 'Serif', description: 'Classic and elegant for a timeless feel.' },
  { value: 'mono', fontClass: 'font-mono', title: 'Monospace', description: 'Code-like, great for a technical vibe.' },
]

export default function FontThemePage() {
  const { fontTheme, setFontTheme } = usePreferences()
  const { showToast } = useToast()
  const [selected, setSelected] = useState(fontTheme)
  const [syncedFontTheme, setSyncedFontTheme] = useState(fontTheme)

  // Re-derive the local selection whenever the loaded preference changes
  // (e.g. it arrives after this component mounts), without an effect.
  if (fontTheme !== syncedFontTheme) {
    setSyncedFontTheme(fontTheme)
    setSelected(fontTheme)
  }

  const handleApply = async () => {
    await setFontTheme(selected)
    showToast('Settings preferences updated!')
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-preset-3 text-neutral-950 dark:text-neutral-0">Font Theme</h2>
        <p className="text-preset-5 text-neutral-700 dark:text-neutral-400">Choose your font theme:</p>
      </div>

      <div className="flex flex-col gap-3">
        {OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            icon={<span className={option.fontClass}>Aa</span>}
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
