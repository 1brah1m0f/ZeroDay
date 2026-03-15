# Secure Image Upload Feature (Hackathon Submission)

This README outlines the **Secure Image Upload Feature** developed for this hackathon. The feature is designed with a strict emphasis on security, code quality, clean architecture, and performance.

## 🎯 Architecture Overview

The system employs a strict separation of concerns between the Next.js Frontend and NestJS Backend:

1. **Frontend (`ImageUpload.tsx`)**: An interactive, reusable React component that performs **client-side validation** (reducing unnecessary server load). It handles image previews and file limitations dynamically.
2. **Backend (`MediaModule`)**: A standalone, secure NestJS module utilizing `multer` for multipart form data processing. It enforces **server-side validation** before writing any buffers to the disk.

## 🛡️ Security Measures (Critical)

Security was the primary focus of this implementation to ensure robust protection against malicious uploads.

- **Strict MIME-Type Validation**: The backend explicitly only accepts `image/jpeg`, `image/png`, and `image/webp`. This prevents attackers from bypassing extension checks.
- **Payload Limits**: Max file size is strictly limited to **5MB** per file to prevent Denial of Service (DoS) attacks via memory exhaustion or storage full limits.
- **Quantity Limits**: The endpoint strictly requires a minimum of **3** and a maximum of **5** files. If this threshold isn't met, uploaded buffers are immediately wiped from the server to save space.
- **UUID File Renaming**: Original filenames provided by the user are **ignored and stripped**. Instead, a cryptographically random `UUIDv4` is generated for the filename (e.g., `550e8400-e29b-41d4-a716-446655440000.png`). This eliminates Directory Traversal Attacks (`../../malicious.exe`) and accidental file overwrites.
- **Authentication**: The upload endpoint is guarded by a `@UseGuards(JwtAuthGuard)` decorator. Only authenticated requests containing a valid JWT Bearer token can upload media.

## 🚀 Performance & Maintainability

- **Client-Side Rejection**: If a user attempts to upload a 20MB file, the frontend immediately rejects it without sending a payload to the backend, conserving bandwidth and server CPU cycles.
- **Standalone Module**: The `MediaModule` is decoupled from existing core business logic (like Profiles or Groups). This ensures maintainability and allows the module to be easily swapped out for a cloud-storage provider (like AWS S3) in the future if the application scales.
- **Modular Component**: `ImageUpload.tsx` receives an `onUploadSuccess` prop, allowing any page to utilize the uploader seamlessly without replicating complex `FormData` logic.

## 🔧 How to Run

1. Ensure both your frontend (`apps/web`) and backend (`apps/api`) are running using `npm run dev` at the project root.
2. Log into the application.
3. Navigate to the **Dashboard** (`/dashboard`).
4. Locate the **Şəkil Yükləmə (Test)** section.
5. Select 3 to 5 images (JPG, PNG, or WEBP) under 5MB each.
6. Click **Yüklə** to securely upload the files to the local `outputs/` directory on the backend.
