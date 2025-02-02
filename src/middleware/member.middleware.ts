import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { container } from 'tsyringe';
import { AuthServiceImpl } from '../auth/service/auth.service.impl.js';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET as string;

export const memberGuard = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const authService = container.resolve(AuthServiceImpl);

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
        authService
            .me(req.user.id)
            .then((user) => {
                if (user?.roles.includes('MEMBER')) {
                    next();
                } else {
                    res.status(403).json({ message: 'you are not member' });
                }
            })
            .catch((err) => {
                res.status(500).json({ message: err.message });
            });
    });
};
