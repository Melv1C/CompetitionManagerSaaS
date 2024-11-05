import jwt from 'jsonwebtoken';

export const generateAccessToken = (email: string) => {
    return jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
};

export const generateRefreshToken = (email: string) => {
    return jwt.sign({ email: email }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '30d' });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
}

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
}