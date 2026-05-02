import React from 'react'
import Sidebar from './Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  showDecor?: boolean
}

function DashboardLayout({ children, showDecor }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content-wrapper">
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout
