"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageSchema = exports.UpdateProfileSchema = exports.ExperienceSchema = exports.ForumCommentSchema = exports.ForumTopicSchema = exports.GroupSchema = exports.ListingQuerySchema = exports.ListingSchema = exports.LoginSchema = exports.RegisterSchema = void 0;
const zod_1 = require("zod");
exports.RegisterSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, 'Minimum 3 simvol')
        .max(30, 'Maximum 30 simvol')
        .regex(/^[a-zA-Z0-9_]+$/, 'Yalnız hərf, rəqəm və alt xətt'),
    email: zod_1.z.string().email('Düzgün email daxil edin'),
    password: zod_1.z.string().min(8, 'Minimum 8 simvol'),
    displayName: zod_1.z.string().min(2, 'Minimum 2 simvol').max(50, 'Maximum 50 simvol'),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Düzgün email daxil edin'),
    password: zod_1.z.string().min(1, 'Şifrə daxil edin'),
});
exports.ListingSchema = zod_1.z.object({
    title: zod_1.z.string().min(5, 'Minimum 5 simvol').max(100, 'Maximum 100 simvol'),
    description: zod_1.z.string().min(20, 'Minimum 20 simvol').max(5000, 'Maximum 5000 simvol'),
    category: zod_1.z.enum(['VOLUNTEER', 'EDUCATION', 'JOBS', 'SERVICES', 'EVENTS', 'OTHER']),
    tags: zod_1.z.array(zod_1.z.string()).max(10, 'Maximum 10 tag').default([]),
    images: zod_1.z.array(zod_1.z.string().url()).max(10, 'Maximum 10 şəkil').default([]),
});
exports.ListingQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(50).default(20),
    category: zod_1.z.enum(['VOLUNTEER', 'EDUCATION', 'JOBS', 'SERVICES', 'EVENTS', 'OTHER']).optional(),
    q: zod_1.z.string().optional(),
});
exports.GroupSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Minimum 3 simvol').max(80, 'Maximum 80 simvol'),
    description: zod_1.z.string().min(10, 'Minimum 10 simvol').max(2000, 'Maximum 2000 simvol'),
    privacy: zod_1.z.enum(['PUBLIC', 'PRIVATE', 'INVITE_ONLY']).default('PUBLIC'),
    tags: zod_1.z.array(zod_1.z.string()).max(10).default([]),
});
exports.ForumTopicSchema = zod_1.z.object({
    title: zod_1.z.string().min(5, 'Minimum 5 simvol').max(200, 'Maximum 200 simvol'),
    body: zod_1.z.string().min(10, 'Minimum 10 simvol').max(10000, 'Maximum 10000 simvol'),
    tags: zod_1.z.array(zod_1.z.string()).max(10).default([]),
});
exports.ForumCommentSchema = zod_1.z.object({
    body: zod_1.z.string().min(1, 'Boş ola bilməz').max(5000, 'Maximum 5000 simvol'),
    parentId: zod_1.z.string().uuid().optional(),
});
exports.ExperienceSchema = zod_1.z.object({
    title: zod_1.z.string().min(2).max(100),
    organization: zod_1.z.string().min(2).max(100),
    description: zod_1.z.string().max(1000).optional(),
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime().optional(),
    isCurrent: zod_1.z.boolean().default(false),
});
exports.UpdateProfileSchema = zod_1.z.object({
    displayName: zod_1.z.string().min(2).max(50).optional(),
    bio: zod_1.z.string().max(300).optional(),
    avatarUrl: zod_1.z.string().url().optional(),
});
exports.SendMessageSchema = zod_1.z.object({
    body: zod_1.z.string().min(1).max(2000),
    recipientId: zod_1.z.string().uuid(),
});
//# sourceMappingURL=index.js.map