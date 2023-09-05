import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Book } from '../../models/Book';

interface Title {
    id : string;
    title : string;
    label: string;
}

export const readingApiSlice = createApi({
    reducerPath: 'apiBooks',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api/books',
        prepareHeaders(headers) {
            headers.set('Accept', 'application/json');
        }
    }),
    endpoints(builder) {
        return {
            fetchTitles: builder.query<Title[], boolean>({
                query() {
                    return `/titles`;
                }
            }),
            fetchBook: builder.query<Book, string>({
                query(bookId) {
                    return `/${bookId}`;
                }
            })
        }
    }
});

export const { useFetchTitlesQuery, useFetchBookQuery } = readingApiSlice;