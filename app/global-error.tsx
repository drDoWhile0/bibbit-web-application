'use client'

import { useEffect } from 'react'

export default function GlobalError({
    error,
    unstable_retry,
}: {
    error: Error & { digest?: string }
    unstable_retry: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <html>
            <body style={{ margin: 0, background: '#F5F0E8', fontFamily: 'sans-serif' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '40px', maxWidth: '400px', textAlign: 'center', border: '1px solid #E5E7EB' }}>
                        <p style={{ fontSize: '2rem', marginBottom: '8px' }}>⚠️</p>
                        <h2 style={{ color: '#2D4A3E', marginBottom: '8px' }}>Something went wrong</h2>
                        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>
                            An unexpected error occurred. Please try again.
                        </p>
                        <button
                            onClick={unstable_retry}
                            style={{ background: '#4A7C59', color: 'white', border: 'none', borderRadius: '12px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer' }}
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    )
}
