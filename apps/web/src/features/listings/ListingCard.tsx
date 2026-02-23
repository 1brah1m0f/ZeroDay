import { FakeListing } from '@/lib/fake-data';
import { Badge } from '@/components/Badge';
import { clsx } from 'clsx';

interface Props {
    listing: any;
    onClick?: () => void;
}

const typeLabel: Record<string, string> = {
    VOLUNTEER: 'Könüllülük',
    EDUCATION: 'Təhsil',
    JOBS: 'İş yeri',
    SERVICES: 'Xidmət',
    EVENTS: 'Tədbir',
    OTHER: 'Digər',
};

const typeColor: Record<string, 'success' | 'neutral' | 'primary'> = {
    VOLUNTEER: 'success',
    EDUCATION: 'primary',
    JOBS: 'success',
    EVENTS: 'primary',
    SERVICES: 'neutral',
    OTHER: 'neutral',
};

export default function ListingCard({ listing, onClick }: Props) {
    const images = typeof listing.images === 'string' ? JSON.parse(listing.images || '[]') : (listing.images || []);
    const firstImage = images.length > 0 ? images[0] : null;

    return (
        <div
            onClick={onClick}
            className={clsx(
                'bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3 cursor-pointer',
                'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full'
            )}
        >
            <div className="relative w-full overflow-hidden rounded-xl bg-gray-50 h-40 flex items-center justify-center">
                {firstImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={firstImage} alt={listing.title} className="object-cover w-full h-full" />
                ) : (
                    <div className="text-4xl">📄</div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                    <Badge variant={typeColor[listing.category] || 'neutral'}>{typeLabel[listing.category] || listing.category}</Badge>
                </div>
            </div>

            <div className="flex flex-col flex-1">
                <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 mb-1">{listing.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{listing.description}</p>

                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-50">
                    {listing.author?.avatarUrl ? (
                        <img src={listing.author.avatarUrl} alt="" className="w-6 h-6 rounded-full" />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                            {listing.author?.displayName?.[0] || 'K'}
                        </div>
                    )}
                    <span className="text-xs text-gray-600 font-medium truncate">{listing.author?.displayName || 'Anonim'}</span>
                    <span className="ml-auto text-xs text-gray-400">{listing._count?.applications || 0} müraciət</span>
                </div>
            </div>
        </div>
    );
}
