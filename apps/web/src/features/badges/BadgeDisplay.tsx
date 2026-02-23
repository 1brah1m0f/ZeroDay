interface Badge {
    id: string;
    name: string;
    description: string;
    iconUrl: string;
    tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
    awardedAt?: string;
}

interface Props {
    badge: Badge;
}

const tierColors: Record<string, string> = {
    BRONZE: 'from-amber-600 to-amber-800',
    SILVER: 'from-gray-400 to-gray-600',
    GOLD: 'from-yellow-400 to-amber-500',
    PLATINUM: 'from-violet-400 to-purple-600',
};

const tierLabel: Record<string, string> = {
    BRONZE: 'Bürünc',
    SILVER: 'Gümüş',
    GOLD: 'Qızıl',
    PLATINUM: 'Platın',
};

export default function BadgeDisplay({ badge }: Props) {
    return (
        <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200 text-center">
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${tierColors[badge.tier]} flex items-center justify-center text-2xl shadow-lg`}>
                {badge.iconUrl.startsWith('http') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={badge.iconUrl} alt={badge.name} className="w-8 h-8" />
                ) : (
                    <span>{badge.iconUrl}</span>
                )}
            </div>
            <div>
                <p className="font-semibold text-sm text-gray-800">{badge.name}</p>
                <p className="text-xs text-gray-400">{tierLabel[badge.tier]}</p>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2">{badge.description}</p>
        </div>
    );
}
