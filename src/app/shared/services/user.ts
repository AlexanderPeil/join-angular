export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    displayNameLower?: string | null;
    photoURL: string | null | undefined;
    emailVerified: boolean;
    isOnline?: boolean;
}
