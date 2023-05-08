import { Chapter } from './Chapter';
import { ContentIndex } from './ContentIndex';

export interface Book {
    title: String;
    contentTable: ContentIndex[];
    chapters: Chapter[];
}