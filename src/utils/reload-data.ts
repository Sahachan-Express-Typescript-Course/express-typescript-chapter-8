import { injectable } from 'tsyringe';
import { authRepository } from '../auth/repository/auth.repository.js';
import { userRepository } from '../auth/repository/user.repository.js';
import { roleRepository } from '../auth/repository/role.repository.js';
import { refreshTokenRepository } from '../auth/repository/refresh-token.repository.js';
import { Role } from '../auth/entity/role.js';
import { User } from '../auth/entity/user.js';
import { Auth } from '../auth/entity/auth.js';
import bcrypt from 'bcrypt';

@injectable()
export class LoadData {
    public async load() {
        if (process.env.RELOAD_AUTH_DATA === 'true') {
            await refreshTokenRepository.delete({});
            await roleRepository.delete({});
            await userRepository.delete({});
            await authRepository.delete({});
            await this.loadRole();
            await this.loadUser();
            await this.loadAuth();
            await this.createAccount();
            console.log('data reloaded');
        }
    }

    private async loadRole() {
        console.log('adding initial roles...');
        const adminRole: Role = {
            name: 'ADMIN',
            description: 'Administrator Role',
        };
        const memberRole: Role = {
            name: 'MEMBER',
            description: 'member Role',
        };
        const staffRole: Role = {
            name: 'STAFF',
            description: 'staff Role',
        };
        await roleRepository.save(adminRole);
        await roleRepository.save(memberRole);
        await roleRepository.save(staffRole);
    }

    private async loadUser() {
        console.log('adding users data...');
        const admin: User = {
            firstname: 'adminf',
            lastname: 'adminl',
            birthdate: new Date('1990-01-01'),
        };
        const member: User = {
            firstname: 'memberf',
            lastname: 'memberl',
            birthdate: new Date('2000-11-09'),
        };
        const staff: User = {
            firstname: 'stafff',
            lastname: 'staffl',
            birthdate: new Date('1995-01-01'),
        };
        await userRepository.save(admin);
        await userRepository.save(member);
        await userRepository.save(staff);
    }

    private async loadAuth() {
        console.log('adding authentication data...');
        const admin: Auth = {
            username: 'admin',
            password: bcrypt.hashSync('admin', 10),
        };
        const member: Auth = {
            username: 'member',
            password: bcrypt.hashSync('member', 10),
        };
        const staff: Auth = {
            username: 'staff',
            password: bcrypt.hashSync('staff', 10),
        };
        await authRepository.save(admin);
        await authRepository.save(member);
        await authRepository.save(staff);
    }

    private async createAccount() {
        console.log('creating account...');

        const adminRole = await roleRepository.findOne({ where: { name: 'ADMIN' } });
        const memberRole = await roleRepository.findOne({ where: { name: 'MEMBER' } });
        const staffRole = await roleRepository.findOne({ where: { name: 'STAFF' } });

        const adminUser = await userRepository.findOne({ where: { firstname: 'adminf' } });
        const memberUser = await userRepository.findOne({ where: { firstname: 'memberf' } });
        const staffUser = await userRepository.findOne({ where: { firstname: 'stafff' } });

        const adminAuth = await authRepository.findOne({ where: { username: 'admin' } });
        const memberAuth = await authRepository.findOne({ where: { username: 'member' } });
        const staffAuth = await authRepository.findOne({ where: { username: 'staff' } });

        if (adminAuth && adminRole && adminUser) {
            adminAuth.roles = adminRole ? [adminRole] : [];
            adminAuth.user = adminUser;
            await authRepository.save(adminAuth);
        }

        if (memberAuth && memberRole && memberUser) {
            memberAuth.roles = memberRole ? [memberRole] : [];
            memberAuth.user = memberUser;
            await authRepository.save(memberAuth);
        }

        if (staffAuth && staffRole && staffUser) {
            staffAuth.roles = staffRole ? [staffRole] : [];
            staffAuth.user = staffUser;
            await authRepository.save(staffAuth);
        }
    }
}
