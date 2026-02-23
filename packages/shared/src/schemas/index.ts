import { z } from 'zod';

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, 'Minimum 3 simvol')
    .max(30, 'Maximum 30 simvol')
    .regex(/^[a-zA-Z0-9_]+$/, 'Yalnız hərf, rəqəm və alt xətt'),
  email: z.string().email('Düzgün email daxil edin'),
  password: z.string().min(8, 'Minimum 8 simvol'),
  displayName: z.string().min(2, 'Minimum 2 simvol').max(50, 'Maximum 50 simvol'),
});

export const LoginSchema = z.object({
  email: z.string().email('Düzgün email daxil edin'),
  password: z.string().min(1, 'Şifrə daxil edin'),
});

// ─── Listing ─────────────────────────────────────────────────────────────────
export const ListingSchema = z.object({
  title: z.string().min(5, 'Minimum 5 simvol').max(100, 'Maximum 100 simvol'),
  description: z.string().min(20, 'Minimum 20 simvol').max(5000, 'Maximum 5000 simvol'),
  category: z.enum(['VOLUNTEER', 'EDUCATION', 'JOBS', 'SERVICES', 'EVENTS', 'OTHER']),
  tags: z.array(z.string()).max(10, 'Maximum 10 tag').default([]),
  images: z.array(z.string().url()).max(10, 'Maximum 10 şəkil').default([]),
});

export const ListingQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  category: z.enum(['VOLUNTEER', 'EDUCATION', 'JOBS', 'SERVICES', 'EVENTS', 'OTHER']).optional(),
  q: z.string().optional(),
});

// ─── Group ───────────────────────────────────────────────────────────────────
export const GroupSchema = z.object({
  name: z.string().min(3, 'Minimum 3 simvol').max(80, 'Maximum 80 simvol'),
  description: z.string().min(10, 'Minimum 10 simvol').max(2000, 'Maximum 2000 simvol'),
  privacy: z.enum(['PUBLIC', 'PRIVATE', 'INVITE_ONLY']).default('PUBLIC'),
  tags: z.array(z.string()).max(10).default([]),
});

// ─── Forum ───────────────────────────────────────────────────────────────────
export const ForumTopicSchema = z.object({
  title: z.string().min(5, 'Minimum 5 simvol').max(200, 'Maximum 200 simvol'),
  body: z.string().min(10, 'Minimum 10 simvol').max(10000, 'Maximum 10000 simvol'),
  tags: z.array(z.string()).max(10).default([]),
});

export const ForumCommentSchema = z.object({
  body: z.string().min(1, 'Boş ola bilməz').max(5000, 'Maximum 5000 simvol'),
  parentId: z.string().uuid().optional(),
});

// ─── Experience ───────────────────────────────────────────────────────────────
export const ExperienceSchema = z.object({
  title: z.string().min(2).max(100),
  organization: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  isCurrent: z.boolean().default(false),
});

// ─── Profile ─────────────────────────────────────────────────────────────────
export const UpdateProfileSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  bio: z.string().max(300).optional(),
  avatarUrl: z.string().url().optional(),
});

// ─── Chat ─────────────────────────────────────────────────────────────────────
export const SendMessageSchema = z.object({
  body: z.string().min(1).max(2000),
  recipientId: z.string().uuid(),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type ListingDto = z.infer<typeof ListingSchema>;
export type CreateGroupDto = z.infer<typeof GroupSchema>;
export type CreateForumTopicDto = z.infer<typeof ForumTopicSchema>;
export type CreateForumCommentDto = z.infer<typeof ForumCommentSchema>;
export type CreateExperienceDto = z.infer<typeof ExperienceSchema>;
export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
export type SendMessageDto = z.infer<typeof SendMessageSchema>;
