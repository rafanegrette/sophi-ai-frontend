import { Chapter } from './Chapter';
import { ContentIndex } from './ContentIndex';

export interface Book {
    id: String;
    title: String;
    contentTable: ContentIndex[];
    chapters: Chapter[];
}