"use client"

import { useState, useEffect } from "react"
import Calendar from "@/components/calendar/calendar"
import Sidebar from "@/components/sidebar/sidebar"
import { Provider } from "react-redux"
import { store } from "@/lib/redux/store"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true)
    } else {
      setSidebarCollapsed(false)
    }
  }, [isMobile])

  return (
    <Provider store={store}>
      <main className="flex min-h-screen bg-white">
        <div className={`transition-all duration-300 ${sidebarCollapsed ? "w-0 overflow-hidden" : "w-64"}`}>
          <Sidebar />
        </div>

        <button
          className="absolute top-4 left-4 z-30 bg-white rounded-full p-1 shadow-md"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>

        <div className="flex-1 overflow-hidden">
          <Calendar />
        </div>
      </main>
    </Provider>
  )
}
