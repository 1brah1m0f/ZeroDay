# ComTech 🤝

[![API Docs](https://img.shields.io/badge/API-Swagger-green)](your-api-url/api/docs)

**ComTech** — Azərbaycanlılar üçün ictimai platforma. Elanlar, qruplar, forum, chat, badge sistemi və profil idarəetməsi bir yerdə.

> **Frontend:** [localhost:3000](http://localhost:3000)
> **API Docs:** [localhost:4000/api/docs](http://localhost:4000/api/docs)

---

## 🌍 Live Demo

- **Web:** https://your-web-url.example
- **API:** https://your-api-url.example/api/v1
- **Swagger:** https://your-api-url.example/api/docs

---

## ✅ Niyə ComTech?

ComTech Azərbaycanlılar üçün elan, icma, forum və real-time ünsiyyəti bir platformada birləşdirir. Məqsəd fərqli sahələrdəki insanları bir araya gətirmək, paylaşımı və əməkdaşlığı sürətləndirməkdir.

---

## ✨ Xüsusiyyətlər

| Modul | Təsvir |
|---|---|
| 📋 **Elanlar** | Könüllülük, Təhsil, İş, Xidmət, Tədbir kateqoriyaları; müraciət, saxla, idarə et. |
| 👥 **Qruplar** | İctimai/Məxfi/Dəvətli qruplar; üzvlük, admin idarəetməsi. |
| 💬 **Forum** | Mövzu yarat, şərh yaz, səs ver; teqlər, nested replies. |
| 🗨️ **Real-time Chat** | Socket.IO əsaslı DM; typing indicator, mesaj tarixi. |
| 👤 **Profil** | LinkedIn-tipli təcrübə bölmələri; badge sistemi (Bronze/Silver/Gold/Platinum). |
| 🔄 **Moderasiya** | Topic lock/pin/delete, listing delete, rol-bazlı nəzarət. |
| 🖼️ **Media Upload** | Cloudinary inteqrasiyası ilə təhlükəsiz şəkil yükləmə. |

---

## 🧱 Texnologiyalar

| Qat | Stack |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, Tailwind CSS, Zustand, React Hook Form + Zod |
| **Backend** | NestJS 10, Prisma ORM, PostgreSQL, Redis, Socket.IO |
| **Shared** | TypeScript, Zod schemas, shared types |
| **Infra** | Docker Compose, Nginx, Turborepo + pnpm workspaces |

---

## 🧭 Arxitektura Qısa Baxış

```
Next.js (apps/web)
   │  REST + WS
   ▼
NestJS (apps/api) ── Prisma ── PostgreSQL
   │
   └── Redis (cache, realtime state)
```

---

## 📁 Layihə Strukturu

```
apps/
├── web/                  # Next.js frontend
└── api/                  # NestJS backend

packages/
├── shared/               # Shared types, zod schemas, constants
└── eslint-config/

infra/
├── docker-compose.yml
├── nginx/
└── scripts/
```

---

## 🚀 Başlamaq

### 1) Tələblər
- Node.js >= 20
- pnpm >= 9
- Docker (PostgreSQL + Redis üçün)

### 2) Quraşdırma

```bash
# 1. Klonlayın
git clone https://github.com/1brah1m0f/ZeroDay.git
cd ComTech

# 2. Environment faylı yaradın
cp .env.example .env

# 3. Asılılıqları quraşdırın
pnpm install

# 4. DB + Redis başladın
cd infra
docker compose up -d db redis
cd ..

# 5. Prisma migration
cd apps/api
pnpm prisma:migrate --name init

# 6. (istəyə görə) seed
pnpm seed
cd ../..

# 7. Dev serverləri başladın
pnpm dev
```

### 3) Ünvanlar

| Xidmət | URL |
|---|---|
| 🌐 Frontend | http://localhost:3000 |
| ⚙️ API | http://localhost:4000/api/v1 |
| 📖 Swagger | http://localhost:4000/api/docs |
| 🗄️ Prisma Studio | `cd apps/api && pnpm prisma:studio` |

---

## 🔑 Demo Hesabları

Demo hesabların məlumatları repo-da saxlanmır.

- `SEED_DEMO_PASSWORD` dəyərini `.env` faylında təyin edin.
- Hesab siyahısı üçün **DEMO_ACCOUNTS.md (commit olunmur)** faylına baxın.

---

## 🔌 API Endpointləri (Qısa)

| Method | Endpoint | Təsvir |
|---|---|---|
| POST | /auth/register | Qeydiyyat |
| POST | /auth/login | Daxil ol |
| GET | /auth/me | Cari istifadəçi |
| GET | /listings | Elan siyahısı |
| POST | /listings | Elan yarat |
| GET | /groups | Qrup siyahısı |
| POST | /groups | Qrup yarat |
| GET | /forum/topics | Forum mövzuları |
| POST | /forum/topics | Mövzu yarat |
| GET | /chat/conversations | Söhbətlər |
| POST | /chat/messages | Mesaj göndər |
| GET | /badges | Bütün nişanlar |
| GET | /users/:username | Publik profil |
| POST | /media/upload | Fayl yüklə |

---

## 🗄️ Verilənlər Bazası və Prisma

```bash
# Prisma client
pnpm prisma:generate

# Migration
pnpm prisma:migrate

# Studio
pnpm prisma:studio
```

---

## 🔒 Environment Dəyişənləri

`.env` faylında əsas dəyişənlər:

```env
# App
NODE_ENV=development

# Database
DATABASE_URL=postgresql://comtech:comtech_pass@localhost:5432/comtech_db
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=30d

# API
API_PORT=4000
API_PREFIX=api/v1

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:4000

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email (SMTP)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@comtech.az
```

---

## 🧪 Scriptlər

| Səviyyə | Komanda | Təsvir |
|---|---|---|
| Root | pnpm dev | Bütün servisləri dev rejimdə başladır |
| Root | pnpm build | Bütün paketləri build edir |
| Root | pnpm lint | Lint işləyir |
| API | pnpm --filter @comtech/api dev | NestJS dev |
| Web | pnpm --filter @comtech/web dev | Next.js dev |

---

## ❗ Troubleshooting

- `ECONNREFUSED` → Docker ilə DB/Redis işlədiyinə əmin olun.
- `JWT` error → `.env` içində `JWT_SECRET` boş olmamalıdır.
- `NEXT_PUBLIC_API_URL` → Web-də API URL düzgün olmalıdır.

---

## 📄 Lisenziya

MIT © 2026 ComTech Team