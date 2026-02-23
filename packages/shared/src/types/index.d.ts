export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN';
export interface User {
    id: string;
    username: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    bio?: string;
    role: UserRole;
    isVerified: boolean;
    createdAt: string;
}
export interface PublicProfile extends Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl' | 'bio' | 'createdAt'> {
    badges: Badge[];
    experiences: Experience[];
    listingCount: number;
    groupCount: number;
}
export type ListingStatus = 'ACTIVE' | 'CLOSED' | 'DRAFT';
export type ListingCategory = 'VOLUNTEER' | 'EDUCATION' | 'JOBS' | 'SERVICES' | 'EVENTS' | 'OTHER';
export interface Listing {
    id: string;
    title: string;
    description: string;
    category: ListingCategory;
    status: ListingStatus;
    images: string[];
    author: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
    tags: string[];
    viewCount: number;
    createdAt: string;
    updatedAt: string;
}
export type GroupPrivacy = 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY';
export interface Group {
    id: string;
    name: string;
    slug: string;
    description: string;
    privacy: GroupPrivacy;
    coverUrl?: string;
    avatarUrl?: string;
    memberCount: number;
    owner: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
    tags: string[];
    createdAt: string;
}
export interface GroupMember {
    userId: string;
    groupId: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
    joinedAt: string;
}
export interface ForumTopic {
    id: string;
    title: string;
    slug: string;
    body: string;
    author: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
    tags: string[];
    upvotes: number;
    commentCount: number;
    isPinned: boolean;
    isLocked: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface ForumComment {
    id: string;
    body: string;
    topicId: string;
    parentId?: string;
    author: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
    upvotes: number;
    replies?: ForumComment[];
    createdAt: string;
    updatedAt: string;
}
export interface Conversation {
    id: string;
    participants: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>[];
    lastMessage?: ChatMessage;
    updatedAt: string;
}
export interface ChatMessage {
    id: string;
    conversationId: string;
    sender: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
    body: string;
    isRead: boolean;
    createdAt: string;
}
export type BadgeTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
export interface Badge {
    id: string;
    name: string;
    description: string;
    iconUrl: string;
    tier: BadgeTier;
}
export interface UserBadge {
    badge: Badge;
    awardedAt: string;
}
export interface Experience {
    id: string;
    userId: string;
    title: string;
    organization: string;
    description?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    createdAt: string;
}
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
export interface ApiError {
    statusCode: number;
    message: string | string[];
    error?: string;
}
