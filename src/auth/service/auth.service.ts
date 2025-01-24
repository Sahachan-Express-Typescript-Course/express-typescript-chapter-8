import { LoginRequest } from '../payload/request/login.request.js';
import { JwtResponse } from '../payload/response/jwt.response.js';
import { RegisterRequest } from '../payload/request/register.request.js';
import { MeResponse } from '../payload/response/me.response.js';

export interface AuthService {
    login(request: LoginRequest): Promise<JwtResponse | null>;
    refreshToken(token: string): Promise<JwtResponse | null>;
    revokeToken(token: string): Promise<boolean>;
    revokeAllTokens(authId: string): Promise<void>;
    register(request: RegisterRequest, assignRole: string): Promise<MeResponse | null>;
    me(): Promise<MeResponse | null>;
}
