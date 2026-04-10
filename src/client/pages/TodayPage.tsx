import { useState } from 'react'
import { Settings } from 'lucide-react'

type SubTab = 'today' | 'month' | 'year'

const SUB_TAB_LABELS: Record<SubTab, string> = {
  today: '今日',
  month: '本月',
  year: '今年',
}

export default function TodayPage() {
  const [subTab, setSubTab] = useState<SubTab>('today')

  return (
    <div className="min-h-full page-enter" style={{ background: 'var(--color-bg-primary)' }}>
      <div
        className="sticky top-0 z-50 flex items-baseline gap-4 px-5 pt-4 pb-3"
        style={{ background: 'var(--color-bg-primary)' }}
      >
        {(['today', 'month', 'year'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`bg-transparent border-none cursor-pointer transition-all duration-200 ${
              subTab === tab
                ? 'text-2xl font-bold border-b-2 pb-0.5'
                : 'text-sm font-normal pb-1'
            }`}
            style={{
              color: subTab === tab ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              borderColor: subTab === tab ? 'var(--color-accent)' : 'transparent',
            }}
          >
            {SUB_TAB_LABELS[tab]}
          </button>
        ))}
        <button
          className="ml-auto bg-transparent border-none cursor-pointer p-1"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="px-4 py-16 text-center" style={{ color: 'var(--color-text-tertiary)' }}>
        {subTab === 'today' && '今日视图 — 等待实现'}
        {subTab === 'month' && '本月视图 — 等待实现'}
        {subTab === 'year' && '今年视图 — 等待实现'}
      </div>
    </div>
  )
}
