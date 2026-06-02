'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createProfile } from '@/app/auth/actions'

export default function LoginForm() {
    const router = useRouter();
    const [tab, setTab] = useState<'login' | 'signup'>('login')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setError(null)
        setLoading(true)
        const supabase = createClient()

        if (tab === 'login') {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) {
                setError(error.message)
                setLoading(false)
                return
            }
        } else {
            const { data, error } = await supabase.auth.signUp({ email, password })
            if (error) {
                setError(error.message)
                setLoading(false)
                return
            }

            const user = data.user
            if (user) {
                try {
                    await createProfile(user.id, fullName, user.email!)
                } catch (err: any) {
                    setError(err.message)
                    setLoading(false)
                    return
                }
            }
        }

        router.push('/dashboard')
    }

    return (
        <div>
            {/* Tab switcher */}
            <div className="flex rounded-xl bg-[#F5F0E8] p-1 mb-6">
                <button
                    onClick={() => setTab('login')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        tab === 'login'
                            ? 'bg-[#4A7C59] text-white shadow-sm'
                            : 'text-[#6B7280]'
                    }`}
                >
                  Login
                </button>
                <button
                    onClick={() => setTab('signup')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        tab === 'signup'
                            ? 'bg-[#4A7C59] text-white shadow-sm'
                            : 'text-[#6B7280]'
                    }`}
                >
                  Sign Up
                </button>
            </div>

            {/* Full name — signup only */}
            {tab === 'signup' && (
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7C59] placeholder:text-[#9CA3AF]"
                    />
                </div>
            )}

            {/* Email */}
            <div className="mb-4">
                <input
                    type="email"
                    placeholder="hello@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7C59] placeholder:text-[#9CA3AF]"
                />
            </div>

            {/* Password */}
            <div className="mb-2">
                <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7C59] placeholder:text-[#9CA3AF]"
                />
            </div>

            {tab === 'login' && (
                <div className="text-right mb-4">
                    <span className="text-xs text-[#6B7280] cursor-pointer hover:underline">Forgot?</span>
                </div>
            )}

            {/* Error */}
            {error && (
                <p className="text-sm text-red-500 mb-4">{error}</p>
            )}

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 bg-[#4A7C59] text-white rounded-xl text-sm font-semibold hover:bg-[#3D6B4A] transition-colors disabled:opacity-60"
            >
                {loading ? 'Please wait...' : tab === 'login' ? 'Welcome Back →' : 'Create Account →'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-[#E5E7EB]" />
                <span className="text-xs text-[#9CA3AF]">OR CONTINUE WITH</span>
                <div className="flex-1 h-px bg-[#E5E7EB]" />
            </div>

            {/* Social */}
            <div className="flex flex-col gap-3">
                <button className="w-full py-3 border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors">
                    G &nbsp; Google
                </button>
                <button className="w-full py-3 border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors">
                    🍎 &nbsp; Apple
                </button>
            </div>

            {/* Quote */}
            <p className="text-center text-xs text-[#9CA3AF] italic mt-6">
                &ldquo;Caring for others is the highest form of love.&rdquo;
            </p>
        </div>
    )
}