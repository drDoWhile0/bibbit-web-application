import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className='fixed inset-0 bg-[#F5F0E8] flex items-center justify-center px-4 py-10 overflow-y-auto'>
            <div className='w-full max-w-sm'>
                <div className='flex flex-col items-center mb-6'>
                    <Image 
                        src='/assets/companions/green_default.png'
                        alt='Bibbit'
                        width={96}
                        height={96}
                        className='rounded-full mb-3'
                        priority
                    />
                    <h1 className='text-2xl font-bold text-[#2D4A3E]'>Bibbit</h1>
                    <p className='text-sm text-[#6B7280] mt-1'>Your gentle companion for organized caregiving</p>
                </div>
                <div className='bg-white rounded-2xl shadow-sm p-6'>
                    {children}
                </div>
                <p className='text-center text-xs text-[#9CA3AF] mt-6'>
                    By continuing, you agree to Bibbit&apos;s{' '}
                    <span className='underline cursor-pointer'>Terms of Service</span>{' '}
                    &amp;{' '}
                    <span className='underline cursor-pointer'>Privacy Policy</span>
                </p>
            </div>
        </main>
    )
}