import { AuthService } from './auth.service.js';
import { LoginRequest } from '../payload/request/login.request.js';
import { JwtResponse } from '../payload/response/jwt.response.js';
import { MeResponse } from '../payload/response/me.response.js';
import { RegisterRequest } from '../payload/request/register.request.js';
import { injectable } from 'tsyringe';
import { Auth } from '../entity/auth.js';
import { User } from '../entity/user.js';
import { roleRepository } from '../repository/role.repository.js';
import { authRepository } from '../repository/auth.repository.js';
import { userRepository } from '../repository/user.repository.js';
import { refreshTokenRepository } from '../repository/refresh-token.repository.js';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateTokens, verifyToken } from '../../utils/jwt.util.js';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class AuthServiceImpl implements AuthService {
    async login(request: LoginRequest): Promise<JwtResponse | null> {
        const auth = await authRepository.findOne({
            where: { username: request.username },
            relations: ['roles', 'user'],
        });

        if (!auth || !auth.password || !bcrypt.compareSync(request.password, auth.password)) {
            return null;
        }
        await this.revokeAllTokens(auth.id as string);
        return await generateTokens({ id: auth.id, username: auth.username }, auth.id as string);
    }

    async refreshToken(token: string): Promise<JwtResponse | null | number> {
        const payload = await verifyToken(token, true);
        if (!payload) return 1;

        const { id, username } = payload as { id: string; username: string };
        const refreshTokenEntity = await refreshTokenRepository.findOne({
            where: { token, isRevoke: false },
            relations: ['auth'],
        });

        if (!refreshTokenEntity) return 2;

        if (refreshTokenEntity.expireAt && refreshTokenEntity.expireAt < new Date()) {
            refreshTokenEntity.isRevoke = true;
            await refreshTokenRepository.save(refreshTokenEntity);
            return 3;
        }

        const newAccessToken = generateAccessToken({ id, username });
        const newRefreshToken = uuidv4();
        refreshTokenEntity.token = newRefreshToken;
        await refreshTokenRepository.save(refreshTokenEntity);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    async me(id: string): Promise<MeResponse | null> {
        const auth = await authRepository.findOne({
            where: { id },
            relations: ['roles', 'user'],
        });

        if (!auth || !auth.user || !auth.roles) return null;
        return {
            id: auth.id as string,
            firstname: auth.user.firstname as string,
            lastname: auth.user.lastname as string,
            username: auth.username as string,
            birthdate: auth.user.birthdate as Date,
            roles: auth.roles.map((role) => role.name) as string[],
        };
    }

    async register(request: RegisterRequest, assignRole: string): Promise<MeResponse | null> {
        const role = await roleRepository.findOne({ where: { name: assignRole } });
        const user: User = {
            firstname: request.firstname,
            lastname: request.lastname,
            birthdate: request.birthdate,
        };
        await userRepository.save(user);
        const auth: Auth = {
            username: request.username,
            password: bcrypt.hashSync(request.password, 10),
        };
        await authRepository.save(auth);

        if (auth && role && user) {
            auth.roles = role ? [role] : [];
            auth.user = user;
            await authRepository.save(auth);
        }

        const output = await authRepository.findOne({
            where: { username: request.username },
            relations: ['user', 'roles'],
        });
        if (!output || !output.user || !output.roles) return null;
        return {
            id: output.id as string,
            firstname: output.user.firstname as string,
            lastname: output.user.lastname as string,
            username: output.username as string,
            birthdate: output.user.birthdate as Date,
            roles: output.roles.map((role) => role.name) as string[],
        };
    }

    async revokeAllTokens(userId: string): Promise<void> {
        await refreshTokenRepository.update({ auth: { id: userId } }, { isRevoke: true });
    }

    async revokeToken(token: string): Promise<boolean> {
        const refreshTokenEntity = await refreshTokenRepository.findOne({ where: { token } });
        if (!refreshTokenEntity) return false;

        refreshTokenEntity.isRevoke = true;
        await refreshTokenRepository.save(refreshTokenEntity);
        return true;
    }
}
