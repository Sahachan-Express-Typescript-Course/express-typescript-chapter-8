import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service.js';
import { LoginRequest } from '../payload/request/login.request.js';
import { RegisterRequest } from '../payload/request/register.request.js';
import { ResponseDto } from '../../shared/base.response.js';
import { MeResponse } from '../payload/response/me.response.js';
import { JwtResponse } from '../payload/response/jwt.response.js';

@injectable()
export class AuthController {
    constructor(@inject('AuthService') private authService: AuthService) {}

    public async login(req: Request, res: Response): Promise<void> {
        const request: LoginRequest = req.body;
        const jwt = await this.authService.login(request);
        if (!jwt) {
            const error: ResponseDto<string> = new ResponseDto({ message: 'Invalid username or password', status: 400 });
            res.status(400).json(error);
            return;
        }
        const response: ResponseDto<JwtResponse> = new ResponseDto({ data: jwt });
        res.status(200).json(response);
    }

    public async refreshToken(req: Request, res: Response): Promise<void> {
        const { refreshToken } = req.body;
        const jwt = await this.authService.refreshToken(refreshToken);
        if (jwt === 1) {
            const error: ResponseDto<string> = new ResponseDto({ message: 'Invalid token, please try again', status: 400 });
            res.status(400).json(error);
            return;
        }
        if (jwt === 2) {
            const error: ResponseDto<string> = new ResponseDto({ message: 'Token revoked, please login again', status: 400 });
            res.status(400).json(error);
            return;
        }
        if (jwt === 3) {
            const error: ResponseDto<string> = new ResponseDto({ message: 'Token expired, plrease login again', status: 400 });
            res.status(400).json(error);
            return;
        }
        if (!jwt) {
            const error: ResponseDto<string> = new ResponseDto({ message: 'Invalid token, please login again', status: 400 });
            res.status(400).json(error);
            return;
        }
        const response: ResponseDto<JwtResponse> = new ResponseDto({ data: jwt as JwtResponse });
        res.status(200).json(response);
    }

    public async logout(req: Request, res: Response): Promise<void> {
        const { refreshToken } = req.body;
        const result = await this.authService.revokeToken(refreshToken);
        if (!result) {
            const error: ResponseDto<string> = new ResponseDto({ message: 'Invalid token', status: 400 });
            res.status(400).json(error);
            return;
        }
        const response: ResponseDto<string> = new ResponseDto({ data: 'Logout success' });
        res.status(200).json(response);
    }

    public async revokeAllTokens(req: Request, res: Response): Promise<void> {
        const auth_id = req.user?.id;
        await this.authService.revokeAllTokens(auth_id);
        const response: ResponseDto<string> = new ResponseDto({ data: 'Logout all success' });
        res.status(200).json(response);
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
        const me = await this.authService.me(req.user?.id);
        const response: ResponseDto<MeResponse> = new ResponseDto({ data: me });
        res.status(200).json(response);
    }
}
