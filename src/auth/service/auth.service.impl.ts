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
import bcrypt from 'bcrypt';

@injectable()
export class AuthServiceImpl implements AuthService {
    async login(request: LoginRequest): Promise<JwtResponse | null> {
        console.log(request);
        return null;
    }

    async me(): Promise<MeResponse | null> {
        return null;
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
        if (!output) return null;
        if (!output.user) return null;
        if (!output.roles) return null;
        return {
            id: output.id as string,
            firstname: output.user.firstname as string,
            lastname: output.user.lastname as string,
            username: output.username as string,
            birthdate: output.user.birthdate as Date,
            roles: output.roles.map((role) => role.name) as string[],
        };
    }
}
