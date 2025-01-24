import { BaseEntity } from '../../shared/base.entity.js';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { Auth } from './auth.js';

@Entity('tb_refresh_token')
export class RefreshToken extends BaseEntity {
    @Column({ unique: true, generated: 'uuid' })
    token?: string;

    @Column({ name: 'expire_at', type: 'timestamp' })
    expireAt?: Date;

    @Column({ name: 'is_revoke' })
    isRevoke?: boolean;

    @ManyToOne(() => Auth, (auth) => auth.refreshTokens)
    @JoinColumn({ name: 'auth_id' })
    auth?: Relation<Auth>;
}