import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(user);
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        // req.user = user as {id: string; username: string}; // Attach the user to the request object
        next();
    });
};
