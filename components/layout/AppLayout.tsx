import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex min-h-screen bg-[#F5F0E8]'>
            <Sidebar />
            <div className='flex flex-col flex-1 min-w-0'>
                <TopBar />
                <main className='flex-1 p-6 overflow-y-auto'>
                    { children }
                </main>
            </div>
        </div>
    )
}