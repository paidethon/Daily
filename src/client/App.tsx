import { useState, useCallback } from 'react'
import TabBar from './components/layout/TabBar'
import PageContainer from './components/layout/PageContainer'
import TodayPage from './pages/TodayPage'
import GalleryPage from './pages/GalleryPage'
import RecallPage from './pages/RecallPage'
import AlbumsPage from './pages/AlbumsPage'
import MePage from './pages/MePage'

export type TabId = 'today' | 'gallery' | 'recall' | 'albums' | 'me'

const DARK_TABS: TabId[] = ['gallery', 'recall', 'albums']

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('today')
  const isDark = DARK_TABS.includes(activeTab)

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab)
  }, [])

  const renderPage = () => {
    switch (activeTab) {
      case 'today': return <TodayPage />
      case 'gallery': return <GalleryPage />
      case 'recall': return <RecallPage />
      case 'albums': return <AlbumsPage />
      case 'me': return <MePage />
    }
  }

  return (
    <div
      className="flex flex-col h-full max-w-[480px] mx-auto relative"
      style={{ background: isDark ? 'var(--color-dark-bg)' : 'var(--color-bg-primary)' }}
    >
      <PageContainer>{renderPage()}</PageContainer>
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} isDark={isDark} />
    </div>
  )
}
