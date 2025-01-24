import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service.js';
import { LoginRequest } from '../payload/request/login.request.js';
import { RegisterRequest } from '../payload/request/register.request.js';
import { ResponseDto } from '../../shared/base.response.js';
import { MeResponse } from '../payload/response/me.response.js';

@injectable()
export class AuthController {
    constructor(@inject('AuthService') private authService: AuthService) {}

    public async login(req: Request, res: Response): Promise<void> {
        const request: LoginRequest = req.body;
        const response = await this.authService.login(request);
        res.status(200).json(response);
    }

    public async register(req: Request, res: Response) {
        const request: RegisterRequest = req.body;
        const response = await this.authService.register(request);
        res.status(200).json(response);
    }

    public async me(req: Request, res: Response) {
        const me = await this.authService.me();
        const response: ResponseDto<MeResponse> = new ResponseDto({ data: me });
        res.status(200).json(response);
    }
}
