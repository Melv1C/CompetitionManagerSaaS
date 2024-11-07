import { TokenData$, User } from '@competition-manager/schemas';

export const UserToTokenData = (user: User) => {
    return TokenData$.parse({
        email: user.email,
        role: user.role,
        theme: user.preferences?.theme || 'light',
        language: user.preferences?.language || 'fr'
    });
}