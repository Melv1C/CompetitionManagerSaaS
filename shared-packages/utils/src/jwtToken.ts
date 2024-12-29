import jwt from 'jsonwebtoken';
import { EncodeToken, EncodeToken$, TokenData, TokenData$ } from '@competition-manager/schemas';

const generateToken = (tokenData: TokenData, secret: string, expiresIn: string) => {
    return EncodeToken$.parse(jwt.sign(tokenData, secret, { expiresIn }));
};

const verifyToken = (token: EncodeToken, secret: string) => {
    try {
        return TokenData$.parse(jwt.verify(token, secret));
    } catch (error) {
        return false;
    }
};

export const generateAccessToken = (tokenData: TokenData) => {
    return generateToken(tokenData, process.env.ACCESS_TOKEN_SECRET!, '15m');
};

export const generateRefreshToken = (tokenData: TokenData) => {
    return generateToken(tokenData, process.env.REFRESH_TOKEN_SECRET!, '30d');
};

export const generateVerificationToken = (tokenData: TokenData) => {
    return generateToken(tokenData, process.env.VERIFY_EMAIL_TOKEN_SECRET!, '7d');
};

export const generateResetPasswordToken = (tokenData: TokenData) => {
    return generateToken(tokenData, process.env.RESET_PASSWORD_TOKEN_SECRET!, '15m');
};

export const verifyAccessToken = (token: EncodeToken) => {
    return verifyToken(token, process.env.ACCESS_TOKEN_SECRET!);
};

export const verifyRefreshToken = (token: EncodeToken) => {
    return verifyToken(token, process.env.REFRESH_TOKEN_SECRET!);
};

export const verifyVerificationToken = (token: EncodeToken) => {
    return verifyToken(token, process.env.VERIFY_EMAIL_TOKEN_SECRET!);
};

export const verifyResetPasswordToken = (token: EncodeToken) => {
    return verifyToken(token, process.env.RESET_PASSWORD_TOKEN_SECRET!);
};
