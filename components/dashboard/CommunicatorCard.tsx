import Image from 'next/image'

interface Props {
    name: string
    avatarUrl: string
}

export default function CommunicatorCard({ name, avatarUrl }: Props) {
    return (
        <div className='bg-white rounded-2xl p-5 shadow-sm border border-[#E5E7EB] flex flex-col items-center gap-3'>
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