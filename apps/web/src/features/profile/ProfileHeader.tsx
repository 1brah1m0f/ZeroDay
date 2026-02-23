interface Profile {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    bio?: string;
    role: string;
    createdAt: string;
}

interface Props {
    profile: Profile;
}

export default function ProfileHeader({ profile }: Props) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600" />
            <div className="px-6 pb-6">
                <div className="flex items-end gap-4 -mt-10 mb-4">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 border-4 border-white flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0">
                        {profile.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            profile.displayName.charAt(0)
                        )}
                    </div>
                    <div className="pb-1">
                        <h1 className="text-xl font-bold text-gray-900">{profile.displayName}</h1>
                        <p className="text-sm text-gray-400">@{profile.username}</p>
                    </div>
                </div>
                {profile.bio && <p className="text-gray-600 text-sm">{profile.bio}</p>}
            </div>
        </div>
    );
}
