'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, ScanLine, BookOpen } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()
  
  // Don't show on dashboard routes
  if (pathname?.startsWith('/dashboard')) return null

  const navItems = [
    { href: '/', label: 'HOME', icon: Home },
    { href: '/explore', label: 'EXPLORE', icon: Compass },
    { href: '/scan', label: 'SCAN', icon: ScanLine },
    { href: '/passport', label: 'PASSPORT', icon: BookOpen },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-sandstone-dark z-50 px-6 py-3 pb-safe">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${isActive ? 'text-saffron' : 'text-charcoal-light'}`}
            >
              <div className={`p-1.5 rounded-full transition-colors ${isActive ? 'bg-saffron/10' : ''}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-semibold tracking-wider">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
