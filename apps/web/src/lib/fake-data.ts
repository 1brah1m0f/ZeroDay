/* ─── Fake Data for KutleWe ─── Azerbaijani education / volunteer platform ─── */

export interface FakeListing {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'VOLUNTEER' | 'LISTING' | 'EVENT';
  location: string;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
    username: string;
  };
  createdAt: string;
  deadline?: string;
  applicants: number;
  image?: string;
  featured?: boolean;
}

export interface FakeCommunity {
  id: string;
  name: string;
  slug: string;
  description: string;
  memberCount: number;
  category: string;
  type?: string;
  avatar?: string;
  isJoined?: boolean;
}

export interface FakeForumTopic {
  id: string;
  title: string;
  body: string;
  author: { name: string; username: string; avatar?: string };
  upvotes: number;
  replyCount: number;
  createdAt: string;
  tags: string[];
  pinned?: boolean;
}

export const categories = [
  { value: 'all', label: 'Hamısı', icon: '📋' },
  { value: 'education', label: 'Təhsil', icon: '📚' },
  { value: 'volunteer', label: 'Könüllülük', icon: '🤝' },
  { value: 'tech', label: 'Texnologiya', icon: '💻' },
  { value: 'design', label: 'Dizayn', icon: '🎨' },
  { value: 'language', label: 'Dil öyrənmə', icon: '🌍' },
  { value: 'career', label: 'Karyera', icon: '🚀' },
  { value: 'event', label: 'Tədbir', icon: '🎪' },
];

