export interface User {
    uid: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    displayNameLower?: string | null;
    emailVerified: boolean;
    isOnline?: boolean;
}
