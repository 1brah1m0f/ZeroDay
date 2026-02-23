export declare const APP_NAME = "K\u00FCtl\u0259We";
export declare const APP_DESCRIPTION = "Az\u0259rbaycanl\u0131lar\u0131n ictimai platforma";
export declare const LISTING_CATEGORIES: readonly [{
    readonly value: "VOLUNTEER";
    readonly label: "Könüllülük";
}, {
    readonly value: "EDUCATION";
    readonly label: "Təhsil";
}, {
    readonly value: "JOBS";
    readonly label: "İş elanları";
}, {
    readonly value: "SERVICES";
    readonly label: "Xidmətlər";
}, {
    readonly value: "EVENTS";
    readonly label: "Tədbirlər";
}, {
    readonly value: "OTHER";
    readonly label: "Digər";
}];
export declare const BADGE_TIERS: {
    readonly BRONZE: {
        readonly label: "Bürünc";
        readonly color: "#CD7F32";
    };
    readonly SILVER: {
        readonly label: "Gümüş";
        readonly color: "#C0C0C0";
    };
    readonly GOLD: {
        readonly label: "Qızıl";
        readonly color: "#FFD700";
    };
    readonly PLATINUM: {
        readonly label: "Platın";
        readonly color: "#E5E4E2";
    };
};
export declare const GROUP_PRIVACY: readonly [{
    readonly value: "PUBLIC";
    readonly label: "İctimai";
    readonly description: "Hər kəs görə bilər";
}, {
    readonly value: "PRIVATE";
    readonly label: "Məxfi";
    readonly description: "Yalnız üzvlər görür";
}, {
    readonly value: "INVITE_ONLY";
    readonly label: "Dəvətlə";
    readonly description: "Yalnız dəvətlə";
}];
export declare const PAGINATION_DEFAULTS: {
    readonly PAGE: 1;
    readonly LIMIT: 20;
    readonly MAX_LIMIT: 50;
};
export declare const WS_EVENTS: {
    readonly SEND_MESSAGE: "chat:send";
    readonly NEW_MESSAGE: "chat:new_message";
    readonly MESSAGE_READ: "chat:read";
    readonly TYPING_START: "chat:typing_start";
    readonly TYPING_STOP: "chat:typing_stop";
    readonly USER_ONLINE: "presence:online";
    readonly USER_OFFLINE: "presence:offline";
};
