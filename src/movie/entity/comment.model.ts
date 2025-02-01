import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity.js';
import { Movie } from './movie.model.js';

@Entity('tb_comment')
export class Comment extends BaseEntity {
    @Column()
    content?: string;

    @Column()
    rating?: number;

    @ManyToOne(() => Movie, (movie) => movie.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'movie_id' })
    movie?: Relation<Movie>;
}
