import { FakeCommunity } from '@/lib/fake-data';
import { clsx } from 'clsx';

interface Props {
    community: FakeCommunity;
    onJoin?: (slug: string) => void;
}

export default function CommunityCard({ community, onJoin }: Props) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {community.name.charAt(0)}
                </div>
                <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{community.name}</h3>
                    <p className="text-xs text-gray-400">👥 {community.memberCount} üzv</p>
                </div>
            </div>
            <p className="text-sm text-gray-500 line-clamp-2">{community.description}</p>
            <button
                onClick={() => onJoin?.(community.slug)}
                className={clsx(
                    'mt-auto w-full py-2 rounded-xl text-sm font-medium transition-colors',
                    community.isJoined
                        ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        : 'bg-violet-600 text-white hover:bg-violet-700',
                )}
            >
                {community.isJoined ? 'Qoşulmusunuz' : 'İcmaya qoşul'}
            </button>
        </div>
    );
}
