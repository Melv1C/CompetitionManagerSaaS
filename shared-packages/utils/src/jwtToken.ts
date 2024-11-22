import jwt from 'jsonwebtoken';
import { TokenData, TokenData$ } from '@competition-manager/schemas';


export const generateAccessToken = (tokenData: TokenData) => { //when use in a api don't forget to put the .env with ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET
    return jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
};

export const generateRefreshToken = (tokenData: TokenData) => {
    return jwt.sign(tokenData, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '30d' });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
}

//return false or the decoded token
export const verifyRefreshToken = (token: string) => {
    try {
        return TokenData$.parse(jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!));
    } catch (error) {
        return false;
    }
}