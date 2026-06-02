'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
    LayoutDashboard,
    SquarePen,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'

const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/board-editor', label: 'Board Editor', icon: SquarePen },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [collapsed, setCollapsed] = useState(false);

    const handleLogOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/auth/login')
    }

    return (
        <aside
            className={`flex flex-col bg-white border-r border-[#E5E7EB] transition-all duration-300 ${
                collapsed ? 'w-[72px]' : 'w-[220px]'
            }`}
        >
            {/* Logo */}
            <div className={`flex items-center gap-3 px-4 py-5 border-b border-[#E5E7EB] ${ collapsed ? 'justify-center' : '' }`}>
                <Image 
                    src="/assets/companions/green_default.png"
                    alt="Bibbit"
                    width={36}
                    height={36}
                    className='rounded-full flex-shrink-0'
                />
                {!collapsed && (
                    <span className='font-bold text-[#2D4A3E] text-lg'>Bibbit</span>
                )}
            </div>

            {/* Nav Links */}
            <nav className='flex-1 py-4 flex flex-col gap-1 px-2'>
                {navLinks.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                active
                                ? 'bg-[#4A7C59] text-white'
                                : 'text-[#6B7280] hover:bg-[#F5F0E8] hover:text-[#2D4A3E]'
                            } ${collapsed ? 'justify-center' : ''}`}
                        >
                            <Icon size={18} className='flex-shrink-0' />
                            { !collapsed && <span>{label}</span> }
                        </Link>
                    )
                })}
            </nav>
            
            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className={`flex items-center gap-2 mx-2 mb-2 px-3 py-2 rounded-xl text-xs text-[#9CA3AF] hover:bg-[#F5F0E8] transition-all ${
                    collapsed ? 'justify-center' : ''
                }`}
            >
                { collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} /> }
                { !collapsed && <span>Collapse</span> }
            </button>
            
            {/* Cargiver profile + logout */}
            <div className={`border-t border-[#E5E7EB] p-3 flex items-center gap-3 ${ collapsed ? 'justify-center' : '' }`} >
                <div className='w-8 h-8 rounded-full bg-[#4A7C59] flex items-center justify-center text-white text-xs font-bold flex-shrink-0'>
                    C
                </div>
                { !collapsed && (
                    <div className='flex-1 min-w-0'>
                        <p className='text-xs font-semibold text-[#2D4A3E] truncate'>Caregiver</p>
                        <button
                            onClick={handleLogOut}
                            className='flex items-center gap-1 text-xs text-[#9CA3AF] hover:text-red-500 transition-colors mt-0.5'
                        >
                            <LogOut size={11} />
                            <span>Logout</span>
                        </button>
                    </div>
                ) }
            </div>
        </aside>
    )
}