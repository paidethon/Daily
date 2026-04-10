import { type ReactNode } from 'react'

export default function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide"
      style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}
    >
      {children}
    </div>
  )
}
