interface Experience {
    id: string;
    title: string;
    organization: string;
    description?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
}

interface Props {
    experience: Experience;
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('az-AZ', { year: 'numeric', month: 'short' });
}

export default function ExperienceCard({ experience }: Props) {
    return (
        <div className="flex gap-4 py-4 border-b border-gray-50 last:border-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-xl flex-shrink-0">
                🏢
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{experience.title}</p>
                <p className="text-sm text-violet-600">{experience.organization}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(experience.startDate)} — {experience.isCurrent ? 'İndiyə qədər' : experience.endDate ? formatDate(experience.endDate) : ''}
                </p>
                {experience.description && (
                    <p className="text-sm text-gray-500 mt-1">{experience.description}</p>
                )}
            </div>
        </div>
    );
}
