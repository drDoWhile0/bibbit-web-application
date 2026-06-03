import Image from 'next/image'

interface Props {
    name: string
    avatarUrl: string
    isSelected?: boolean
    onClick?: () => void
}

export default function CommunicatorCard({ name, avatarUrl, isSelected, onClick }: Props) {
    return (
        <div 
            onClick={onClick}
            className={`bg-white rounded-2xl p-5 shadow-sm border flex flex-col items-center gap-3 transition-all cursor-pointer hover:shadow-md ${
                isSelected
                    ? 'border-[#4A7C59] ring-2 ring-[#4A7C59] ring-offset-1'
                    : 'border-[#E5E7EB] hover:border-[#4A7C59]'
            }`}
        >
            <Image
                src={avatarUrl}
                alt={name}
                width={72}
                height={72}
                className='rounded-full'
            />
            <p className='font-semibold text-[#2D4A3E] text-sm'>{ name }</p>
        </div>
    )
}