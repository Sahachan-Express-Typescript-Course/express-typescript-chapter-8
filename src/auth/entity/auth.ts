import { BaseEntity } from '../../shared/base.entity.js';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, Relation } from 'typeorm';
import { RefreshToken } from './refresh-token.js';
import { User } from './user.js';
import { Role } from './role.js';

@Entity('tb_auth')
export class Auth extends BaseEntity {
    @Column({ unique: true })
    username?: string;

    @Column()
    password?: string;

    @Column({ name: 'is_active', default: true })
    isActive?: boolean;

    @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.auth, { cascade: true })
    refreshTokens?: Relation<RefreshToken[]>;

    @OneToOne(() => User, (user) => user.auth, { cascade: true })
    user?: Relation<User>;

    @ManyToMany(() => Role, (role) => role.auths, { cascade: true })
    @JoinTable({
        name: 'tb_auth_roles',
        joinColumn: { name: 'auth_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    })
    roles?: Relation<Role[]>;
}