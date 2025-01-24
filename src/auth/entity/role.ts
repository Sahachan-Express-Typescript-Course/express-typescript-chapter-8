import { Column, Entity, ManyToMany, Relation } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity.js';
import { Auth } from './auth.js';

@Entity('tb_role')
export class Role extends BaseEntity {
    @Column()
    name?: string;

    @Column()
    description?: string;

    @ManyToMany(() => Auth, (auth) => auth.roles)
    auths?: Relation<Auth[]>;
}