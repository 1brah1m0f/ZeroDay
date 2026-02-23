'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

const schema = z.object({
    username: z.string().min(3, 'İstifadəçi adı ən az 3 simvol').max(20),
    email: z.string().email('Düzgün e-mail daxil edin'),
    displayName: z.string().min(2, 'Ad ən az 2 simvol olmalıdır'),
    password: z.string().min(6, 'Şifrə ən az 6 simvol olmalıdır'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterForm() {
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            const res = await api.post('/auth/register', data);
            setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
            router.push('/feed');
        } catch {
            setError('root', { message: 'Qeydiyyat zamanı xəta baş verdi' });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Ad Soyad" {...register('displayName')} error={errors.displayName?.message} />
            <Input label="İstifadəçi adı" {...register('username')} error={errors.username?.message} />
            <Input label="E-mail" type="email" {...register('email')} error={errors.email?.message} />
            <Input label="Şifrə" type="password" {...register('password')} error={errors.password?.message} />
            {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}
            <Button type="submit" className="w-full" isLoading={isSubmitting}>Qeydiyyatdan keç</Button>
        </form>
    );
}
