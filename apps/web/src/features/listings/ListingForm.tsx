'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Select } from '@/components/Select';
import { useAuthStore } from '@/lib/store';

const schema = z.object({
    title: z.string().min(5, 'Başlıq ən az 5 simvol olmalıdır'),
    description: z.string().min(20, 'Təsvir ən az 20 simvol olmalıdır'),
    category: z.string().min(1, 'Kateqoriya seçin'),
});

type FormData = z.infer<typeof schema>;

const categoryOptions = [
    { value: 'EDUCATION', label: 'Təhsil' },
    { value: 'VOLUNTEER', label: 'Könüllülük' },
    { value: 'TECH', label: 'Texnologiya' },
    { value: 'DESIGN', label: 'Dizayn' },
    { value: 'LANGUAGE', label: 'Dil öyrənmə' },
    { value: 'CAREER', label: 'Karyera' },
    { value: 'EVENTS', label: 'Tədbir' },
    { value: 'OTHER', label: 'Digər' },
];

interface Props {
    initialData?: any;
    onSuccess?: () => void;
}

export default function ListingForm({ initialData, onSuccess }: Props) {
    const { accessToken } = useAuthStore();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: initialData ? {
            title: initialData.title,
            description: initialData.description,
            category: initialData.category,
        } : undefined,
    });

    const onSubmit = async (data: FormData) => {
        try {
            let imageUrls: string[] = [];

            if (imageFile) {
                setUploadingImage(true);
                const formData = new FormData();
                formData.append('file', imageFile);

                try {
                    const mediaRes = await api.post('/media/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    if (mediaRes.data.url) {
                        imageUrls.push(mediaRes.data.url);
                    }
                } catch (mediaErr) {
                    setError('root', { message: 'Şəkil yüklənərkən xəta baş verdi. Zəhmət olmasa tələblərə uyğun şəkil seçin (Max: 5MB)' });
                    setUploadingImage(false);
                    return;
                } finally {
                    setUploadingImage(false);
                }
            } else if (initialData && initialData.images) {
                // Keep existing images if we didn't upload a new one
                let parsed = initialData.images;
                if (typeof parsed === 'string') {
                    try { parsed = JSON.parse(parsed); } catch { parsed = []; }
                }
                imageUrls = parsed;
            }

            if (initialData) {
                await api.put(`/listings/${initialData.id}`, { ...data, images: imageUrls }, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
            } else {
                await api.post('/listings', { ...data, images: imageUrls }, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
            }
            onSuccess?.();
        } catch {
            setError('root', { message: 'Elan yadda saxlanılarkən xəta baş verdi' });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Başlıq" {...register('title')} error={errors.title?.message} />

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Şəkil Seç</label>
                <input
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full rounded-lg border px-3 py-2 text-sm text-gray-700 file:mr-4 file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-700 hover:file:bg-primary-100"
                />
                <p className="mt-1 text-xs text-gray-500">Maksimum ölçü: 5MB. İcazə verilən formatlar: JPG, PNG, WEBP</p>
            </div>

            <Textarea label="Təsvir" rows={4} {...register('description')} error={errors.description?.message} />
            <Select label="Kateqoriya" options={categoryOptions} {...register('category')} error={errors.category?.message} />

            {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}

            <Button type="submit" className="w-full" isLoading={isSubmitting || uploadingImage}>
                {uploadingImage ? 'Şəkil Yüklənir...' : initialData ? 'Yadda Saxla' : 'Elan yarat'}
            </Button>
        </form>
    );
}
