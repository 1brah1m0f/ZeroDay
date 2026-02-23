const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seed başlayır...');

    // ─── Clean slate ────────────────────────────────────
    await prisma.forumVote.deleteMany();
    await prisma.forumComment.deleteMany();
    await prisma.forumTopic.deleteMany();
    await prisma.chatMessage.deleteMany();
    await prisma.conversationParticipant.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.application.deleteMany();
    await prisma.savedListing.deleteMany();
    await prisma.experience.deleteMany();
    await prisma.userBadge.deleteMany();
    await prisma.groupMember.deleteMany();
    await prisma.group.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.badge.deleteMany();
    await prisma.user.deleteMany();

    const hash = (pw) => bcrypt.hashSync(pw, 10);

    // ─── Users ──────────────────────────────────────────
    const demo = await prisma.user.create({ data: { username: 'demo', email: 'demo@kutlewe.az', password: hash('demo1234'), displayName: 'Demo İstifadəçi', bio: 'Bu hesab demo məqsədilə yaradılıb. KütləWe platformasını kəşf edin 🚀', role: 'USER' } });
    const kenan = await prisma.user.create({ data: { username: 'kenan', email: 'kenan@kutlewe.az', password: hash('kenan1234'), displayName: 'Kənan Əhmədov', bio: 'Frontend Developer | React & Next.js | Bakı, Azərbaycan 🇦🇿', role: 'USER' } });
    const leyla = await prisma.user.create({ data: { username: 'leyla', email: 'leyla@kutlewe.az', password: hash('leyla1234'), displayName: 'Leyla Həsənova', bio: 'UX/UI Dizayner | BHOS məzunu | Könüllülük fəaliyyəti ilə maraqlanıram', role: 'USER' } });
    const orxan = await prisma.user.create({ data: { username: 'orxan', email: 'orxan@kutlewe.az', password: hash('orxan1234'), displayName: 'Orxan Məmmədov', bio: 'Backend Developer | NestJS & Prisma | Açıq mənbə layihələrə töhfə verirəm', role: 'USER' } });
    const nigar = await prisma.user.create({ data: { username: 'nigar', email: 'nigar@kutlewe.az', password: hash('nigar1234'), displayName: 'Nigar Quliyeva', bio: 'Data Scientist | Python & ML | UNICEF Azərbaycan könüllüsü', role: 'USER' } });
    console.log('✅ 5 istifadəçi yaradıldı');

    // ─── Badges ─────────────────────────────────────────
    const b1 = await prisma.badge.create({ data: { name: 'İlk Elan', description: 'İlk elanını paylaşdın', iconUrl: '🏆', tier: 'BRONZE' } });
    const b2 = await prisma.badge.create({ data: { name: 'Aktiv Üzv', description: '10+ elan paylaşdın', iconUrl: '⭐', tier: 'SILVER' } });
    const b3 = await prisma.badge.create({ data: { name: 'Könüllü Qəhrəman', description: '5+ könüllülük elanı yaratdın', iconUrl: '🤝', tier: 'GOLD' } });
    const b4 = await prisma.badge.create({ data: { name: 'İcma Lideri', description: '100+ müraciət aldın', iconUrl: '👑', tier: 'GOLD' } });

    await prisma.userBadge.createMany({
        data: [
            { userId: kenan.id, badgeId: b1.id },
            { userId: kenan.id, badgeId: b2.id },
            { userId: leyla.id, badgeId: b1.id },
            { userId: leyla.id, badgeId: b3.id },
            { userId: orxan.id, badgeId: b1.id },
            { userId: orxan.id, badgeId: b4.id },
            { userId: nigar.id, badgeId: b2.id },
            { userId: nigar.id, badgeId: b3.id },
        ]
    });
    console.log('✅ Nişanlar yaradıldı');

    // ─── Experiences ────────────────────────────────────
    await prisma.experience.createMany({
        data: [
            { userId: kenan.id, type: 'WORK', title: 'Frontend Developer', organization: 'AzTech Şirkəti', description: 'React, TypeScript, Next.js ilə enterprise layihələr üzərində işlədim.', startDate: new Date('2022-06-01'), isCurrent: true },
            { userId: kenan.id, type: 'EDUCATION', title: 'Kompüter Elmləri Bakalavr', organization: 'UNEC', startDate: new Date('2019-09-01'), endDate: new Date('2023-06-30'), isCurrent: false },
            { userId: kenan.id, type: 'VOLUNTEER', title: 'Kod Müəllimi', organization: 'Code for Azerbaijan', description: 'Hər həftə 15+ şagirdə proqramlaşdırma öyrətdim.', startDate: new Date('2021-01-01'), endDate: new Date('2022-05-30'), isCurrent: false },
            { userId: leyla.id, type: 'WORK', title: 'UX/UI Dizayner', organization: 'Digital Minds Agency', description: 'Figma ilə 20+ layihə üçün UI dizayn hazırladım.', startDate: new Date('2023-01-01'), isCurrent: true },
            { userId: leyla.id, type: 'EDUCATION', title: 'İnformasiya Texnologiyaları', organization: 'BHOS', startDate: new Date('2020-09-01'), endDate: new Date('2024-06-01'), isCurrent: false },
            { userId: leyla.id, type: 'VOLUNTEER', title: 'Yaşıl Azərbaycan Könüllüsü', organization: 'Ecosystem NGO', startDate: new Date('2022-03-01'), isCurrent: true },
            { userId: orxan.id, type: 'WORK', title: 'Backend Developer', organization: 'Kapital Bank', description: 'NestJS, PostgreSQL, Docker ilə bank API sistemləri inkişaf etdirdim.', startDate: new Date('2021-09-01'), isCurrent: true },
            { userId: orxan.id, type: 'EDUCATION', title: 'Proqram Mühəndisliyi', organization: 'ADA University', startDate: new Date('2018-09-01'), endDate: new Date('2022-06-01'), isCurrent: false },
            { userId: nigar.id, type: 'WORK', title: 'Data Scientist', organization: 'McKinsey Digital', description: 'Python, TensorFlow ilə ML modellər qurdum.', startDate: new Date('2023-06-01'), isCurrent: true },
            { userId: nigar.id, type: 'VOLUNTEER', title: 'Uşaq Hüquqları Könüllüsü', organization: 'UNICEF Azərbaycan', description: 'Kənd məktəblərindəki uşaqlara rəqəmsal savadlılıq öyrətdim.', startDate: new Date('2022-01-01'), isCurrent: true },
        ]
    });
    console.log('✅ Təcrübələr yaradıldı');

    // ─── Listings ────────────────────────────────────────
    const l1 = await prisma.listing.create({ data: { authorId: kenan.id, title: 'Python əsasları — Mentor tələb olunur', description: 'Python dilini sıfırdan öyrənmək istəyən şagirdlərə mentorluq etmək üçün təcrübəli proqramçı axtarırıq. Həftədə 2 dəfə onlayn görüşlər olacaq. Tam pulsuz!', category: 'VOLUNTEER', tags: JSON.stringify(['mentorluq', 'python', 'proqramlaşdırma']), status: 'ACTIVE' } });
    const l2 = await prisma.listing.create({ data: { authorId: kenan.id, title: 'React/Next.js intensiv kursu — 3 ay', description: 'React hooks, Context API, Next.js Server Components, TypeScript kursu. Kurs sonunda portfolio layihəsi.', category: 'EDUCATION', tags: JSON.stringify(['react', 'nextjs', 'typescript']), status: 'ACTIVE' } });
    const l3 = await prisma.listing.create({ data: { authorId: leyla.id, title: 'Hackathon — Könüllü Təşkilatçı', description: 'Bakıda keçiriləcək 48-saatlıq hackathon üçün könüllü təşkilatçılar axtarırıq. Yemək, texniki dəstək, qeydiyyat sahələrində kömək lazımdır.', category: 'VOLUNTEER', tags: JSON.stringify(['hackathon', 'texnologiya', 'könüllülük']), status: 'ACTIVE' } });
    const l4 = await prisma.listing.create({ data: { authorId: leyla.id, title: 'UX/UI Dizayn mentorluğu — Başlayanlar', description: 'Figma və dizayn düşüncəsi üzrə aylıq mentorluq proqramı. Karyeranı dizayn sahəsinde qurmaq istəyənlər üçün ideal.', category: 'EDUCATION', tags: JSON.stringify(['dizayn', 'figma', 'ux']), status: 'ACTIVE' } });
    const l5 = await prisma.listing.create({ data: { authorId: orxan.id, title: 'Junior Backend Developer — Uzaqdan İş', description: 'NestJS/Node.js bilən junior developer axtarırıq. Uzaqdan iş, çevik saatlar. Əmək haqqı: 800-1200 AZN.', category: 'JOBS', tags: JSON.stringify(['nodejs', 'nestjs', 'uzaqdan-iş']), status: 'ACTIVE' } });
    const l6 = await prisma.listing.create({ data: { authorId: orxan.id, title: 'Açıq mənbə layihəyə töhfə ver', description: 'GitHub-da aktiv olan Azərbaycan dilindəki developer vasitələrini hazırlayan icmamıza qoşul.', category: 'VOLUNTEER', tags: JSON.stringify(['opensource', 'github', 'developer']), status: 'ACTIVE' } });
    const l7 = await prisma.listing.create({ data: { authorId: nigar.id, title: 'İngilis dili danışıq klubu — Həftəlik', description: 'Hər çərşənbə saat 19:00-da Zoom-da ingilis dili praktikası. B1-C2 səviyyəsi. Pulsuz!', category: 'VOLUNTEER', tags: JSON.stringify(['ingilis-dili', 'dil-öyrənmə', 'klub']), status: 'ACTIVE' } });
    const l8 = await prisma.listing.create({ data: { authorId: nigar.id, title: 'Data Science bootcamp — 6 həftəlik', description: 'Python, Pandas, Scikit-learn ilə praktik data science kursu. Kaggle müsabiqələri üzrə hazırlıq.', category: 'EDUCATION', tags: JSON.stringify(['datascience', 'ml', 'python', 'ai']), status: 'ACTIVE' } });
    const l9 = await prisma.listing.create({ data: { authorId: demo.id, title: 'Karyera Məsləhəti — İT sahəsindəkilər', description: 'IT sahəsindəkilər üçün pulsuz karyera məsləhəti. CV yoxlanışı, müsahib hazırlığı. Hər şənbə saat 11:00.', category: 'VOLUNTEER', tags: JSON.stringify(['karyera', 'cv', 'mentorluq']), status: 'ACTIVE' } });
    const l10 = await prisma.listing.create({ data: { authorId: demo.id, title: 'Hüquqi məsləhət — Pulsuz', description: 'Gənclərin hüquqları mövzusunda aylıq pulsuz hüquqi məsləhət. İş müqavilələri, istehlakçı hüquqları.', category: 'SERVICES', tags: JSON.stringify(['hüquq', 'məsləhət', 'pulsuz']), status: 'ACTIVE' } });
    const l11 = await prisma.listing.create({ data: { authorId: kenan.id, title: 'AzTech Festivalı — Könüllü', description: 'AzTech Fest 2025 üçün könüllü axtarışı. 2000+ iştirakçı, 50+ məruzəçi. Qeydiyyat, media, texniki sahələrdə kömək.', category: 'EVENTS', tags: JSON.stringify(['texfest', 'könüllülük', 'festival']), status: 'ACTIVE' } });
    const l12 = await prisma.listing.create({ data: { authorId: leyla.id, title: 'Freelance Qrafik Dizayner', description: 'Logo, banner, sosial media dizaynı üzrə freelance xidmət. Portfolio mövcuddur.', category: 'SERVICES', tags: JSON.stringify(['freelance', 'dizayn', 'logo']), status: 'ACTIVE' } });
    console.log('✅ 12 elan yaradıldı');

    // ─── Applications ───────────────────────────────────
    await prisma.application.createMany({
        data: [
            { listingId: l1.id, applicantId: leyla.id, ownerId: kenan.id, status: 'ACCEPTED' },
            { listingId: l1.id, applicantId: nigar.id, ownerId: kenan.id, status: 'PENDING' },
            { listingId: l1.id, applicantId: demo.id, ownerId: kenan.id, status: 'PENDING' },
            { listingId: l3.id, applicantId: kenan.id, ownerId: leyla.id, status: 'ACCEPTED' },
            { listingId: l3.id, applicantId: orxan.id, ownerId: leyla.id, status: 'PENDING' },
            { listingId: l5.id, applicantId: demo.id, ownerId: orxan.id, status: 'PENDING' },
            { listingId: l5.id, applicantId: leyla.id, ownerId: orxan.id, status: 'REJECTED' },
            { listingId: l7.id, applicantId: kenan.id, ownerId: nigar.id, status: 'ACCEPTED' },
            { listingId: l7.id, applicantId: orxan.id, ownerId: nigar.id, status: 'ACCEPTED' },
            { listingId: l9.id, applicantId: leyla.id, ownerId: demo.id, status: 'PENDING' },
            { listingId: l11.id, applicantId: orxan.id, ownerId: kenan.id, status: 'PENDING' },
            { listingId: l11.id, applicantId: nigar.id, ownerId: kenan.id, status: 'PENDING' },
            { listingId: l11.id, applicantId: demo.id, ownerId: kenan.id, status: 'ACCEPTED' },
        ]
    });

    await prisma.savedListing.createMany({
        data: [
            { userId: demo.id, listingId: l1.id },
            { userId: demo.id, listingId: l4.id },
            { userId: demo.id, listingId: l7.id },
            { userId: kenan.id, listingId: l8.id },
            { userId: leyla.id, listingId: l5.id },
            { userId: orxan.id, listingId: l2.id },
        ]
    });
    console.log('✅ Müraciətlər və saxlanılanlar yaradıldı');

    // ─── Groups ──────────────────────────────────────────
    const g1 = await prisma.group.create({ data: { name: 'Azərbaycan Gənc Proqramçılar', slug: 'az-young-devs', description: 'Proqramlaşdırmanı sevən Azərbaycanlı gənclərin icması. Kod reviewlar, layihə müzakirələri, öyrənmə materialları.', privacy: 'PUBLIC', ownerId: kenan.id, tags: JSON.stringify(['proqramlaşdırma', 'texnologiya', 'gənclər']) } });
    const g2 = await prisma.group.create({ data: { name: 'UX/UI Dizayn Cəmiyyəti', slug: 'ux-ui-dizayn', description: 'Azərbaycanda UX/UI dizaynerləri birləşdirən icma. Portfolio paylaşımı, case study müzakirəsi.', privacy: 'PUBLIC', ownerId: leyla.id, tags: JSON.stringify(['dizayn', 'figma', 'ux']) } });
    const g3 = await prisma.group.create({ data: { name: 'Data Science AZ', slug: 'datascience-az', description: 'Azərbaycanda data science, ML, AI ilə maraqlanan mütəxəssislər üçün icma.', privacy: 'PUBLIC', ownerId: nigar.id, tags: JSON.stringify(['datascience', 'ml', 'ai']) } });
    const g4 = await prisma.group.create({ data: { name: 'İT Karyera İnkişafı', slug: 'it-karyera', description: 'İT sahəsindəki karyeranızı inkişaf etdirmək üçün CV yoxlanışı, mock müsahib, job şərəfnamə.', privacy: 'PUBLIC', ownerId: orxan.id, tags: JSON.stringify(['karyera', 'cv', 'müsahib']) } });
    const g5 = await prisma.group.create({ data: { name: 'Bakı Könüllüyər Şəbəkəsi', slug: 'baki-konulluler', description: 'Bakıda könüllülük aksiyaları, sosial layihələr, ictimai tədbirlər.', privacy: 'PUBLIC', ownerId: demo.id, tags: JSON.stringify(['könüllülük', 'Bakı', 'sosial']) } });
    const g6 = await prisma.group.create({ data: { name: 'Azərbaycan Startup Ekosistemi', slug: 'az-startup', description: 'Startup qurmaq istəyənlər, investorlar, mentorlar bir yerdə. İdea paylaşın, tərəfdaş tapın.', privacy: 'PUBLIC', ownerId: kenan.id, tags: JSON.stringify(['startup', 'biznes', 'inovasiya']) } });

    await prisma.groupMember.createMany({
        data: [
            { userId: kenan.id, groupId: g1.id, role: 'OWNER' },
            { userId: leyla.id, groupId: g1.id, role: 'MEMBER' },
            { userId: orxan.id, groupId: g1.id, role: 'MEMBER' },
            { userId: demo.id, groupId: g1.id, role: 'MEMBER' },
            { userId: nigar.id, groupId: g1.id, role: 'MEMBER' },
            { userId: leyla.id, groupId: g2.id, role: 'OWNER' },
            { userId: kenan.id, groupId: g2.id, role: 'MEMBER' },
            { userId: demo.id, groupId: g2.id, role: 'MEMBER' },
            { userId: nigar.id, groupId: g3.id, role: 'OWNER' },
            { userId: orxan.id, groupId: g3.id, role: 'MEMBER' },
            { userId: demo.id, groupId: g3.id, role: 'MEMBER' },
            { userId: kenan.id, groupId: g3.id, role: 'MEMBER' },
            { userId: orxan.id, groupId: g4.id, role: 'OWNER' },
            { userId: leyla.id, groupId: g4.id, role: 'MEMBER' },
            { userId: demo.id, groupId: g4.id, role: 'MEMBER' },
            { userId: nigar.id, groupId: g4.id, role: 'MEMBER' },
            { userId: demo.id, groupId: g5.id, role: 'OWNER' },
            { userId: kenan.id, groupId: g5.id, role: 'MEMBER' },
            { userId: leyla.id, groupId: g5.id, role: 'MEMBER' },
            { userId: nigar.id, groupId: g5.id, role: 'MEMBER' },
            { userId: orxan.id, groupId: g5.id, role: 'MEMBER' },
            { userId: kenan.id, groupId: g6.id, role: 'OWNER' },
            { userId: nigar.id, groupId: g6.id, role: 'MEMBER' },
            { userId: demo.id, groupId: g6.id, role: 'MEMBER' },
        ]
    });
    console.log('✅ 6 qrup yaradıldı');

    // ─── Forum ──────────────────────────────────────────
    const t1 = await prisma.forumTopic.create({ data: { title: 'Azərbaycanda IT maaşları 2025 — Vəziyyət necədir?', slug: 'az-it-maaslar-2025', body: 'Salam, IT sahəsindəki maaş dinamikasını müzakirə edək. Junior developer kimi iş axtarıram, amma müxtəlif şirkətlərin təklifləri arasında böyük fərq var. Sizin təcrübəniz necədir?', tags: JSON.stringify(['karyera', 'maaş', 'it']), isPinned: true, authorId: kenan.id } });
    const t2 = await prisma.forumTopic.create({ data: { title: 'React vs Vue 2025 — Hansını öyrənmək lazımdır?', slug: 'react-vs-vue-2025', body: 'JavaScript framework seçimi hər developer üçün vacib qərardır. 2025-ci ildə React mi, Vue mi, yoxsa Svelte mi öyrənməyə başlamalıyam? Bazar tələbini nəzərə alaraq fikrinizi bildirin.', tags: JSON.stringify(['react', 'vue', 'javascript']), isPinned: false, authorId: orxan.id } });
    const t3 = await prisma.forumTopic.create({ data: { title: 'Könüllü işin karyeraya faydası var mı?', slug: 'konullu-ve-karyera', body: 'CV-nimə könüllülük fəaliyyəti əlavə etmişəm, amma bəzi rekruterlər buna diqqət etmir. Sizin təcrübəniz nedir?', tags: JSON.stringify(['karyera', 'könüllülük', 'cv']), isPinned: false, authorId: leyla.id } });
    const t4 = await prisma.forumTopic.create({ data: { title: 'Data Science öyrənmək üçün ən yaxşı Azərbaycan resursları', slug: 'datascience-az-resurslar', body: 'Python, ML öyrənmək üçün Azərbaycan dilindəki resursları paylaşın!', tags: JSON.stringify(['datascience', 'python', 'ml']), isPinned: false, authorId: nigar.id } });
    const t5 = await prisma.forumTopic.create({ data: { title: 'Remote iş — Azərbaycandan necə başlamaq olar?', slug: 'remote-is-baslama', body: 'Xarici şirkətlərdə uzaqdan işləmək istəyirəm. Hansi platformalar ən effektivdir?', tags: JSON.stringify(['remote', 'freelance']), isPinned: false, authorId: demo.id } });
    const t6 = await prisma.forumTopic.create({ data: { title: 'Bakıda texnologiya tədbirləri — 2025 Təqvimi', slug: 'baki-tex-tdbbirlr-2025', body: 'Bu il Bakıda hansı texnologiya konfransları, meetuplar, hackathonlar baş tutacaq?', tags: JSON.stringify(['texnologiya', 'tədbir', 'Bakı']), isPinned: true, authorId: kenan.id } });

    await prisma.forumComment.createMany({
        data: [
            { body: 'Junior developer kimi 700-900 AZN interval normaldır, amma böyük şirkətlər 1500+ ödəyir.', topicId: t1.id, authorId: leyla.id },
            { body: 'Backend developer kimi orta 1200-1800 AZN arası realistic gözükür. Senior üçün 3000+ AZN.', topicId: t1.id, authorId: orxan.id },
            { body: '2025-ci ildə React hər zaman ilk seçim olaraq qalır. Böyük ekosistem, iş imkanları çox.', topicId: t2.id, authorId: kenan.id },
            { body: 'Svelte gələcəkdə böyüyə bilər, amma hazırda elanların 80%-i React biliyini tələb edir.', topicId: t2.id, authorId: nigar.id },
            { body: 'UNICEF könüllülüyüm müsahib zamanı ən çox diqqət çəkən hissə oldu. Çox qiymətlidir!', topicId: t3.id, authorId: nigar.id },
            { body: 'BHOS-un YouTube dərslikləri çox faydalıdır. Həmçinin Kaggle-in öz kursları var — pulsuz!', topicId: t4.id, authorId: kenan.id },
            { body: 'Upwork, Remote.co platformalarından başlayın. Vergi üçün ASAN-dan fərdi sahibkar qeydiyyatı alın.', topicId: t5.id, authorId: orxan.id },
        ]
    });

    await prisma.forumVote.createMany({
        data: [
            { userId: leyla.id, topicId: t1.id, value: 1 },
            { userId: orxan.id, topicId: t1.id, value: 1 },
            { userId: nigar.id, topicId: t1.id, value: 1 },
            { userId: demo.id, topicId: t1.id, value: 1 },
            { userId: kenan.id, topicId: t2.id, value: 1 },
            { userId: leyla.id, topicId: t2.id, value: 1 },
            { userId: nigar.id, topicId: t2.id, value: 1 },
            { userId: kenan.id, topicId: t3.id, value: 1 },
            { userId: orxan.id, topicId: t3.id, value: 1 },
            { userId: kenan.id, topicId: t6.id, value: 1 },
            { userId: orxan.id, topicId: t6.id, value: 1 },
            { userId: leyla.id, topicId: t6.id, value: 1 },
            { userId: nigar.id, topicId: t6.id, value: 1 },
            { userId: demo.id, topicId: t6.id, value: 1 },
        ]
    });
    console.log('✅ 6 forum mövzusu yaradıldı');

    console.log('\n🎉 Seed tamamlandı!\n');
    console.log('Demo hesabları:');
    console.log('  📧 demo@kutlewe.az   / demo1234');
    console.log('  📧 kenan@kutlewe.az  / kenan1234');
    console.log('  📧 leyla@kutlewe.az  / leyla1234');
    console.log('  📧 orxan@kutlewe.az  / orxan1234');
    console.log('  📧 nigar@kutlewe.az  / nigar1234');
}

main()
    .catch((e) => { console.error('❌ Seed xətası:', e); process.exit(1); })
    .finally(() => prisma.$disconnect());
