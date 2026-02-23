"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WS_EVENTS = exports.PAGINATION_DEFAULTS = exports.GROUP_PRIVACY = exports.BADGE_TIERS = exports.LISTING_CATEGORIES = exports.APP_DESCRIPTION = exports.APP_NAME = void 0;
exports.APP_NAME = 'KütləWe';
exports.APP_DESCRIPTION = 'Azərbaycanlıların ictimai platforma';
exports.LISTING_CATEGORIES = [
    { value: 'VOLUNTEER', label: 'Könüllülük' },
    { value: 'EDUCATION', label: 'Təhsil' },
    { value: 'JOBS', label: 'İş elanları' },
    { value: 'SERVICES', label: 'Xidmətlər' },
    { value: 'EVENTS', label: 'Tədbirlər' },
    { value: 'OTHER', label: 'Digər' },
];
exports.BADGE_TIERS = {
    BRONZE: { label: 'Bürünc', color: '#CD7F32' },
    SILVER: { label: 'Gümüş', color: '#C0C0C0' },
    GOLD: { label: 'Qızıl', color: '#FFD700' },
    PLATINUM: { label: 'Platın', color: '#E5E4E2' },
};
exports.GROUP_PRIVACY = [
    { value: 'PUBLIC', label: 'İctimai', description: 'Hər kəs görə bilər' },
    { value: 'PRIVATE', label: 'Məxfi', description: 'Yalnız üzvlər görür' },
    { value: 'INVITE_ONLY', label: 'Dəvətlə', description: 'Yalnız dəvətlə' },
];
exports.PAGINATION_DEFAULTS = {
    PAGE: 1,
    LIMIT: 20,
    MAX_LIMIT: 50,
};
exports.WS_EVENTS = {
    SEND_MESSAGE: 'chat:send',
    NEW_MESSAGE: 'chat:new_message',
    MESSAGE_READ: 'chat:read',
    TYPING_START: 'chat:typing_start',
    TYPING_STOP: 'chat:typing_stop',
    USER_ONLINE: 'presence:online',
    USER_OFFLINE: 'presence:offline',
};
//# sourceMappingURL=index.js.map