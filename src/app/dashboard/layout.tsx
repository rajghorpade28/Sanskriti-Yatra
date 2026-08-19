import Link from 'next/link'
import { LayoutDashboard, CheckSquare, ShieldCheck, Map, Users } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-sandstone-dark flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-charcoal text-white flex flex-col hidden md:flex h-screen sticky top-0">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-tight text-white">SANSKRITI YATRA</h1>
          <p className="text-xs font-semibold tracking-widest text-saffron uppercase mt-0.5">Authority Dashboard</p>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white font-medium transition-colors">
            <LayoutDashboard size={20} className="text-saffron" />
            Intelligence
          </Link>
          <Link href="/dashboard/moderation" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors">
            <CheckSquare size={20} className="text-saffron" />
            Verification Queue
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/40 cursor-not-allowed">
            <Map size={20} />
            Heritage Map
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/40 cursor-not-allowed">
            <Users size={20} />
            Personnel
          </div>
        </nav>

        <div className="p-6 border-t border-white/10 flex items-center gap-3">
          <ShieldCheck size={24} className="text-muted-green" />
          <div>
            <p className="text-sm font-bold">Admin Portal</p>
            <p className="text-xs text-white/60">Maharashtra Region</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white px-8 py-4 border-b border-sandstone flex justify-between items-center md:hidden">
           <h1 className="font-bold text-charcoal">Authority Dashboard</h1>
        </header>
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
