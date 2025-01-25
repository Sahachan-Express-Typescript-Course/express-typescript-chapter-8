import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET as string;

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            user?: { id: string } | JwtPayload;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        req.user = payload as JwtPayload;
        next();
    });
};
