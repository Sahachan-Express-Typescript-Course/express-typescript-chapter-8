import { CommentDto } from './comment.dto.js';
export interface MovieDto {
    id: string;
    title: string;
    description: string;
    releaseDate: Date;
    comments: CommentDto[];
}
