import { AuthService } from './auth.service.js';
import { LoginRequest } from '../payload/request/login.request.js';
import { JwtResponse } from '../payload/response/jwt.response.js';
import { MeResponse } from '../payload/response/me.response.js';
import { RegisterRequest } from '../payload/request/register.request.js';
import { injectable } from 'tsyringe';
import { Auth } from '../entity/auth.js';
import { User } from '../entity/user.js';
import { authRepository } from '../repository/auth.repository.js';
import { userRepository } from '../repository/user.repository.js';

@injectable()
export class AuthServiceImpl implements AuthService {
    async login(request: LoginRequest): Promise<JwtResponse | null> {
        console.log(request);
        return null;
    }

    async me(): Promise<MeResponse | null> {
        return null;
    }

    async register(request: RegisterRequest): Promise<MeResponse | null> {
        console.log(request);
        const userData : User = {
            firstname: request.firstname,
            lastname: request.lastname,
            birthdate: request.birthdate,
        }
        await userRepository.save(userData);
        const authData : Auth = {
            username: request.username,
            password: request.password,
            user: userData,
        }
        await authRepository.save(authData);
        return null;
    }

}