export const listings: FakeListing[] = [
  {
    id: '1',
    title: 'Python əsasları — Mentor tələb olunur',
    description:
      'Python dilini sıfırdan öyrənmək istəyən şagirdlərə mentorluq etmək üçün təcrübəli proqramçı axtarırıq. Həftədə 2 dəfə onlayn görüşlər olacaq.',
    category: 'tech',
    type: 'VOLUNTEER',
    location: 'Onlayn',
    tags: ['Python', 'Mentorluq', 'Proqramlaşdırma'],
    author: { name: 'Aydın Həsənov', username: 'aydin_h', avatar: undefined },
    createdAt: '2025-02-20T10:00:00Z',
    deadline: '2025-03-15T23:59:00Z',
    applicants: 12,
    featured: true,
  },
  {
    id: '2',
    title: 'Hackathon dəstəyi — Tədbir könüllüsü',
    description:
      'Bakıda keçiriləcək 48-saatlıq hackathon üçün təşkilatçı könüllülər lazımdır. Yemək, texniki dəstək və qeydiyyat sahələrində yardım.',
    category: 'event',
    type: 'EVENT',
    location: 'Bakı, ADA Universiteti',
    tags: ['Hackathon', 'Tədbir', 'Könüllülük'],
    author: { name: 'Ləman Əliyeva', username: 'leman_a', avatar: undefined },
    createdAt: '2025-02-18T14:30:00Z',
    deadline: '2025-03-01T23:59:00Z',
    applicants: 28,
    featured: true,
  },
  {
    id: '3',
    title: 'İngilis dili danışıq klubu',
    description:
      'Hər çərşənbə axşamı saat 19:00-da onlayn ingilis dili danışıq praktikası. Bütün səviyyələr xoş gəlir!',
    category: 'language',
    type: 'LISTING',
    location: 'Onlayn (Zoom)',
    tags: ['İngilis dili', 'Danışıq', 'Klub'],
    author: { name: 'Nigar Məmmədova', username: 'nigar_m', avatar: undefined },
    createdAt: '2025-02-15T09:00:00Z',
    applicants: 45,
  },
  {
    id: '4',
    title: 'UI/UX Dizayn kursu — Müəllim axtarılır',
    description:
      'Yeni başlayanlar üçün Figma əsaslı UI/UX dizayn kursu keçirmək istəyən müəllim axtarırıq. 8 həftəlik proqram.',
    category: 'design',
    type: 'LISTING',
    location: 'Hybrid (Bakı/Onlayn)',
    tags: ['Figma', 'UI/UX', 'Dizayn'],
    author: { name: 'Rəşad Quliyev', username: 'reshad_q', avatar: undefined },
    createdAt: '2025-02-12T16:00:00Z',
    deadline: '2025-02-28T23:59:00Z',
    applicants: 8,
    featured: true,
  },
  {
    id: '5',
    title: 'Kənd məktəblərində kompüter dərsi',
    description:
      'Azərbaycanın kənd məktəblərində şagirdlərə kompüter savadlılığı öyrətmək üçün könüllülər axtarırıq. Nəqliyyat təmin olunur.',
    category: 'volunteer',
    type: 'VOLUNTEER',
    location: 'Şəki, Qəbələ regionu',
    tags: ['Kənd', 'Kompüter', 'Təhsil'],
    author: { name: 'Kamran Ibrahimov', username: 'kamran_i', avatar: undefined },
    createdAt: '2025-02-10T08:00:00Z',
    applicants: 15,
  },
  {
    id: '6',
    title: 'Rəqəmsal marketinq workshop',
    description:
      'Google Ads, Meta Ads və SEO əsaslarını öyrədən 3 günlük intensiv workshop. Sertifikat verilir.',
    category: 'career',
    type: 'EVENT',
    location: 'Bakı, Coworking Space',
    tags: ['Marketinq', 'SEO', 'Workshop'],
    author: { name: 'Günel Hüseynova', username: 'gunel_h', avatar: undefined },
    createdAt: '2025-02-08T11:00:00Z',
    deadline: '2025-02-25T23:59:00Z',
    applicants: 32,
  },
  {
    id: '7',
    title: 'React.js ilə layihə quraq ',
    description:
      'Kiçik qrup halında real layihə qurmaq istəyən junior developerlar üçün peer-learning qrupu. Hər həftə canlı coding session.',
    category: 'tech',
    type: 'LISTING',
    location: 'Onlayn',
    tags: ['React', 'JavaScript', 'Layihə'],
    author: { name: 'Elvin Əhmədov', username: 'elvin_a', avatar: undefined },
    createdAt: '2025-02-05T13:00:00Z',
    applicants: 18,
  },
  {
    id: '8',
    title: 'Qaçqınlara Azərbaycan dili kursları',
    description:
      'Bakıda yaşayan qaçqın ailələr üçün pulsuz Azərbaycan dili kursları keçirmək üçün könüllü müəllimlər lazımdır.',
    category: 'volunteer',
    type: 'VOLUNTEER',
    location: 'Bakı',
    tags: ['Azərbaycan dili', 'Qaçqınlar', 'Könüllülük'],
    author: { name: 'Səbinə Vəliyeva', username: 'sebine_v', avatar: undefined },
    createdAt: '2025-02-03T10:00:00Z',
    applicants: 7,
  },
  {
    id: '9',
    title: 'Data Science öyrənmə qrupu',
    description:
      'Kaggle yarışmalarına birlikdə qatılmaq istəyən data enthusiast-lar üçün həftəlik görüşlər. SQL, Python, ML basics.',
    category: 'education',
    type: 'LISTING',
    location: 'Onlayn',
    tags: ['Data Science', 'Kaggle', 'ML'],
    author: { name: 'Tural Nəsibov', username: 'tural_n', avatar: undefined },
    createdAt: '2025-02-01T07:00:00Z',
    applicants: 22,
  },
  {
    id: '10',
    title: 'Ağac əkmə aksiyası — Şamaxı',
    description:
      'Bahar mövsümü münasibətilə Şamaxıda ağac əkmə aksiyası təşkil edirik. Könüllü qeydiyyatı açıqdır!',
    category: 'volunteer',
    type: 'EVENT',
    location: 'Şamaxı',
    tags: ['Ekologiya', 'Ağac əkmə', 'Könüllülük'],
    author: { name: 'Fərid Babayev', username: 'ferid_b', avatar: undefined },
    createdAt: '2025-01-28T12:00:00Z',
    deadline: '2025-03-20T23:59:00Z',
    applicants: 55,
  },
];

