export const APP_NAME = 'KütləWe';
export const APP_DESCRIPTION = 'Azərbaycanlıların ictimai platforma';

export const LISTING_CATEGORIES = [
  { value: 'VOLUNTEER', label: 'Könüllülük' },
  { value: 'EDUCATION', label: 'Təhsil' },
  { value: 'JOBS', label: 'İş elanları' },
  { value: 'SERVICES', label: 'Xidmətlər' },
  { value: 'EVENTS', label: 'Tədbirlər' },
  { value: 'OTHER', label: 'Digər' },
] as const;

export const BADGE_TIERS = {
  BRONZE: { label: 'Bürünc', color: '#CD7F32' },
  SILVER: { label: 'Gümüş', color: '#C0C0C0' },
  GOLD: { label: 'Qızıl', color: '#FFD700' },
  PLATINUM: { label: 'Platın', color: '#E5E4E2' },
} as const;

export const GROUP_PRIVACY = [
  { value: 'PUBLIC', label: 'İctimai', description: 'Hər kəs görə bilər' },
  { value: 'PRIVATE', label: 'Məxfi', description: 'Yalnız üzvlər görür' },
  { value: 'INVITE_ONLY', label: 'Dəvətlə', description: 'Yalnız dəvətlə' },
] as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 50,
} as const;

export const WS_EVENTS = {
  // Chat
  SEND_MESSAGE: 'chat:send',
  NEW_MESSAGE: 'chat:new_message',
  MESSAGE_READ: 'chat:read',
  TYPING_START: 'chat:typing_start',
  TYPING_STOP: 'chat:typing_stop',
  USER_ONLINE: 'presence:online',
  USER_OFFLINE: 'presence:offline',
} as const;
