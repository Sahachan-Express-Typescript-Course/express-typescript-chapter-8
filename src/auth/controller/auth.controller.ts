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
        if (!response) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }
        res.status(200).json(response);
    }

    public async refreshToken(req: Request, res: Response): Promise<void> {
        const { token } = req.body.token;
        const response = await this.authService.refreshToken(token);
        if (!response) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
        res.status(200).json(response);
    }

    public async logout(req: Request, res: Response): Promise<void> {
        const { token } = req.body.token;
        const response = await this.authService.revokeToken(token);
        if (!response) {
            res.status(400).json({ message: 'Invalid token' });
            return;
        }
        res.status(200).json({ message: 'Logout success' });
    }

    public async registerStaff(req: Request, res: Response) {
        const request: RegisterRequest = req.body;
        const response = await this.authService.register(request, 'STAFF');
        const me: ResponseDto<MeResponse> = new ResponseDto({ data: response });
        res.status(200).json(me);
    }

    public async registerMember(req: Request, res: Response) {
        const request: RegisterRequest = req.body;
        const response = await this.authService.register(request, 'MEMBER');
        const me: ResponseDto<MeResponse> = new ResponseDto({ data: response });
        res.status(200).json(me);
    }

    public async me(req: Request, res: Response) {
        const me = await this.authService.me();
        const response: ResponseDto<MeResponse> = new ResponseDto({ data: me });
        res.status(200).json(response);
    }
}
