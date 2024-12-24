import jwt from 'jsonwebtoken';
import { EncodeToken$, TokenData, TokenData$ } from '@competition-manager/schemas';

//when use in a api don't forget to put the .env with ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET
export const generateAccessToken = (tokenData: TokenData) => {
    return EncodeToken$.parse(jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' }));
};

export const generateRefreshToken = (tokenData: TokenData) => {
    return EncodeToken$.parse(jwt.sign(tokenData, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '30d' }));
};

//return false or the decoded token
export const verifyAccessToken = (token: string) => {
    try {
        return TokenData$.parse(jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!));
    } catch (error) {
        return false;
    }
}

//return false or the decoded token
export const verifyRefreshToken = (token: string) => {
    try {
        return TokenData$.parse(jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!));
    } catch (error) {
        return false;
    }
}