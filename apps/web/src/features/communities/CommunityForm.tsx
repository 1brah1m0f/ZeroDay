'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Select } from '@/components/Select';

const schema = z.object({
    name: z.string().min(3, 'Ad ən az 3 simvol olmalıdır'),
    description: z.string().min(10, 'Təsvir ən az 10 simvol olmalıdır'),
    privacy: z.string(),
});

type FormData = z.infer<typeof schema>;

const privacyOptions = [
    { value: 'PUBLIC', label: 'Açıq' },
    { value: 'PRIVATE', label: 'Gizli' },
    { value: 'INVITE_ONLY', label: 'Yalnız dəvətlə' },
];

interface Props {
    onSuccess?: () => void;
}

export default function CommunityForm({ onSuccess }: Props) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { privacy: 'PUBLIC' },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await api.post('/communities', data);
            onSuccess?.();
        } catch {
            setError('root', { message: 'İcma yaradılarkən xəta baş verdi' });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="İcma Adı" {...register('name')} error={errors.name?.message} />
            <Textarea label="İcma Haqqında" rows={4} {...register('description')} error={errors.description?.message} />
            <Select label="Məxfilik" options={privacyOptions} {...register('privacy')} error={errors.privacy?.message} />
            {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}
            <Button type="submit" className="w-full" isLoading={isSubmitting}>İcma Yarat</Button>
        </form>
    );
}
