import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
import { config } from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');

config({ path: '../../../.env' });

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seed başlayır...');

    // ─── Clean slate ─────────────────────────────────────────────────────────────
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

    let demoPassword = process.env.SEED_DEMO_PASSWORD?.trim();
    if (!demoPassword) {
        demoPassword = randomBytes(16).toString('hex');
        console.log(`🔐 SEED_DEMO_PASSWORD avtomatik yaradıldı: ${demoPassword}`);
    }
    const demoPasswordHash = await bcrypt.hash(demoPassword, 10);

    // ─── Users ───────────────────────────────────────────────────────────────────
    const users = await Promise.all([
        prisma.user.create({ data: { username: 'demo', email: 'demo@comtech.az', password: demoPasswordHash, displayName: 'Demo İstifadəçi', bio: 'Bu hesab demo məqsədilə yaradılıb. ComTech platformasını kəşf edin 🚀', role: 'USER' } }),
        prisma.user.create({ data: { username: 'kenan', email: 'kenan@comtech.az', password: demoPasswordHash, displayName: 'Kənan Əhmədov', bio: 'Frontend Developer | React & Next.js | Bakı, Azərbaycan 🇦🇿', role: 'USER' } }),
        prisma.user.create({ data: { username: 'leyla', email: 'leyla@comtech.az', password: demoPasswordHash, displayName: 'Leyla Həsənova', bio: 'UX/UI Dizayner | BHOS məzunu | Könüllülük fəaliyyəti ilə maraqlanıram', role: 'USER' } }),
        prisma.user.create({ data: { username: 'orxan', email: 'orxan@comtech.az', password: demoPasswordHash, displayName: 'Orxan Məmmədov', bio: 'Backend Developer | NestJS & Prisma | Açıq mənbə layihələrə töhfə verirəm', role: 'USER' } }),
        prisma.user.create({ data: { username: 'nigar', email: 'nigar@comtech.az', password: demoPasswordHash, displayName: 'Nigar Quliyeva', bio: 'Data Scientist | Python & ML | UNICEF Azərbaycan könüllüsü', role: 'USER' } }),
    ]);

    const [demo, kenan, leyla, orxan, nigar] = users;
    console.log(`✅ ${users.length} istifadəçi yaradıldı`);

    // ─── Badges ──────────────────────────────────────────────────────────────────
    const badges = await Promise.all([
        prisma.badge.create({ data: { name: 'İlk Elan', description: 'İlk elanını paylaşdın', iconUrl: '🏆', tier: 'BRONZE' } }),
        prisma.badge.create({ data: { name: 'Aktiv Üzv', description: '10+ elan paylaşdın', iconUrl: '⭐', tier: 'SILVER' } }),
        prisma.badge.create({ data: { name: 'Könüllü Qəhrəman', description: '5+ könüllülük elanı yaratdın', iconUrl: '🤝', tier: 'GOLD' } }),
        prisma.badge.create({ data: { name: 'İcma Lideri', description: '100+ müraciət aldın', iconUrl: '👑', tier: 'GOLD' } }),
    ]);

    await prisma.userBadge.createMany({
        data: [
            { userId: kenan.id, badgeId: badges[0].id },
            { userId: kenan.id, badgeId: badges[1].id },
            { userId: leyla.id, badgeId: badges[0].id },
            { userId: leyla.id, badgeId: badges[2].id },
            { userId: orxan.id, badgeId: badges[0].id },
            { userId: orxan.id, badgeId: badges[3].id },
            { userId: nigar.id, badgeId: badges[1].id },
            { userId: nigar.id, badgeId: badges[2].id },
        ]
    });
    console.log(`✅ Nişanlar yaradıldı`);

    // ─── Experiences ─────────────────────────────────────────────────────────────
    await prisma.experience.createMany({
        data: [
            { userId: kenan.id, type: 'WORK', title: 'Frontend Developer', organization: 'AzTech Şirkəti', description: 'React, TypeScript, Next.js ilə enterprise-level layihələr üzərində işlədim.', startDate: new Date('2022-06-01'), isCurrent: true },
            { userId: kenan.id, type: 'EDUCATION', title: 'Kompüter Elmləri Bakalavr', organization: 'Azerbaijan State University of Economics (UNEC)', startDate: new Date('2019-09-01'), endDate: new Date('2023-06-30'), isCurrent: false },
            { userId: kenan.id, type: 'VOLUNTEER', title: 'Kod Müəllimi', organization: 'Code for Azerbaijan NGO', description: 'Hər həftə 15+ şagirdə proqramlaşdırma əsaslarını öyrətdim.', startDate: new Date('2021-01-01'), endDate: new Date('2022-05-30'), isCurrent: false },
            { userId: leyla.id, type: 'WORK', title: 'UX/UI Dizayner', organization: 'Digital Minds Agency', description: 'Figma ilə 20+ layihə üçün UI dizayn hazırladım, istifadəçi araşdırmaları apardım.', startDate: new Date('2023-01-01'), isCurrent: true },
            { userId: leyla.id, type: 'EDUCATION', title: 'İnformasiya Texnologiyaları', organization: 'BHOS (Bakı Ali Neft Məktəbi)', startDate: new Date('2020-09-01'), endDate: new Date('2024-06-01'), isCurrent: false },
            { userId: leyla.id, type: 'VOLUNTEER', title: 'Yaşıl Azərbaycan Könüllüsü', organization: 'Ecosystem & Biodiversity NGO', description: 'Aylıq ağacəkmə aksiyalarında könüllü kimi iştirak etdim.', startDate: new Date('2022-03-01'), isCurrent: true },
            { userId: orxan.id, type: 'WORK', title: 'Backend Developer', organization: 'Kapital Bank', description: 'NestJS, PostgreSQL, Docker istifadə edərək bank API sistemlərini inkişaf etdirdim.', startDate: new Date('2021-09-01'), isCurrent: true },
            { userId: orxan.id, type: 'EDUCATION', title: 'Proqram Mühəndisliyi', organization: 'ADA University', startDate: new Date('2018-09-01'), endDate: new Date('2022-06-01'), isCurrent: false },
            { userId: nigar.id, type: 'WORK', title: 'Data Scientist', organization: 'McKinsey & Company (Rəqəmsal)', description: 'Python, TensorFlow ilə ML modellər qurdum, biznes qərarlarını optimallaşdırdım.', startDate: new Date('2023-06-01'), isCurrent: true },
            { userId: nigar.id, type: 'VOLUNTEER', title: 'Uşaq Hüquqları Könüllüsü', organization: 'UNICEF Azərbaycan', description: 'Kənd məktəblərindəki uşaqlara rəqəmsal savadlılıq dərslərini keçirdim.', startDate: new Date('2022-01-01'), isCurrent: true },
        ]
    });
    console.log(`✅ Təcrübələr yaradıldı`);

    // ─── Listings ────────────────────────────────────────────────────────────────
    const listingsData = [
        { authorId: kenan.id, title: 'Python əsasları — Mentor tələb olunur', description: 'Python dilini sıfırdan öyrənmək istəyən şagirdlərə mentorluq etmək üçün təcrübəli proqramçı axtarırıq. Həftədə 2 dəfə onlayn görüşlər olacaq. Tam pulsuz!', category: 'VOLUNTEER', tags: JSON.stringify(['mentorluq', 'python', 'proqramlaşdırma']), status: 'ACTIVE' },
        { authorId: kenan.id, title: 'React/Next.js kursu — 3 aylıq intensiv', description: 'Modern veb texnologiyaları: React hooks, Context API, Next.js Server Components, TypeScript. Kurs sonunda portfolio layihəsi.', category: 'EDUCATION', tags: JSON.stringify(['react', 'nextjs', 'typescript']), status: 'ACTIVE' },
        { authorId: leyla.id, title: 'Hackathon dəstəyi — Könüllü Təşkilatçı', description: 'Bakıda keçiriləcək 48-saatlıq hackathon üçün könüllü təşkilatçılar axtarırıq. Yemək, texniki dəstək, qeydiyyat sahələrində kömək lazımdır.', category: 'VOLUNTEER', tags: JSON.stringify(['hackathon', 'texnologiya', 'könüllülük']), status: 'ACTIVE' },
        { authorId: leyla.id, title: 'UX/UI Dizayn mentorluğu — Başlayanlar üçün', description: 'Figma və dizayn düşüncəsi üzrə aylıq mentorluq proqramı. Karyeranı dizayn sahəsinde qurmaq istəyənlər üçün ideal fürsət.', category: 'EDUCATION', tags: JSON.stringify(['dizayn', 'figma', 'ux', 'ui']), status: 'ACTIVE' },
        { authorId: orxan.id, title: 'Junior Backend Developer — Uzaqdan İş', description: 'NestJS/Node.js bilən junior developer axtarırıq. Uzaqdan iş, çevik saatlar. Əmək haqqı: 800-1200 AZN.', category: 'JOBS', tags: JSON.stringify(['nodejs', 'nestjs', 'uzaqdan-iş', 'junior']), status: 'ACTIVE' },
        { authorId: orxan.id, title: 'Açıq mənbə layihəyə töhfə ver', description: 'GitHub-da aktiv olan Azərbaycan dilində developer vasitələri hazırlayan icmamıza qoşul. Hər səviyyədən developer xoş gəlir!', category: 'VOLUNTEER', tags: JSON.stringify(['opensource', 'github', 'developer']), status: 'ACTIVE' },
        { authorId: nigar.id, title: 'İngilis dili danışıq klubu — Həftəlik', description: 'Hər çərşənbə axşamı saat 19:00-da Zoom-da onlayn ingilis dili danışıq praktikası. B1-C2 səviyyəsindəkilər üçün. Tamamilə pulsuz!', category: 'VOLUNTEER', tags: JSON.stringify(['ingilis-dili', 'dil-öyrənmə', 'klub']), status: 'ACTIVE' },
        { authorId: nigar.id, title: 'Data Science bootcamp — 6 həftəlik', description: 'Python, Pandas, NumPy, Scikit-learn ilə tam praktik data science kursu. Kaggle müsabiqələri üzrə hazırlıq. Ayda 4 dərs.', category: 'EDUCATION', tags: JSON.stringify(['datascience', 'ml', 'python', 'ai']), status: 'ACTIVE' },
        { authorId: demo.id, title: 'Karyera Məsləhəti — İT sahəsindəkilər üçün', description: 'IT sahəsindəkilər üçün pulsuz karyera məsləhəti. CV yoxlanışı, müsahib hazırlığı, yol xəritəsi. Hər şənbə saat 11:00-da.', category: 'VOLUNTEER', tags: JSON.stringify(['karyera', 'cv', 'mentorluq', 'it']), status: 'ACTIVE' },
        { authorId: demo.id, title: 'Vəkil müşaviri — Hüquqi yardım', description: 'Gənclərin hüquqları mövzusunda aylıq pulsuz hüquqi məsləhət verirəm. İş müqavilələri, istehlakçı hüquqları, mülkiyyət məsələləri.', category: 'SERVICES', tags: JSON.stringify(['hüquq', 'məsləhət', 'pulsuz']), status: 'ACTIVE' },
        { authorId: kenan.id, title: 'Azərbaycan Texnologiya Festivalı — Könüllü', description: 'AzTech Fest 2025 üçün könüllü axtarışı. 2000+ iştirakçı, 50+ məruzəçi. Qeydiyyat, media, texniki sahələrdə kömək.', category: 'EVENTS', tags: JSON.stringify(['texfest', 'könüllülük', 'texnologiya', 'festival']), status: 'ACTIVE' },
        { authorId: leyla.id, title: 'Freelance Qrafik Dizayner', description: 'Logo, banner, sosial media dizaynı üzrə freelance xidmət təklif edirəm. Portfolio: comtech.az/u/leyla', category: 'SERVICES', tags: JSON.stringify(['freelance', 'dizayn', 'logo', 'brending']), status: 'ACTIVE' },
    ];

    const createdListings = await Promise.all(listingsData.map(l => prisma.listing.create({ data: l })));
    console.log(`✅ ${createdListings.length} elan yaradıldı`);

    // ─── Applications ────────────────────────────────────────────────────────────
    await prisma.application.createMany({
        data: [
            { listingId: createdListings[0].id, applicantId: leyla.id, ownerId: kenan.id, status: 'ACCEPTED' },
            { listingId: createdListings[0].id, applicantId: nigar.id, ownerId: kenan.id, status: 'PENDING' },
            { listingId: createdListings[0].id, applicantId: demo.id, ownerId: kenan.id, status: 'PENDING' },
            { listingId: createdListings[2].id, applicantId: kenan.id, ownerId: leyla.id, status: 'ACCEPTED' },
            { listingId: createdListings[2].id, applicantId: orxan.id, ownerId: leyla.id, status: 'PENDING' },
            { listingId: createdListings[4].id, applicantId: demo.id, ownerId: orxan.id, status: 'PENDING' },
            { listingId: createdListings[4].id, applicantId: leyla.id, ownerId: orxan.id, status: 'REJECTED' },
            { listingId: createdListings[6].id, applicantId: kenan.id, ownerId: nigar.id, status: 'ACCEPTED' },
            { listingId: createdListings[6].id, applicantId: orxan.id, ownerId: nigar.id, status: 'ACCEPTED' },
            { listingId: createdListings[8].id, applicantId: leyla.id, ownerId: demo.id, status: 'PENDING' },
            { listingId: createdListings[10].id, applicantId: orxan.id, ownerId: kenan.id, status: 'PENDING' },
            { listingId: createdListings[10].id, applicantId: nigar.id, ownerId: kenan.id, status: 'PENDING' },
            { listingId: createdListings[10].id, applicantId: demo.id, ownerId: kenan.id, status: 'ACCEPTED' },
        ]
    });
    console.log(`✅ Müraciətlər yaradıldı`);

    // ─── Saved Listings ───────────────────────────────────────────────────────────
    await prisma.savedListing.createMany({
        data: [
            { userId: demo.id, listingId: createdListings[0].id },
            { userId: demo.id, listingId: createdListings[3].id },
            { userId: demo.id, listingId: createdListings[6].id },
            { userId: kenan.id, listingId: createdListings[7].id },
            { userId: leyla.id, listingId: createdListings[4].id },
            { userId: orxan.id, listingId: createdListings[1].id },
        ]
    });
    console.log(`✅ Saxlanılan elanlar yaradıldı`);

    // ─── Groups ───────────────────────────────────────────────────────────────────
    const groupsData = [
        { name: 'Azərbaycan Gənc Proqramçılar', slug: 'az-young-devs', description: 'Proqramlaşdırmanı sevən Azərbaycanlı gənclərin icması. Kod reviewlar, layihə müzakirələri, öyrənmə materialları.', privacy: 'PUBLIC', ownerId: kenan.id, tags: JSON.stringify(['proqramlaşdırma', 'texnologiya', 'gənclər']) },
        { name: 'UX/UI Dizayn Cəmiyyəti', slug: 'ux-ui-dizayn', description: 'Azərbaycanda UX/UI dizaynerləri birləşdirən icma. Portfolio paylaşımı, case study müzakirəsi, tool öyrənmə.', privacy: 'PUBLIC', ownerId: leyla.id, tags: JSON.stringify(['dizayn', 'figma', 'ux']) },
        { name: 'Data Science AZ', slug: 'datascience-az', description: 'Azərbaycanda data science, ML, AI ilə maraqlanan mütəxəssislər üçün icma. Kaggle müsabiqə qrupu.', privacy: 'PUBLIC', ownerId: nigar.id, tags: JSON.stringify(['datascience', 'ml', 'ai', 'python']) },
        { name: 'İT Karyera Inkişafı', slug: 'it-karyera', description: 'İT sahəsindəki karyeranızı inkişaf etdirmək istəyirsinizsə bu qrup sizin üçündür. CV yoxlanışı, mock müsahib, job şərəfnamə.', privacy: 'PUBLIC', ownerId: orxan.id, tags: JSON.stringify(['karyera', 'cv', 'müsahib']) },
        { name: 'Bakı Könüllüyər Şəbəkəsi', slug: 'baki-konulluler', description: 'Bakıda könüllülük aksiyaları, sosial layihələr, ictimai tədbirlər. Hər kəsi fəal vətəndaş olmağa dəvət edirik!', privacy: 'PUBLIC', ownerId: demo.id, tags: JSON.stringify(['könüllülük', 'Bakı', 'sosial']) },
        { name: 'Azərbaycan Startup Ekosistemi', slug: 'az-startup', description: 'Startup qurmaq istəyənlər, investorlar, mentorlar bir yerdə. İdea paylaşın, tərəfdaş tapın, funding imkanlarını öyrənin.', privacy: 'PUBLIC', ownerId: kenan.id, tags: JSON.stringify(['startup', 'biznes', 'inovasiya']) },
    ];

    const createdGroups = await Promise.all(groupsData.map(g => prisma.group.create({ data: g })));

    // Members
    await prisma.groupMember.createMany({
        data: [
            { userId: kenan.id, groupId: createdGroups[0].id, role: 'OWNER' },
            { userId: leyla.id, groupId: createdGroups[0].id, role: 'MEMBER' },
            { userId: orxan.id, groupId: createdGroups[0].id, role: 'MEMBER' },
            { userId: demo.id, groupId: createdGroups[0].id, role: 'MEMBER' },
            { userId: nigar.id, groupId: createdGroups[0].id, role: 'MEMBER' },
            { userId: leyla.id, groupId: createdGroups[1].id, role: 'OWNER' },
            { userId: kenan.id, groupId: createdGroups[1].id, role: 'MEMBER' },
            { userId: demo.id, groupId: createdGroups[1].id, role: 'MEMBER' },
            { userId: nigar.id, groupId: createdGroups[2].id, role: 'OWNER' },
            { userId: orxan.id, groupId: createdGroups[2].id, role: 'MEMBER' },
            { userId: demo.id, groupId: createdGroups[2].id, role: 'MEMBER' },
            { userId: kenan.id, groupId: createdGroups[2].id, role: 'MEMBER' },
            { userId: orxan.id, groupId: createdGroups[3].id, role: 'OWNER' },
            { userId: leyla.id, groupId: createdGroups[3].id, role: 'MEMBER' },
            { userId: demo.id, groupId: createdGroups[3].id, role: 'MEMBER' },
            { userId: nigar.id, groupId: createdGroups[3].id, role: 'MEMBER' },
            { userId: demo.id, groupId: createdGroups[4].id, role: 'OWNER' },
            { userId: kenan.id, groupId: createdGroups[4].id, role: 'MEMBER' },
            { userId: leyla.id, groupId: createdGroups[4].id, role: 'MEMBER' },
            { userId: nigar.id, groupId: createdGroups[4].id, role: 'MEMBER' },
            { userId: orxan.id, groupId: createdGroups[4].id, role: 'MEMBER' },
            { userId: kenan.id, groupId: createdGroups[5].id, role: 'OWNER' },
            { userId: nigar.id, groupId: createdGroups[5].id, role: 'MEMBER' },
            { userId: demo.id, groupId: createdGroups[5].id, role: 'MEMBER' },
        ]
    });
    console.log(`✅ ${createdGroups.length} qrup yaradıldı`);

    // ─── Forum Topics ─────────────────────────────────────────────────────────────
    const topicsData = [
        { title: 'Azərbaycanda IT maaşları 2025 — Vəziyyət necədir?', slug: 'az-it-maaslar-2025', body: 'Salam, IT sahəsindəki maaş dinamikasını müzakirə edək. Junior developer kimi iş axtarıram, amma müxtəlif şirkətlərin təklifləri arasında böyük fərq var. Sizin təcrübəniz necədir?', tags: JSON.stringify(['karyera', 'maaş', 'it']), isPinned: true, authorId: kenan.id },
        { title: 'React vs Vue 2025 — Hansını öyrənmək lazımdır?', slug: 'react-vs-vue-2025', body: 'JavaScript framework seçimi hər developer üçün vacib qərardır. 2025-ci ildə React mi, Vue mi, yoxsa Svelte mi öyrənməyə başlamalıyam? Bazar tələbini nəzərə alaraq fikrinizi bildirin.', tags: JSON.stringify(['react', 'vue', 'javascript', 'frontend']), isPinned: false, authorId: orxan.id },
        { title: 'Könüllü işin karyeraya faydası var mı?', slug: 'konullu-ve-karyera', body: 'CV-nimə könüllülük fəaliyyəti əlavə etmişəm, amma bəzi rekruterlər buna diqqət etmir. Sizin təcrübəniz nedir? Könüllülük effektiv şəkildə necə göstərilməlidir?', tags: JSON.stringify(['karyera', 'könüllülük', 'cv']), isPinned: false, authorId: leyla.id },
        { title: 'Data Science öyrənmək üçün ən yaxşı Azərbaycan resursları', slug: 'datascience-az-resurslar', body: 'Python, ML, Data Viz öyrənmək üçün Azərbaycan dilindəki kanallar, gürsuslar, YouTube kanallar hansılardır? Bildiyiniz qaynaqları burada paylaşın!', tags: JSON.stringify(['datascience', 'resurslar', 'python', 'ml']), isPinned: false, authorId: nigar.id },
        { title: 'Remote iş — Azərbaycandan necə başlamaq olar?', slug: 'remote-is-baslama', body: 'Xarici şirkətlərdə uzaqdan işləmək istəyirəm. Hansi platformalar ən effektivdir? Vergi, müqavilə, ödəniş alınması üzrə məlumatı kim paylaşa bilər?', tags: JSON.stringify(['remote', 'uzaqdan-iş', 'freelance']), isPinned: false, authorId: demo.id },
        { title: 'Bakıda texnologiya tədbirləri — 2025 Təqvimi', slug: 'baki-tex-tdbbirlr-2025', body: 'Bu il Bakıda hansı texnologiya konfransları, meetuplar, hackathonlar baş tutacaq? Bildiyiniz tədbirləri paylaşın, birlikdə iştirak edək!', tags: JSON.stringify(['texnologiya', 'tədbir', 'meetup', 'Bakı']), isPinned: true, authorId: kenan.id },
    ];

    const createdTopics = await Promise.all(topicsData.map(t => prisma.forumTopic.create({ data: t })));

    // Comments
    await prisma.forumComment.createMany({
        data: [
            { body: 'Junior developer kimi 700-900 AZN interval normaldır, amma büyük şirkətlər 1500+ ödəyir. Hansı sahəyə yönəlirsənsə ona görə fərqlənir.', topicId: createdTopics[0].id, authorId: leyla.id },
            { body: 'Backend developer kimi orta 1200-1800 AZN arası realistic gözükür. Senior üçün 3000+ AZN də ala bilərsiniz.', topicId: createdTopics[0].id, authorId: orxan.id },
            { body: '2025-ci ildə React hər zaman ilk seçim olaraq qalır. Böyük ekosistem, iş imkanları çox. Vue Avropa bazarında daha çox tələb olunur.', topicId: createdTopics[1].id, authorId: kenan.id },
            { body: 'Svelte gələcəkdə böyüyə bilər, amma hazırda iş elanlarının 80%-i React biliyini tələb edir. Başlayanlar üçün React daha məntiqlidir.', topicId: createdTopics[1].id, authorId: nigar.id },
            { body: 'Mənim CV-nimdəki UNICEF könüllülüyü müsahib zamanı ən çox diqqət çəkən hissə oldu. Sosial təsir, liderlik bacarıqları — bunlar çox qiymətlidir.', topicId: createdTopics[2].id, authorId: nigar.id },
            { body: 'Coursera, edX Azərbaycan dilindəndir. Amma BHOS-un açıq YouTube dərslikləri çox faydalıdır. Fuad Paşayevin kanalını tövsiyə edirəm.', topicId: createdTopics[3].id, authorId: kenan.id },
            { body: 'Upwork, Toptal, Remote.co platformalarından başlayın. Vergi üçün ASAN xidmətdən fərdi sahibkar qeydiyyatı alın — bu vacibdir.', topicId: createdTopics[4].id, authorId: orxan.id },
        ]
    });

    await prisma.forumVote.createMany({
        data: [
            { userId: leyla.id, topicId: createdTopics[0].id, value: 1 },
            { userId: orxan.id, topicId: createdTopics[0].id, value: 1 },
            { userId: nigar.id, topicId: createdTopics[0].id, value: 1 },
            { userId: demo.id, topicId: createdTopics[0].id, value: 1 },
            { userId: kenan.id, topicId: createdTopics[1].id, value: 1 },
            { userId: leyla.id, topicId: createdTopics[1].id, value: 1 },
            { userId: nigar.id, topicId: createdTopics[1].id, value: 1 },
            { userId: kenan.id, topicId: createdTopics[2].id, value: 1 },
            { userId: orxan.id, topicId: createdTopics[2].id, value: 1 },
            { userId: orxan.id, topicId: createdTopics[3].id, value: 1 },
            { userId: kenan.id, topicId: createdTopics[3].id, value: 1 },
            { userId: demo.id, topicId: createdTopics[3].id, value: 1 },
            { userId: kenan.id, topicId: createdTopics[5].id, value: 1 },
            { userId: orxan.id, topicId: createdTopics[5].id, value: 1 },
            { userId: leyla.id, topicId: createdTopics[5].id, value: 1 },
            { userId: nigar.id, topicId: createdTopics[5].id, value: 1 },
            { userId: demo.id, topicId: createdTopics[5].id, value: 1 },
        ]
    });
    console.log(`✅ ${createdTopics.length} forum mövzusu yaradıldı`);

    console.log('\n🎉 Seed tamamlandı!\n');
    console.log('Demo hesabları yaradıldı. Parol SEED_DEMO_PASSWORD ilə təyin olunur.');
}

main()
    .catch((e) => { console.error('❌ Seed xətası:', e); process.exit(1); })
    .finally(() => prisma.$disconnect());
