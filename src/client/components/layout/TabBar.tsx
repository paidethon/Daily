import { CalendarDays, LayoutGrid, History, BookOpen, User } from 'lucide-react'
import type { TabId } from '../../App'

interface TabBarProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  isDark: boolean
}

const TABS: { id: TabId; label: string; icon: typeof CalendarDays }[] = [
  { id: 'today', label: '今日', icon: CalendarDays },
  { id: 'gallery', label: '图墙', icon: LayoutGrid },
  { id: 'recall', label: '回顾', icon: History },
  { id: 'albums', label: '画册', icon: BookOpen },
  { id: 'me', label: '我的', icon: User },
]

export default function TabBar({ activeTab, onTabChange, isDark }: TabBarProps) {
  return (
    <nav
      className="flex shrink-0"
      style={{
        height: 'calc(var(--spacing-tab-height) + var(--spacing-safe-bottom))',
        paddingBottom: 'var(--spacing-safe-bottom)',
        background: isDark ? '#222222' : '#FFFFFF',
        borderTop: `0.5px solid ${isDark ? '#333333' : '#F0EDE8'}`,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        boxShadow: isDark
          ? '0 -2px 16px rgba(0,0,0,0.3)'
          : '0 -2px 16px rgba(0,0,0,0.04)',
      }}
    >
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id
        let color: string
        if (isDark) {
          color = isActive ? '#FFFFFF' : '#666666'
        } else {
          color = isActive ? '#1A1A1A' : '#BBBBBB'
        }

        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className="flex-1 flex flex-col items-center justify-center gap-1 bg-transparent border-none cursor-pointer transition-colors duration-200"
            style={{ color }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
            <span
              className="text-[10px] leading-none"
              style={{ fontWeight: isActive ? 600 : 500 }}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
