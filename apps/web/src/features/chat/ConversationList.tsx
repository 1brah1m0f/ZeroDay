interface Conversation {
    id: string;
    participant: { displayName: string; username: string; avatarUrl?: string };
    lastMessage?: string;
    unreadCount?: number;
    updatedAt: string;
}

interface Props {
    conversations: Conversation[];
    activeId?: string;
    onSelect?: (id: string) => void;
}

export default function ConversationList({ conversations, activeId, onSelect }: Props) {
    if (!conversations.length) {
        return <p className="p-4 text-sm text-gray-400 text-center">Heç bir söhbət yoxdur</p>;
    }

    return (
        <ul className="divide-y divide-gray-50">
            {conversations.map((conv) => (
                <li
                    key={conv.id}
                    onClick={() => onSelect?.(conv.id)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-violet-50/60 transition-colors ${activeId === conv.id ? 'bg-violet-50' : ''
                        }`}
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {conv.participant.displayName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">{conv.participant.displayName}</p>
                        {conv.lastMessage && (
                            <p className="text-xs text-gray-400 truncate">{conv.lastMessage}</p>
                        )}
                    </div>
                    {conv.unreadCount ? (
                        <span className="bg-violet-600 text-white text-xs rounded-full px-2 py-0.5 flex-shrink-0">
                            {conv.unreadCount}
                        </span>
                    ) : null}
                </li>
            ))}
        </ul>
    );
}
