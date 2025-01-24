import { inject, injectable } from 'tsyringe';
import { AuthService } from '../service/auth.service.js';
import { LoginRequest } from '../payload/request/login.request.js';
import { RegisterRequest } from '../payload/request/register.request.js';

@injectable()
export class AuthController {
    constructor(@inject('AuthService') private readonly authService: AuthService) {}

    public async login(request: LoginRequest) {
        return await this.authService.login(request);
    }

    public async register(request: RegisterRequest) {
        return await this.authService.register(request);
    }

    public async me() {
        return await this.authService.me();
    }
}
