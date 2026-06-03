'use client'

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    KeyboardSensor,
} from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
    arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from "@dnd-kit/utilities"
import { updateButtonPositions } from "@/app/dashboard/communicators/[id]/actions"

interface Button {
    id: string
    label: string
    image_url?: string
    category: 'feeling' | 'need'
    color: string
    position: number
    tts_text?: string
}

function SortableButton({ btn }: { btn: Button }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: btn.id,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: btn.color,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className='flex flex-col items-center justify-center rounded-2xl p-4 text-white text-sm font-medium text-center shadow-sm aspect-square cursor-grab active:cursor-grabbing'
        >
            {btn.image_url && <span className='text-3xl mb-1'>{btn.image_url}</span>}
            <span>{btn.label}</span>
        </div>
    )
}

interface Props {
    buttons: Button[]
    onReorder: (reordered: Button[]) => void
}

export default function DragGrid({ buttons, onReorder }: Props) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = buttons.findIndex((b) => b.id === active.id)
        const newIndex = buttons.findIndex((b) => b.id === over.id)
        const reordered = arrayMove(buttons, oldIndex, newIndex)

        onReorder(reordered)

        const updates = reordered.map((btn, index) => ({ id: btn.id, position: index }))
        await updateButtonPositions(updates)
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={buttons.map((b) => b.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                    {buttons.map((btn) => (
                        <SortableButton key={btn.id} btn={btn} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}