export const communities: FakeCommunity[] = [
  {
    id: '1',
    name: 'Frontend Developers Azerbaijan',
    slug: 'frontend-az',
    description: 'React, Vue, Angular və digər frontend texnologiyalar haqqında müzakirə qrupu.',
    memberCount: 342,
    category: 'tech',
  },
  {
    id: '2',
    name: 'Könüllü Hərəkat',
    slug: 'konullu-herekat',
    description: 'Azərbaycanda könüllülük fəaliyyətlərini koordinasiya edən icma.',
    memberCount: 578,
    category: 'volunteer',
  },
  {
    id: '3',
    name: 'Dil Öyrənənlər',
    slug: 'dil-oyrenenlr',
    description: 'İngilis, alman, fransız və digər dilləri öyrənənlər üçün dəstək qrupu.',
    memberCount: 215,
    category: 'language',
  },
  {
    id: '4',
    name: 'Startup Founders Baku',
    slug: 'startup-founders-baku',
    description: 'Bakıda startap qurmuş və qurmaq istəyən sahibkarlar üçün networking qrupu.',
    memberCount: 128,
    category: 'career',
  },
  {
    id: '5',
    name: 'Ekologiya və Dayanıqlı İnkişaf',
    slug: 'ekologiya',
    description: 'Ətraf mühitin qorunması və dayanıqlı inkişaf layihələri üzrə icma.',
    memberCount: 96,
    category: 'volunteer',
  },
];

export const forumTopics: FakeForumTopic[] = [
  {
    id: '1',
    title: 'Junior developer olaraq ilk işi necə tapmaq olar?',
    body: 'Salam hamıya! 6 aydır React öyrənirəm, portfolio hazırdır. İlk işi tapmaq üçün hansı addımları atmalıyam?',
    author: { name: 'Murad Əsgərov', username: 'murad_e' },
    upvotes: 24,
    replyCount: 18,
    createdAt: '2025-02-21T09:00:00Z',
    tags: ['Karyera', 'Junior', 'React'],
    pinned: true,
  },
  {
    id: '2',
    title: 'Bakıda ən yaxşı coworking space-lər?',
    body: 'Freelance işləyirəm, sakitcə oturub işləmək üçün rahat coworking axtarıram. Təklifləriniz?',
    author: { name: 'Aynur Kazımova', username: 'aynur_k' },
    upvotes: 15,
    replyCount: 12,
    createdAt: '2025-02-19T15:00:00Z',
    tags: ['Freelance', 'Coworking'],
  },
  {
    id: '3',
    title: 'Python vs JavaScript — 2025-də hansını öyrənmək daha yaxşıdır?',
    body: 'Proqramlaşdırmaya yeni başlayıram. Hansı dildən başlamağı məsləhət görürsünüz?',
    author: { name: 'Orxan Həsənli', username: 'orxan_h' },
    upvotes: 32,
    replyCount: 27,
    createdAt: '2025-02-17T12:00:00Z',
    tags: ['Python', 'JavaScript', 'Proqramlaşdırma'],
  },
  {
    id: '4',
    title: 'Könüllülük təcrübəsi CV-yə necə fayda verir?',
    body: 'HR mütəxəssis kimi deyə bilərəm ki, könüllülük CV-yə çox böyük dəyər qatır. Necə — izah edirəm...',
    author: { name: 'Leyla Sultanova', username: 'leyla_s' },
    upvotes: 41,
    replyCount: 9,
    createdAt: '2025-02-14T10:00:00Z',
    tags: ['CV', 'Karyera', 'Könüllülük'],
  },
  {
    id: '5',
    title: 'Azərbaycanda IT sahəsində maaşlar necədir?',
    body: 'Junior, mid, senior səviyyələr üçün orta maaş aralıqları nə qədərdir? Təcrübənizi bölüşün.',
    author: { name: 'Cavid Məmmədov', username: 'cavid_m' },
    upvotes: 58,
    replyCount: 35,
    createdAt: '2025-02-10T08:00:00Z',
    tags: ['IT', 'Maaş', 'Karyera'],
  },
];

export const stats = [
  { label: 'Aktiv elan', value: '120+', icon: '📋' },
  { label: 'Könüllü', value: '2,400+', icon: '🤝' },
  { label: 'İcma', value: '45+', icon: '👥' },
  { label: 'Şəhər', value: '18+', icon: '📍' },
];

export const features = [
  {
    title: 'Elan paylaş',
    description: 'Mentor, könüllü və ya tədbir elanı yarat — icma ilə birləş.',
    icon: '📝',
  },
  {
    title: 'İcmalara qoşul',
    description: 'Maraqlarına uyğun icmalara qoşul, birlikdə öyrən və böyü.',
    icon: '👥',
  },
  {
    title: 'Könüllü ol',
    description: 'Cəmiyyətə fayda ver. Yeni bacarıqlar qazan, yeni insanlarla tanış ol.',
    icon: '🤝',
  },
  {
    title: 'Forum müzakirə',
    description: 'Suallarını ver, təcrübəni paylaş, icmadan dəstək al.',
    icon: '💬',
  },
];
