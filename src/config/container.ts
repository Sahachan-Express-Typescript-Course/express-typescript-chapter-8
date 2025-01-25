import 'reflect-metadata';
import { container } from 'tsyringe';

import { AuthService } from '../auth/service/auth.service.js';
import { AuthServiceImpl } from '../auth/service/auth.service.impl.js';

container.register<AuthService>('AuthService', { useClass: AuthServiceImpl });
