import { z } from 'zod';
export declare const RegisterSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    displayName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    email: string;
    password: string;
    displayName: string;
}, {
    username: string;
    email: string;
    password: string;
    displayName: string;
}>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const ListingSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    category: z.ZodEnum<["VOLUNTEER", "EDUCATION", "JOBS", "SERVICES", "EVENTS", "OTHER"]>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    images: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    description: string;
    title: string;
    category: "VOLUNTEER" | "EDUCATION" | "JOBS" | "SERVICES" | "EVENTS" | "OTHER";
    tags: string[];
    images: string[];
}, {
    description: string;
    title: string;
    category: "VOLUNTEER" | "EDUCATION" | "JOBS" | "SERVICES" | "EVENTS" | "OTHER";
    tags?: string[] | undefined;
    images?: string[] | undefined;
}>;
export declare const ListingQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    category: z.ZodOptional<z.ZodEnum<["VOLUNTEER", "EDUCATION", "JOBS", "SERVICES", "EVENTS", "OTHER"]>>;
    q: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    category?: "VOLUNTEER" | "EDUCATION" | "JOBS" | "SERVICES" | "EVENTS" | "OTHER" | undefined;
    q?: string | undefined;
}, {
    category?: "VOLUNTEER" | "EDUCATION" | "JOBS" | "SERVICES" | "EVENTS" | "OTHER" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    q?: string | undefined;
}>;
export declare const GroupSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    privacy: z.ZodDefault<z.ZodEnum<["PUBLIC", "PRIVATE", "INVITE_ONLY"]>>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    tags: string[];
    privacy: "PUBLIC" | "PRIVATE" | "INVITE_ONLY";
}, {
    name: string;
    description: string;
    tags?: string[] | undefined;
    privacy?: "PUBLIC" | "PRIVATE" | "INVITE_ONLY" | undefined;
}>;
export declare const ForumTopicSchema: z.ZodObject<{
    title: z.ZodString;
    body: z.ZodString;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title: string;
    tags: string[];
    body: string;
}, {
    title: string;
    body: string;
    tags?: string[] | undefined;
}>;
export declare const ForumCommentSchema: z.ZodObject<{
    body: z.ZodString;
    parentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    body: string;
    parentId?: string | undefined;
}, {
    body: string;
    parentId?: string | undefined;
}>;
export declare const ExperienceSchema: z.ZodObject<{
    title: z.ZodString;
    organization: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    startDate: z.ZodString;
    endDate: z.ZodOptional<z.ZodString>;
    isCurrent: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    title: string;
    startDate: string;
    organization: string;
    isCurrent: boolean;
    description?: string | undefined;
    endDate?: string | undefined;
}, {
    title: string;
    startDate: string;
    organization: string;
    description?: string | undefined;
    endDate?: string | undefined;
    isCurrent?: boolean | undefined;
}>;
export declare const UpdateProfileSchema: z.ZodObject<{
    displayName: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    avatarUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    displayName?: string | undefined;
    avatarUrl?: string | undefined;
    bio?: string | undefined;
}, {
    displayName?: string | undefined;
    avatarUrl?: string | undefined;
    bio?: string | undefined;
}>;
export declare const SendMessageSchema: z.ZodObject<{
    body: z.ZodString;
    recipientId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    body: string;
    recipientId: string;
}, {
    body: string;
    recipientId: string;
}>;
export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type ListingDto = z.infer<typeof ListingSchema>;
export type CreateGroupDto = z.infer<typeof GroupSchema>;
export type CreateForumTopicDto = z.infer<typeof ForumTopicSchema>;
export type CreateForumCommentDto = z.infer<typeof ForumCommentSchema>;
export type CreateExperienceDto = z.infer<typeof ExperienceSchema>;
export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
export type SendMessageDto = z.infer<typeof SendMessageSchema>;
