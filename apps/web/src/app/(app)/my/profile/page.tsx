'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Badge } from '@/components/Badge';

interface Exp {
    id: string;
    type: string;
    title: string;
    organization: string;
    description?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
}

const EMPTY_FORM = { title: '', organization: '', description: '', startDate: '', endDate: '', isCurrent: false };

function ExpSection({
    label,
    emoji,
    type,
    experiences,
    onAdded,
    onDeleted,
    accessToken,
}: {
    label: string;
    emoji: string;
    type: string;
    experiences: Exp[];
    onAdded: () => void;
    onDeleted: (id: string) => void;
    accessToken: string;
}) {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/profiles/experiences', {
                ...form,
                type,
                startDate: new Date(form.startDate).toISOString(),
                endDate: form.isCurrent || !form.endDate ? null : new Date(form.endDate).toISOString(),
            }, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setShowForm(false);
            setForm(EMPTY_FORM);
            onAdded();
        } catch {
            alert('Xəta baş verdi');
        } finally {
            setSaving(false);
        }
    };

    const filtered = experiences.filter(e => e.type === type);

    return (
        <section className="rounded-xl border bg-white shadow-sm overflow-hidden">
            {/* Section header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">{emoji} {label}</h2>
                <button
                    onClick={() => setShowForm(v => !v)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-600 text-primary-600 text-lg font-bold leading-none hover:bg-primary-50 transition"
                    title={`${label} əlavə et`}
                >
                    {showForm ? '×' : '+'}
                </button>
            </div>

            <div className="px-6 py-5 space-y-4">
                {/* Add Form */}
                {showForm && (
                    <form onSubmit={handleSave} className="rounded-xl border border-primary-100 bg-primary-50/40 p-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label={type === 'EDUCATION' ? 'Təhsil dərəcəsi / ixtisas' : 'Vəzifə / Rol'}
                                required
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder={type === 'EDUCATION' ? 'məs: Bakalavr — Kompüter Elmləri' : 'məs: Frontend Developer'}
                            />
                            <Input
                                label={type === 'EDUCATION' ? 'Universitet / Məktəb' : 'Şirkət / Təşkilat'}
                                required
                                value={form.organization}
                                onChange={e => setForm({ ...form, organization: e.target.value })}
                                placeholder={type === 'EDUCATION' ? 'məs: BHOS, ADA...' : 'məs: Google, UNICEF...'}
                            />
                            <Input
                                label="Başlama tarixi"
                                type="date"
                                required
                                value={form.startDate}
                                onChange={e => setForm({ ...form, startDate: e.target.value })}
                            />
                            <div>
                                <Input
                                    label="Bitmə tarixi"
                                    type="date"
                                    disabled={form.isCurrent}
                                    value={form.endDate}
                                    onChange={e => setForm({ ...form, endDate: e.target.value })}
                                />
                                <label className="mt-2 flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.isCurrent}
                                        onChange={e => setForm({ ...form, isCurrent: e.target.checked, endDate: '' })}
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    Hal-hazırda davam edir
                                </label>
                            </div>
                        </div>
                        <Textarea
                            label="Təsvir (əlavə məlumat)"
                            rows={3}
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            placeholder="Öhdəliklər, uğurlar, bacarıqlar..."
                        />
                        <div className="flex gap-3">
                            <Button type="submit" variant="primary" isLoading={saving}>Yadda Saxla</Button>
                            <Button type="button" variant="outline" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}>Ləğv et</Button>
                        </div>
                    </form>
                )}

                {/* List */}
                {filtered.length === 0 && !showForm ? (
                    <p className="text-sm text-gray-400 py-2">Hələ {label.toLowerCase()} əlavə edilməyib.</p>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((exp, i) => (
                            <div key={exp.id} className="group relative flex gap-4">
                                {/* Timeline line */}
                                <div className="flex flex-col items-center">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600 text-sm font-bold">
                                        {exp.organization?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    {i < filtered.length - 1 && <div className="mt-1 w-px flex-1 bg-stone-200" />}
                                </div>

                                <div className="flex-1 pb-4 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-stone-900 text-sm">{exp.title}</h3>
                                            <p className="text-sm text-stone-600">{exp.organization}</p>
                                            <p className="text-xs text-stone-400 mt-0.5">
                                                {new Date(exp.startDate).toLocaleDateString('az-AZ', { month: 'short', year: 'numeric' })}
                                                {' – '}
                                                {exp.isCurrent
                                                    ? <Badge variant="success" size="sm">Davam edir</Badge>
                                                    : exp.endDate
                                                        ? new Date(exp.endDate).toLocaleDateString('az-AZ', { month: 'short', year: 'numeric' })
                                                        : ''
                                                }
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => onDeleted(exp.id)}
                                            className="ml-4 shrink-0 text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Sil
                                        </button>
                                    </div>
                                    {exp.description && (
                                        <p className="mt-2 text-sm text-stone-500 leading-relaxed">{exp.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default function MyProfilePage() {
    const { user, accessToken, setAuth } = useAuthStore();

    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileMsg, setProfileMsg] = useState('');
    const [experiences, setExperiences] = useState<Exp[]>([]);

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
            setBio(user.bio || '');
        }
    }, [user]);

    useEffect(() => {
        if (accessToken) fetchExperiences();
    }, [accessToken]);

    const fetchExperiences = async () => {
        try {
            const res = await api.get('/profiles/experiences', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setExperiences(res.data);
        } catch { }
    };

    const handleSaveProfile = async () => {
        try {
            setSavingProfile(true);
            const res = await api.put(
                '/profiles',
                { displayName, bio },
                { headers: { Authorization: `Bearer ${accessToken}` } },
            );
            setAuth(res.data, accessToken!, '');
            setProfileMsg('Məlumatlar saxlanıldı!');
            setTimeout(() => setProfileMsg(''), 3000);
        } catch {
            setProfileMsg('Xəta baş verdi');
        } finally {
            setSavingProfile(false);
        }
    };

    const handleDeleteExp = async (id: string) => {
        if (!confirm('Silmək istədiyinizə əminsiniz?')) return;
        try {
            await api.delete(`/profiles/experiences/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            fetchExperiences();
        } catch {
            alert('Xəta baş verdi');
        }
    };

    return (
        <div className="mx-auto max-w-2xl space-y-8">
            {/* Personal Info */}
            <section className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-gray-900">Şəxsi Məlumatlar</h2>
                {profileMsg && (
                    <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{profileMsg}</div>
                )}
                <div className="space-y-4">
                    <Input
                        label="Ad Soyad"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                    <Textarea
                        label="Haqqında (Bio)"
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Özünüz haqqında qısa məlumat (LinkedIn formatında)"
                    />
                    <Button onClick={handleSaveProfile} isLoading={savingProfile}>
                        Saxla
                    </Button>
                </div>
            </section>

            {/* Experience Sections */}
            <ExpSection
                label="İş Təcrübəsi"
                emoji="💼"
                type="WORK"
                experiences={experiences}
                onAdded={fetchExperiences}
                onDeleted={handleDeleteExp}
                accessToken={accessToken || ''}
            />
            <ExpSection
                label="Təhsil"
                emoji="🎓"
                type="EDUCATION"
                experiences={experiences}
                onAdded={fetchExperiences}
                onDeleted={handleDeleteExp}
                accessToken={accessToken || ''}
            />
            <ExpSection
                label="Könüllülük"
                emoji="🤝"
                type="VOLUNTEER"
                experiences={experiences}
                onAdded={fetchExperiences}
                onDeleted={handleDeleteExp}
                accessToken={accessToken || ''}
            />
        </div>
    );
}
