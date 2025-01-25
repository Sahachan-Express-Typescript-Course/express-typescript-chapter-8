import { Column, Entity, JoinColumn, OneToOne, Relation } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity.js';
import { Auth } from './auth.js';

@Entity('tb_user')
export class User extends BaseEntity {
    @Column()
    firstname?: string;

    @Column()
    lastname?: string;

    @Column({ type: 'date' })
    birthdate?: Date;

    @OneToOne(() => Auth, (auth) => auth.user)
    @JoinColumn({ name: 'auth_id' })
    auth?: Relation<Auth>;
}
