import { TokenData$, User } from '@competition-manager/schemas';

export const UserToTokenData = (user: User) => {
    return TokenData$.parse(user);
}