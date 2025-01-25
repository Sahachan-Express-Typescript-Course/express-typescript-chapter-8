import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { JwtResponse } from '../auth/payload/response/jwt.response.js';
import { RefreshToken } from '../auth/entity/refresh-token.js';
import { refreshTokenRepository } from '../auth/repository/refresh-token.repository.js';
import { v4 as uuidv4 } from 'uuid';

const ACCESS_TOKEN_SECRET: Secret = process.env.JWT_ACCESS_TOKEN_SECRET as string;
const ACCESS_TOKEN_EXPIRES_IN = '15m';
// const REFRESH_TOKEN_EXPIRES_IN = '7d';

const generateTokens = async (payload: object, userId: string): Promise<JwtResponse> => {
    const accessToken: string = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
    const refreshToken = uuidv4();
    const entity: RefreshToken = {
        token: refreshToken,
        expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        isRevoke: false,
        auth: { id: userId },
    };
    await refreshTokenRepository.save(entity);
    return { accessToken, refreshToken };
};

const generateAccessToken = (payload: object): string => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
};

const verifyToken = async (token: string, isRefreshToken: boolean = false): Promise<JwtPayload | null | string> => {
    try {
        if (isRefreshToken) {
            const found = await refreshTokenRepository.findOne({ where: { token: token }, relations: ['auth'] });
            if (!found || !found.auth) {
                return null;
            }
            return { id: found.auth.id, username: found.auth.username };
        } else {
            return jwt.verify(token, ACCESS_TOKEN_SECRET);
        }
    } catch (err) {
        console.log(err);
        return null;
    }
};

export { generateTokens, generateAccessToken, verifyToken };
