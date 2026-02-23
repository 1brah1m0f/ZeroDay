import { FakeForumTopic } from '@/lib/fake-data';
import { clsx } from 'clsx';

interface Props {
    topic: FakeForumTopic;
    onClick?: () => void;
}

export default function TopicCard({ topic, onClick }: Props) {
    return (
        <div
            onClick={onClick}
            className={clsx(
                'bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer',
                'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
                topic.pinned && 'ring-2 ring-amber-400/40',
            )}
        >
            <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 min-w-[40px]">
                    <button className="text-gray-400 hover:text-violet-600 transition-colors">▲</button>
                    <span className="text-sm font-semibold text-gray-700">{topic.upvotes}</span>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">▼</button>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        {topic.pinned && <span className="text-xs bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">📌 Sabitlənib</span>}
                        <h3 className="font-semibold text-gray-900 line-clamp-2">{topic.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{topic.body}</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {topic.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-violet-50 text-violet-700 rounded-full px-2.5 py-0.5">{tag}</span>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>👤 {topic.author.name}</span>
                        <span>💬 {topic.replyCount} cavab</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
