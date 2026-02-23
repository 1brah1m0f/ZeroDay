import { clsx } from 'clsx';

interface Props {
    body: string;
    isMine: boolean;
    senderName?: string;
    createdAt: string;
}

export default function MessageBubble({ body, isMine, senderName, createdAt }: Props) {
    return (
        <div className={clsx('flex gap-2 mb-3', isMine ? 'justify-end' : 'justify-start')}>
            {!isMine && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {senderName?.charAt(0) ?? '?'}
                </div>
            )}
            <div className={clsx('max-w-[70%] flex flex-col gap-1', isMine ? 'items-end' : 'items-start')}>
                {!isMine && senderName && (
                    <span className="text-xs text-gray-400 px-1">{senderName}</span>
                )}
                <div
                    className={clsx(
                        'px-4 py-2.5 rounded-2xl text-sm',
                        isMine
                            ? 'bg-violet-600 text-white rounded-tr-sm'
                            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm',
                    )}
                >
                    {body}
                </div>
                <span className="text-xs text-gray-300 px-1">
                    {new Date(createdAt).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    );
}
