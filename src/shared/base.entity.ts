import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ name: 'created_at' })
    @CreateDateColumn()
    createdAt?: Date;

    @Column({ name: 'updated_at' })
    @UpdateDateColumn()
    updatedAt?: Date;
}
