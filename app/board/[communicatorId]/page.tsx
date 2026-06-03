import { createServiceClient } from "@/lib/supabase/server"
import ButtonTile from "@/components/board/ButtonTile"

interface Props {
    params: { communicatorId: string }
}

export default async function BoardPage({ params }: { params: Promise<{ communicatorId: string }> }) {
    const { communicatorId } = await params
    const supabase = createServiceClient()

    const { data: board } = await supabase
        .from('button_boards')
        .select('*, buttons(*)')
        .eq('communicator_id', communicatorId)
        .eq('is_active', true)
        .single()

    if (!board) {
        return (
            <div className='flex items-center justify-center min-h-screen bg-[#F5F0E8]'>
                <p className='text-[#9CA3AF] text-sm'>No active board found.</p>
            </div>
        )
    }

    const buttons = [...(board.buttons ?? [])].sort((a, b) => a.position - b.position)

    return (
        <div className="min-h-screen bg-[#F5F0E8] p-4">
            <div className='grid grid-cols-3 sm:grid-cols-4 gap-4 max-w-2xl mx-auto'>
                {buttons.map((btn) => (
                    <ButtonTile key={btn.id} btn={btn} communicatorId={communicatorId} />
                ))}
            </div>
        </div>
    )
}